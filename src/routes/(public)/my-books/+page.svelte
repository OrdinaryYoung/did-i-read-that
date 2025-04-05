<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, scale, slide } from 'svelte/transition';
	import { inview } from 'svelte-inview';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faCirclePlus,
		faChartSimple,
		faBookOpen,
		faPencil,
		faTrashCan,
		faArrowDown,
		faArrowUp,
		faGear
	} from '@fortawesome/free-solid-svg-icons';

	import {
		GlobalModal,
		EditModal,
		StatusIndicatorUl,
		StatusIndicatorLi,
		LoadingModal
	} from '$lib/components';
	import { openModal, showToast } from '$lib/stores';
	import {
		formatDate,
		LoadStorage,
		sortBooks,
		UpdateBookStorage,
		DeleteBookStorage,
		saveSortBy
	} from '$lib/utils';

	import type { TrackedBook, LocalStorage } from '$lib/types';
	import { validateAuthor, validatePages, validateProgress, validateTitle } from '$lib/utils';

	let localStorage: LocalStorage = $state({
		books: [],
		sortBy: '',
		isAcscending: false
	});
	let { books, sortBy, isAcscending } = $derived(localStorage);

	const checkboxStates = $state([
		{ id: 'title', label: 'Title', checked: true },
		{ id: 'author', label: 'Author', checked: true },
		{ id: 'added_at', label: 'Added At', checked: true },
		{ id: 'status', label: 'Status', checked: true },
		{ id: 'updated_at', label: 'Updated At', checked: true },
		{ id: 'pages', label: 'Pages', checked: true },
		{ id: 'done', label: 'Done', checked: true },
		{ id: 'done_percent', label: 'Done Percent', checked: true }
	]); // Should Auto Generate it Based on Database

	let filteredCols: string[] = $state([]);

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
	let showCheckboxes: boolean = $state(false);

	const applySorting = (newSortBy: keyof TrackedBook, isAcscending: boolean) => {
		try {
			if (sortBy !== newSortBy) isAcscending = true;
			else isAcscending = !isAcscending;

			saveSortBy(newSortBy, isAcscending);
			localStorage = LoadStorage();
			books = localStorage['books'];
		} catch (error) {
			console.error('Error applying sorting:', error);
		}
	};

	const applyFilter = () => {
		try {
			filteredCols = checkboxStates.filter((option) => option.checked).map((option) => option.id);
		} catch (error) {
			console.error('Error applying filter:', error);
		}
	};

	const updateBook = (book: TrackedBook) => {
		try {
			openModal(
				EditModal,
				'form',
				`Edit ${book.title}`,
				'',
				'green',
				book,
				(updatedBook: TrackedBook) => {
					try {
						updatedBook.done =
							updatedBook.status == 'completed'
								? updatedBook.pages
								: updatedBook.status == 'plan-to-read'
									? 0
									: updatedBook.done;
						updatedBook.updated_at = new Date();
						updatedBook.done_percent = updatedBook.done / updatedBook.pages;
						const vt = validateTitle(updatedBook.title);
						if (vt) throw vt;

						const va = validateAuthor(updatedBook.author);
						if (va) throw va;

						const vpg = validatePages(updatedBook.pages);
						if (vpg) throw vpg;

						const vpr = validateProgress(updatedBook.done, updatedBook.status, updatedBook.pages);
						if (vpr) throw vpr;

						UpdateBookStorage(updatedBook);
						localStorage = LoadStorage();
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

	const deleteBook = (book: TrackedBook) => {
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
						localStorage = LoadStorage();
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
		stats.totalPages = books.reduce((sum, book) => sum + book.done, 0);

		Object.keys(stats).forEach((status) => {
			if (status !== 'totalBooks' && status !== 'totalPages') {
				stats[status as keyof typeof stats] = books.filter((book) => book.status === status).length;
			}
		});
	};

	onMount(() => {
		isPageLoading = true;
		localStorage = LoadStorage();
		filteredCols = checkboxStates.filter((option) => option.checked).map((option) => option.id);
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
			{@const HARD_COPY_BOOK: TrackedBook[] = JSON.parse(JSON.stringify(books))}
			{@const CONT_BOOK: TrackedBook = sortBooks(HARD_COPY_BOOK).filter((book)=> book.status === 'reading')[0]}
			<section class="mx-auto mt-12 grid w-full justify-center gap-8 text-center">
				<h1 class="text-2xl font-semibold">Continue Reading</h1>
				<div class="flex h-fit w-xs flex-col gap-4 rounded-lg border border-gray-300 p-4 shadow-lg">
					<img src="https://placehold.co/300x350?text=?" alt="book cover" class="rounded-lg" />
					<div>
						<p class="text-xl font-semibold">{CONT_BOOK.title}</p>
						<p>{CONT_BOOK.author}</p>
						<div class="mt-6">
							<p class="mb-0.5 text-end text-[.7rem] text-gray-400">
								page <span
									class="text-sm"
									style="color: var(--color-{statusColors[CONT_BOOK.status]})"
									>{CONT_BOOK.done}</span
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
											duration: 1000 * CONT_BOOK.done_percent,
											delay: 500 * Math.random(),
											axis: 'x',
											easing: (t) => t * t
										}}
										class="h-full overflow-hidden duration-750 ease-out"
										style="width: {(
											CONT_BOOK.done_percent * 100
										).toFixed()}%; background: var(--color-{statusColors[CONT_BOOK.status]})"
									>
										<p class="absolute left-1/2 translate-x-[-50%] text-white">
											{(CONT_BOOK.done_percent * 100).toFixed()}%
										</p>
									</div>
								{/if}
							</div>
						</div>
						<div class="mt-6 flex flex-col gap-1 text-start text-sm">
							<p class="text-gray-400">Last Reading Time:</p>
							{formatDate(CONT_BOOK.added_at, 'date-time-day')}
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

			<div>
				{#if books.length === 0}
					<p class="mt-4 rounded-2xl border border-gray-300 p-4 text-xl">
						No books found, Add a new book to track it from here
					</p>
				{:else}
					<div class="mt-3 flex w-full flex-col items-end gap-1 text-sm text-gray-800">
						<button
							class="size-8 rounded-full border text-gray-800 shadow-md duration-500 hover:bg-gray-300"
							class:rotate-180={showCheckboxes}
							class:bg-indigo-500={showCheckboxes}
							class:text-white={showCheckboxes}
							onclick={() => (showCheckboxes = !showCheckboxes)}
						>
							<FontAwesomeIcon class="fa-lg" icon={faGear} />
						</button>

						{#if showCheckboxes}
							<div
								in:fade={{ duration: 300 }}
								class="flex w-full flex-wrap gap-4 self-start rounded-lg border border-gray-300 p-4 shadow-sm"
							>
								{#each checkboxStates as option (option.id)}
									<label
										class="flex min-w-[120px] basis-1/3 items-center gap-1 text-nowrap sm:basis-1/4 md:basis-1/5 lg:basis-1/12"
									>
										<input
											type="checkbox"
											disabled={option.id === 'title'}
											bind:checked={option.checked}
											onchange={() => {
												applyFilter();
											}}
										/>
										{option.label}
									</label>
								{/each}
							</div>
						{/if}
					</div>
					<div class="overflow-x-auto">
						<table class="mt-1 w-full overflow-hidden rounded-md bg-white text-sm shadow-md">
							<thead>
								<tr class="bg-indigo-300 text-sm">
									<th class="w-8 max-w-14 px-4 py-2 text-start font-semibold">#</th>
									{#each filteredCols as column}
										<th
											class="px-4 py-2 text-center font-semibold capitalize select-none"
											class:text-start={column === 'title'}
											onclick={() => {
												applySorting(column as keyof TrackedBook, isAcscending);
											}}
										>
											{#if column === 'done%'}
												Progress
											{:else if column === 'done_percent'}
												Progress%
											{:else}
												{column.split('_').join(' ')}
											{/if}

											{#if column === sortBy}
												{#if isAcscending}
													<FontAwesomeIcon class="ml-2 size-4" icon={faArrowUp} />
												{:else}
													<FontAwesomeIcon class="ml-2 size-4" icon={faArrowDown} />
												{/if}
											{/if}
										</th>
									{/each}
									<th class="w-40 min-w-40 px-4 py-2 font-semibold">Progress Bar</th>
									<th class="px-4 py-2 text-right font-semibold"></th>
								</tr>
							</thead>
							<tbody>
								{#each books as book, i (i)}
									<tr class={i % 2 !== 0 ? 'bg-indigo-100' : ''}>
										<td class="px-4 py-2">{i + 1}</td>
										{#each filteredCols as column}
											<td
												class="px-4 py-2 text-center"
												class:text-start={column === 'title'}
												class:capitalize={column === 'status'}
												class:text-nowrap={column !== 'done'}
											>
												{#if column === 'added_at'}
													{formatDate(book.added_at)}
												{:else if column === 'updated_at'}
													{formatDate(book.updated_at)}<br />{formatDate(book.updated_at, 'time')}
												{:else if column === 'done'}
													<span
														class="text-sm"
														style="color: var(--color-{statusColors[book.status]})"
														>{book.done}</span
													>
													/ {book.pages}
												{:else if column === 'done_percent'}
													{(book.done_percent * 100).toFixed()}%
												{:else}
													{book[column as keyof TrackedBook]}
												{/if}
											</td>
										{/each}
										<td
											class="self-center px-4 py-2 text-center"
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
															duration: 1000 * book.done_percent,
															delay: 500 * Math.random(),
															axis: 'x',
															easing: (t) => t * t
														}}
														style="width: {(
															book.done_percent * 100
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
					</div>
				{/if}
			</div>
		</section>
	</section>
{/if}

<style lang="postcss">
</style>
