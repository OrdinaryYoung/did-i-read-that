<script lang="ts">
	import { onMount } from 'svelte';
	import { fade, fly, scale, slide } from 'svelte/transition';
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
		faGear,
		faFilePdf
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
		UpdateBookStorage,
		DeleteBookStorage,
		saveSortBy,
		savePageLimit
	} from '$lib/utils';

	import type { TrackedBook, LocalStorage } from '$lib/types';
	import { validateAuthor, validatePages, validateProgress, validateTitle } from '$lib/utils';

	let localStorage: LocalStorage = $state({
		books: [],
		currentReading: null,
		statistics: {
			reading: 0,
			completed: 0,
			'on-hold': 0,
			dropped: 0,
			'plan-to-read': 0,
			totalBooks: 0,
			totalPages: 0
		},
		sortBy: '',
		isAscending: false,
		totalBooks: -1,
		pageLimit: 20
	});
	let { books, statistics, currentReading, sortBy, isAscending, totalBooks, pageLimit } =
		$derived(localStorage);

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
	let currentPage: number = $state(1);
	let totalPages: number = $derived(Math.ceil(totalBooks / pageLimit));

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
	let showTableSettings: boolean = $state(false);

	const applyPageLimit = () => {
		try {
			savePageLimit(pageLimit);
			currentPage = 1;
			localStorage = LoadStorage(currentPage);
		} catch (error) {
			showToast('Error applying the changes.. Please try again!', 'error');
			console.error('Error applying pagination: ', error);
		}
	};
	const changePage = (page: number) => {
		try {
			localStorage = LoadStorage(page);

			if (page > 0 && page <= totalPages) {
				currentPage = page;
			}
		} catch (error) {
			showToast('Error reloading the table.. Please try again!', 'error');
			console.error('Error changing Page: ', error);
		}
	};

	const applySorting = (newSortBy: keyof TrackedBook, isAscending: boolean) => {
		try {
			if (sortBy !== newSortBy) isAscending = true;
			else isAscending = !isAscending;

			saveSortBy(newSortBy, isAscending);
			localStorage = LoadStorage(currentPage);
		} catch (error) {
			showToast('Error applying sorting.. Please try again!', 'error');
			console.error('Error applying sorting: ', error);
		}
	};

	const applyFilter = () => {
		try {
			filteredCols = checkboxStates.filter((option) => option.checked).map((option) => option.id);
		} catch (error) {
			showToast('Error applying filtering.. Please try again!', 'error');
			console.error('Error applying filter: ', error);
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
						localStorage = LoadStorage(currentPage);
						showToast('Book Updated successfully!', 'success');
					} catch (error) {
						console.error('Error updating book: ', error);
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
						if (currentPage > Math.ceil((totalBooks - 1) / pageLimit)) {
							currentPage -= 1;
						}
						localStorage = LoadStorage(currentPage);
						showToast('Book deleted successfully!', 'success');
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

	const exportPDF = async () => {
		try {
			const response = await fetch('/api/app/export-pdf', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({ ls: localStorage })
			});
			if (!response.ok) throw response;

			const blob = await response.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = `Books_Report_${new Date().toISOString().slice(0, 10)}.pdf`;
			a.click();
			URL.revokeObjectURL(url);
		} catch (error) {
			showToast('Error exporting table.. Please try later!', 'error');
			console.error(error);
		}
	};

	onMount(() => {
		isPageLoading = true;
		localStorage = LoadStorage(currentPage);
		filteredCols = checkboxStates.filter((option) => option.checked).map((option) => option.id);
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
		{#if currentReading}
			<section class="mx-auto mt-12 grid w-full justify-center gap-8 text-center">
				<h1 class="text-2xl font-semibold">Continue Reading</h1>
				<div class="flex h-fit w-xs flex-col gap-4 rounded-lg border border-gray-300 p-4 shadow-lg">
					<img src="https://placehold.co/300x350?text=?" alt="book cover" class="rounded-lg" />
					<div>
						<p class="text-xl font-semibold">{currentReading.title}</p>
						<p>{currentReading.author}</p>
						<div class="mt-6">
							<p class="mb-0.5 text-end text-[.7rem] text-gray-400">
								page <span
									class="text-sm"
									style="color: var(--color-{statusColors[currentReading.status]})"
									>{currentReading.done}</span
								>
								of {currentReading.pages}
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
											duration: 1000 * currentReading.done_percent,
											delay: 500 * Math.random(),
											axis: 'x',
											easing: (t) => t * t
										}}
										class="h-full overflow-hidden duration-750 ease-out"
										style="width: {(
											currentReading.done_percent * 100
										).toFixed()}%; background: var(--color-{statusColors[currentReading.status]})"
									>
										<p class="absolute left-1/2 translate-x-[-50%] text-white">
											{(currentReading.done_percent * 100).toFixed()}%
										</p>
									</div>
								{/if}
							</div>
						</div>
						<div class="mt-6 flex flex-col gap-1 text-start text-sm">
							<p class="text-gray-400">Last Reading Time:</p>
							{formatDate(currentReading.added_at, 'date-time-day')}
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
					style="width: {(statistics['reading'] / statistics['totalBooks']) * 100}%"
				></div>
				<div
					in:slide={{ duration: 1500, delay: 500, axis: 'x', easing: (t) => t * t }}
					class="h-full bg-indigo-700 duration-750 ease-out"
					style="width: {(statistics['completed'] / statistics['totalBooks']) * 100}%"
				></div>
				<div
					in:slide={{ duration: 1500, delay: 500, axis: 'x', easing: (t) => t * t }}
					class="h-full bg-amber-400 duration-750 ease-out"
					style="width: {(statistics['on-hold'] / statistics['totalBooks']) * 100}%"
				></div>
				<div
					in:slide={{ duration: 1500, delay: 500, axis: 'x', easing: (t) => t * t }}
					class="h-full bg-red-700 duration-750 ease-out"
					style="width: {(statistics['dropped'] / statistics['totalBooks']) * 100}%"
				></div>
				<div
					in:slide={{ duration: 1500, delay: 500, axis: 'x', easing: (t) => t * t }}
					class="h-full bg-gray-400 duration-750 ease-out"
					style="width: {(statistics['plan-to-read'] / statistics['totalBooks']) * 100}%"
				></div>
			</div>
			<div class="mt-4 flex flex-col gap-16 md:w-xl md:flex-row">
				<StatusIndicatorUl>
					<StatusIndicatorLi color="text-green-500" type="Reading" value={statistics.reading} />
					<StatusIndicatorLi
						color="text-indigo-700"
						type="Completed"
						value={statistics.completed}
					/>
					<StatusIndicatorLi color="text-amber-400" type="On-Hold" value={statistics['on-hold']} />
					<StatusIndicatorLi color="text-red-700" type="Dropped" value={statistics.dropped} />
					<StatusIndicatorLi
						color="text-gray-400"
						type="Plan to Read"
						value={statistics['plan-to-read']}
					/>
				</StatusIndicatorUl>
				<ul class="flex grow flex-col gap-1">
					<li class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<p class="text-sm text-gray-600">Total Books</p>
						</div>
						<p class="">{statistics.totalBooks}</p>
					</li>
					<li class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<p class="text-sm text-gray-600">Pages</p>
						</div>
						<p class="">{statistics.totalPages}</p>
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
			<div class="mt-6 flex items-center gap-2">
				<a
					href="/my-books/add"
					class="flex w-fit items-center justify-start gap-2 rounded bg-indigo-500 px-4 py-2 text-white duration-150 hover:bg-indigo-600"
				>
					<FontAwesomeIcon class="size-4" icon={faCirclePlus} />
					Add a book
				</a>
				<button
					class="flex cursor-pointer items-center gap-2 rounded-md border border-gray-300 px-4 py-2 duration-150 hover:bg-gray-50"
					onclick={exportPDF}><FontAwesomeIcon icon={faFilePdf} />Export</button
				>
			</div>

			<div>
				{#if books.length === 0}
					<p class="mt-4 rounded-2xl border border-gray-300 p-4 text-xl">
						No books found, Add a new book to track it from here
					</p>
				{:else}
					<div class="mt-3 flex w-full flex-col items-end gap-1 text-sm text-gray-800">
						<button
							class="size-8 rounded-full border text-gray-800 shadow-md duration-500 hover:bg-gray-300"
							class:rotate-180={showTableSettings}
							class:bg-indigo-500={showTableSettings}
							class:text-white={showTableSettings}
							onclick={() => (showTableSettings = !showTableSettings)}
						>
							<FontAwesomeIcon class="fa-lg" icon={faGear} />
						</button>

						{#if showTableSettings}
							<div
								in:fade={{ duration: 300 }}
								class="flex w-full flex-col gap-4 self-start rounded-lg border border-gray-300 p-4 shadow-sm"
							>
								<div class="flex w-full flex-wrap gap-4 self-start">
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
								<div class="flex items-center gap-2">
									<label for="booksPerPage" class="text-sm font-medium">Items per page:</label>
									<select
										id="booksPerPage"
										bind:value={pageLimit}
										class="rounded border border-gray-600 px-1 shadow-sm"
										onchange={applyPageLimit}
									>
										<option value={10}>10</option>
										<option value={25}>25</option>
										<option value={50}>50</option>
										<option value={100}>100</option>
									</select>
								</div>
							</div>
						{/if}
						{#if totalPages > 1}
							<div class="my-2 flex flex-wrap justify-center gap-y-2 self-center-safe duration-300">
								{#if currentPage > 1}
									<button
										transition:fade
										class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-center hover:bg-gray-300 focus:outline-none active:bg-gray-400 disabled:cursor-default disabled:bg-gray-50 disabled:text-gray-300"
										onclick={() => changePage(currentPage - 1)}>Previous</button
									>
								{/if}
								{#each Array(totalPages) as _, pageIndex}
									<button
										in:fade
										out:fly={{ y: 20 }}
										class="mx-1 rounded border px-3 py-1 duration-150 {currentPage === pageIndex + 1
											? 'bg-indigo-500 text-white'
											: 'bg-gray-200 hover:bg-gray-300'}"
										onclick={() => changePage(pageIndex + 1)}
									>
										{pageIndex + 1}
									</button>
								{/each}

								{#if currentPage < totalPages}
									<button
										transition:fade
										class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-center hover:bg-gray-300 focus:outline-none active:bg-gray-400 disabled:cursor-default disabled:bg-gray-50 disabled:text-gray-300"
										onclick={() => changePage(currentPage + 1)}>Next</button
									>
								{/if}
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
												applySorting(column as keyof TrackedBook, isAscending);
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
												{#if isAscending}
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
										<td class="px-4 py-2">{i + (currentPage - 1) * pageLimit + 1}</td>
										{#each filteredCols as column}
											<td
												class="px-4 py-2 text-center"
												class:text-start={column === 'title'}
												class:capitalize={column === 'status'}
												class:text-nowrap={column !== 'done'}
												class:md:text-wrap={column === 'title'}
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
					{#if totalPages > 1}
						<div class="my-2 flex flex-wrap justify-center gap-y-2 self-center-safe duration-300">
							{#if currentPage > 1}
								<button
									transition:fade
									class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-center hover:bg-gray-300 focus:outline-none active:bg-gray-400 disabled:cursor-default disabled:bg-gray-50 disabled:text-gray-300"
									onclick={() => changePage(currentPage - 1)}>Previous</button
								>
							{/if}
							{#each Array(totalPages) as _, pageIndex}
								<button
									in:fade
									out:fly={{ y: 20 }}
									class="mx-1 rounded border px-3 py-1 duration-150 {currentPage === pageIndex + 1
										? 'bg-indigo-500 text-white'
										: 'bg-gray-200 hover:bg-gray-300'}"
									onclick={() => changePage(pageIndex + 1)}
								>
									{pageIndex + 1}
								</button>
							{/each}

							{#if currentPage < totalPages}
								<button
									transition:fade
									class="flex cursor-pointer items-center gap-2 rounded-md bg-gray-200 px-4 py-2 text-center hover:bg-gray-300 focus:outline-none active:bg-gray-400 disabled:cursor-default disabled:bg-gray-50 disabled:text-gray-300"
									onclick={() => changePage(currentPage + 1)}>Next</button
								>
							{/if}
						</div>
					{/if}
				{/if}
			</div>
		</section>
	</section>
{/if}

<style lang="postcss">
</style>
