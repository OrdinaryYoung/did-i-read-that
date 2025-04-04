<script lang="ts">
	import { onMount } from 'svelte';
	import { scale, slide } from 'svelte/transition';
	import { inview } from 'svelte-inview';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faCirclePlus,
		faChartSimple,
		faBookOpen,
		faPencil,
		faTrashCan
	} from '@fortawesome/free-solid-svg-icons';

	import {
		GlobalModal,
		EditModal,
		StatusIndicatorUl,
		StatusIndicatorLi,
		LoadingModal
	} from '$lib/components';
	import { openModal, showToast } from '$lib/stores';
	import { formatDate, LoadBooksStorage, UpdateBookStorage, DeleteBookStorage } from '$lib/utils';

	import type { Book } from '$lib/types';
	import {
		validateAuthor,
		validatePages,
		validateProgress,
		validateTitle
	} from '$lib/utils/validate/book';

	let books: Book[] = $state([]);

	let stats = $state({
		reading: 0,
		completed: 0,
		'on-hold': 0,
		dropped: 0,
		'plan-to-read': 0,
		totalBooks: 0,
		totalPages: 0
	});

	const statusColors: Record<string, string> = {
		'plan-to-read': 'gray-400',
		reading: 'green-500',
		completed: 'indigo-700',
		'on-hold': 'amber-400',
		dropped: 'red-700'
	};

	let isPageLoading: boolean = $state(true);
	let ProgressIsInView: boolean = $state(false);
	let barIsInView: boolean = $state(false);

	const updateBook = (book: Book) => {
		try {
			openModal(
				EditModal,
				'form',
				`Edit ${book.title}`,
				'',
				'green',
				book,
				(updatedBook: Book) => {
					try {
						updatedBook.progress =
							updatedBook.status == 'completed'
								? updatedBook.pages
								: updatedBook.status == 'plan-to-read'
									? 0
									: updatedBook.progress;

						const vt = validateTitle(updatedBook.title);
						if (vt) throw vt;

						const va = validateAuthor(updatedBook.author);
						if (va) throw va;

						const vpg = validatePages(updatedBook.pages);
						if (vpg) throw vpg;

						const vpr = validateProgress(
							updatedBook.progress,
							updatedBook.status,
							updatedBook.pages
						);
						if (vpr) throw vpr;

						UpdateBookStorage(updatedBook);
						books = LoadBooksStorage();
						updateStats();
						showToast('Book Updated successfully!', 'success');
					} catch (error) {
						console.error('Error updating book:', error);
						throw Error(error as string);
					}
				},
				'Save',
				'Discard'
			);
		} catch (error) {
			showToast('Error updating book.. Please try later!', 'error');
			console.error(error);
		}
	};

	const deleteBook = (book: Book) => {
		try {
			openModal(
				GlobalModal,
				'medium',
				'Delete Book?',
				`Are you sure you want to delete "${book.title}"? This action cannot be undone.`,
				'red',
				{},
				() => {
					try {
						DeleteBookStorage(book.id);
						books = LoadBooksStorage();
						showToast('Book deleted successfully!', 'success');
						updateStats();
					} catch (error) {
						throw Error('Error deleting book: ' + error);
					}
				},
				'Delete',
				'Cancel'
			);
		} catch (error) {
			showToast('Error deleting book.. Please try later!', 'error');
			console.error(error);
		}
	};

	const updateStats = () => {
		stats.totalBooks = books.length;
		stats.totalPages = books.reduce((sum, book) => sum + book.progress, 0);

		Object.keys(stats).forEach((status) => {
			if (status !== 'totalBooks' && status !== 'totalPages') {
				stats[status as keyof typeof stats] = books.filter((book) => book.status === status).length;
			}
		});
	};

	onMount(() => {
		isPageLoading = true;
		books = LoadBooksStorage();
		updateStats();
		isPageLoading = false;
	});
</script>

{#if isPageLoading}
	<LoadingModal />
{:else}
	<section
		class="container mx-auto px-4 pb-16"
		in:scale={{ duration: 500, delay: 10, easing: (t) => t * t }}
	>
		{#if books.filter((book) => book.status === 'reading').length !== 0}
			{@const CONT_BOOK: Book = books.filter((book)=> book.status === 'reading')[0]}
			<section class="mx-auto mt-12 grid w-full justify-center gap-8 text-center">
				<h1 class="text-2xl font-semibold">Continue Reading</h1>
				<div
					class="flex h-fit w-2xs flex-col gap-4 rounded-lg border border-gray-300 p-4 shadow-lg"
				>
					<img src="https://placehold.co/300x350?text=?" alt="book cover" class="rounded-lg" />
					<div>
						<p class="text-xl font-semibold">{CONT_BOOK.title}</p>
						<p>{CONT_BOOK.author}</p>
						<div class="mt-6">
							<p class="mb-0.5 text-end text-[.7rem] text-gray-400">
								page <span
									class="text-sm"
									style="color: var(--color-{statusColors[CONT_BOOK.status]})"
									>{CONT_BOOK.progress}</span
								>
								of {CONT_BOOK.pages}
							</p>
							<div
								use:inview={{ unobserveOnEnter: true, rootMargin: '-20%' }}
								oninview_enter={({ detail }) => {
									ProgressIsInView = detail.inView;
								}}
								class="flex h-6 overflow-hidden rounded-lg bg-gray-200"
							>
								{#if ProgressIsInView}
									<div
										in:slide={{
											duration: 1000 * (CONT_BOOK.progress / CONT_BOOK.pages),
											delay: 500 * Math.random(),
											axis: 'x',
											easing: (t) => t * t
										}}
										class="h-full overflow-hidden duration-750 ease-out"
										style="width: {(
											(CONT_BOOK.progress / CONT_BOOK.pages) *
											100
										).toFixed()}%; background: var(--color-{statusColors[CONT_BOOK.status]})"
									>
										<p class="absolute left-1/2 translate-x-[-50%] text-white">
											{((CONT_BOOK.progress / CONT_BOOK.pages) * 100).toFixed()}%
										</p>
									</div>
								{/if}
							</div>
						</div>
						<div class="mt-6 flex flex-col gap-1 text-start text-sm">
							<p class="text-gray-400">Last Reading Time:</p>
							{formatDate(CONT_BOOK.addedAt, 'date-time-day')}
						</div>
					</div>
				</div>
			</section>
		{/if}
		<section id="books_stats" class="mt-16">
			<div class="flex items-center gap-2">
				<FontAwesomeIcon class="size-4" icon={faChartSimple} />
				<h4 class="text-xl">Books Stats</h4>
			</div>
			<hr class="text-gray-200" />
			<div class="mt-6 flex h-6 overflow-hidden rounded-lg bg-gray-200 md:w-146">
				<div
					in:slide={{ duration: 1500, delay: 500, axis: 'x', easing: (t) => t * t }}
					class="h-full bg-green-500 duration-750 ease-out"
					style="width: {(stats['reading'] / stats['totalBooks']) * 100}%"
				></div>
				<div
					in:slide={{ duration: 1500, delay: 500, axis: 'x', easing: (t) => t * t }}
					class="h-full bg-indigo-700 duration-750 ease-out"
					style="width: {(stats['completed'] / stats['totalBooks']) * 100}%"
				></div>
				<div
					in:slide={{ duration: 1500, delay: 500, axis: 'x', easing: (t) => t * t }}
					class="h-full bg-amber-400 duration-750 ease-out"
					style="width: {(stats['on-hold'] / stats['totalBooks']) * 100}%"
				></div>
				<div
					in:slide={{ duration: 1500, delay: 500, axis: 'x', easing: (t) => t * t }}
					class="h-full bg-red-700 duration-750 ease-out"
					style="width: {(stats['dropped'] / stats['totalBooks']) * 100}%"
				></div>
				<div
					in:slide={{ duration: 1500, delay: 500, axis: 'x', easing: (t) => t * t }}
					class="h-full bg-gray-400 duration-750 ease-out"
					style="width: {(stats['plan-to-read'] / stats['totalBooks']) * 100}%"
				></div>
			</div>
			<div class="mt-4 flex flex-col gap-16 md:w-xl md:flex-row">
				<StatusIndicatorUl>
					<StatusIndicatorLi color="text-green-500" type="Reading" value={stats.reading} />
					<StatusIndicatorLi color="text-indigo-700" type="Completed" value={stats.completed} />
					<StatusIndicatorLi color="text-amber-400" type="On-Hold" value={stats['on-hold']} />
					<StatusIndicatorLi color="text-red-700" type="Dropped" value={stats.dropped} />
					<StatusIndicatorLi
						color="text-gray-400"
						type="Plan to Read"
						value={stats['plan-to-read']}
					/>
				</StatusIndicatorUl>
				<ul class="flex grow flex-col gap-1">
					<li class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<p class="text-sm text-gray-600">Total Books</p>
						</div>
						<p class="">{stats.totalBooks}</p>
					</li>
					<li class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<p class="text-sm text-gray-600">Pages</p>
						</div>
						<p class="">{stats.totalPages}</p>
					</li>
				</ul>
			</div>
		</section>
		<section class="mt-16">
			<div class="flex items-center gap-2">
				<FontAwesomeIcon class="size-4" icon={faBookOpen} />
				<h4 class="text-xl">Books List</h4>
			</div>
			<hr class="text-gray-200" />
			<a
				href="/my-books/add"
				class="mt-6 flex w-fit items-center justify-start gap-2 rounded bg-indigo-500 px-4 py-2 text-white duration-150 hover:bg-indigo-600"
			>
				<FontAwesomeIcon class="size-4" icon={faCirclePlus} />
				Add a book
			</a>

			<div class=" overflow-x-auto">
				{#if books.length === 0}
					<p class="mt-4 rounded-2xl border border-gray-300 p-4 text-xl">
						No books found, Add a new book to track it from here
					</p>
				{:else}
					<table class="mt-4 w-full overflow-hidden rounded-md bg-white text-sm shadow-md">
						<thead>
							<tr class="bg-indigo-300 text-sm">
								<th class="px-4 py-2 text-start font-semibold">#</th>
								<th class="px-4 py-2 text-start font-semibold">Title</th>
								<th class="px-4 py-2 text-start font-semibold">Author</th>
								<th class="px-4 py-2 text-start font-semibold">Started Date</th>
								<th class="px-4 py-2 text-start font-semibold">Status</th>
								<th class="px-4 py-2 text-start font-semibold">Last Reading</th>
								<th class="px-4 py-2 text-start font-semibold">Done%</th>
								<th class="px-4 py-2 text-start font-semibold">Current Page</th>
								<th class="w-40 min-w-40 px-4 py-2 text-start font-semibold">Progress</th>
								<th class="px-4 py-2 text-right font-semibold"></th>
							</tr>
						</thead>
						<tbody>
							{#each books as book, i (i)}
								<tr class={i % 2 !== 0 ? 'bg-indigo-100' : ''}>
									<td class="px-4 py-2">{i + 1}</td>
									<td class="px-4 py-2 text-nowrap">{book.title}</td>
									<td class="px-4 py-2 text-nowrap">{book.author}</td>
									<td class="px-4 py-2 text-nowrap">{formatDate(book.addedAt)}</td>
									<td class="px-4 py-2 text-nowrap capitalize">{book.status}</td>
									<td class="px-8 py-2 text-nowrap"
										>{formatDate(book.updatedAt)}<br />{formatDate(book.updatedAt, 'time')}</td
									>
									<td class="px-4 py-2">{((book.progress / book.pages) * 100).toFixed()}%</td>
									<td class="px-4 py-2">
										<span class="text-sm" style="color: var(--color-{statusColors[book.status]})"
											>{book.progress}</span
										>
										/ {book.pages}</td
									>
									<td
										class="px-4 py-2"
										use:inview={{ unobserveOnEnter: true, rootMargin: '-20%' }}
										oninview_enter={({ detail }) => {
											barIsInView = detail.inView;
										}}
									>
										<div class="flex h-6 overflow-hidden rounded-lg bg-gray-200">
											{#if barIsInView}
												<div
													class="h-full overflow-hidden duration-750 ease-out"
													in:slide={{
														duration: 1000 * (book.progress / book.pages),
														delay: 500 * Math.random(),
														axis: 'x',
														easing: (t) => t * t
													}}
													style="width: {(
														(book.progress / book.pages) *
														100
													).toFixed()}%; background: var(--color-{statusColors[book.status]})"
												></div>
											{/if}
										</div></td
									>

									<td class="flex grow items-center justify-end-safe gap-2 px-4 py-2">
										<button
											onclick={() => {
												updateBook(book);
											}}
											class="rounded bg-indigo-500 px-4 py-2 text-white duration-150 hover:bg-blue-400"
											><FontAwesomeIcon class="size-4" icon={faPencil} /></button
										>
										<button
											onclick={() => deleteBook(book)}
											class="ml-2 rounded bg-red-500 px-4 py-2 text-white duration-150 hover:bg-red-600"
										>
											<FontAwesomeIcon class="size-4" icon={faTrashCan} />
										</button>
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</section>
	</section>
{/if}

<style lang="postcss">
</style>
