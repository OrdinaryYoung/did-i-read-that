<script lang="ts">
	import { onMount } from 'svelte';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import {
		faChartSimple,
		faBookOpen,
		faArrowDown,
		faArrowUp,
		faCircle
	} from '@fortawesome/free-solid-svg-icons';

	import { StatusIndicatorUl, StatusIndicatorLi } from '$lib/components';

	import { formatDate, LoadStorage } from '$lib/utils';

	import type { TrackedBook, LocalStorage } from '$lib/types';

	const date: Date = $state(new Date());
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
	let { books, statistics, sortBy, isAscending } = $derived(localStorage);

	const checkboxStates = $state([
		{ id: 'title', label: 'Title', checked: true },
		{ id: 'author', label: 'Author', checked: true },
		{ id: 'added_at', label: 'Added At', checked: true },
		{ id: 'status', label: 'Status', checked: true },
		{ id: 'updated_at', label: 'Updated At', checked: true },
		{ id: 'pages', label: 'Pages', checked: true },
		{ id: 'done', label: 'Done', checked: true },
		{ id: 'done_percent', label: 'Done Percent', checked: true }
	]);

	let filteredCols: string[] = $state([]);

	const statusColors: Record<string, string> = {
		'plan-to-read': 'gray-400',
		reading: 'green-500',
		completed: 'indigo-700',
		'on-hold': 'amber-400',
		dropped: 'red-700'
	};

	let isPageLoading: boolean = $state(true);
	onMount(() => {
		isPageLoading = true;
		localStorage = LoadStorage();
		filteredCols = checkboxStates.filter((option) => option.checked).map((option) => option.id);
		isPageLoading = false;
		window.renderReady = true;
		console.log(sortBy);
	});
</script>

{#if !isPageLoading}
	<main class="container mx-auto pb-16">
		<p class="mt-3 text-sm text-gray-600">
			This report was printed on <span class="font-semibold"
				>{formatDate(date, 'date-time-day')}</span
			>.
		</p>
		<section id="books_stats" class="mt-16">
			<div class="flex items-center gap-2">
				<FontAwesomeIcon class="size-4" icon={faChartSimple} />
				<h4 class="text-xl">Books Stats</h4>
			</div>
			<hr class="text-gray-200" />
			<div class="mt-6 flex h-6 overflow-hidden rounded-lg bg-gray-200 md:w-146">
				<div
					class="h-full bg-green-500 duration-750 ease-out"
					style="width: {(statistics['reading'] / statistics['totalBooks']) * 100}%"
				></div>
				<div
					class="h-full bg-indigo-700 duration-750 ease-out"
					style="width: {(statistics['completed'] / statistics['totalBooks']) * 100}%"
				></div>
				<div
					class="h-full bg-amber-400 duration-750 ease-out"
					style="width: {(statistics['on-hold'] / statistics['totalBooks']) * 100}%"
				></div>
				<div
					class="h-full bg-red-700 duration-750 ease-out"
					style="width: {(statistics['dropped'] / statistics['totalBooks']) * 100}%"
				></div>
				<div
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
						<p>{statistics.totalBooks}</p>
					</li>
					<li class="flex items-center justify-between">
						<div class="flex items-center gap-2">
							<p class="text-sm text-gray-600">Pages</p>
						</div>
						<p>{statistics.totalPages}</p>
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

			<div>
				{#if books.length === 0}
					<p class="mt-4 rounded-2xl border border-gray-300 p-4 text-xl">
						No books found, Add a new book to track it from here
					</p>
				{:else}
					<table class="mt-6 w-full rounded-md bg-white text-xs shadow-md">
						<thead>
							<tr class="bg-indigo-300 text-sm">
								<th class="w-8 max-w-14 px-4 py-2 text-start font-semibold">#</th>
								{#each filteredCols as column}
									<th
										class="px-4 py-2 text-center font-semibold capitalize select-none"
										class:text-start={column === 'title' || column === 'status'}
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
							</tr>
						</thead>
						<tbody>
							{#each books as book, i (i)}
								<tr class={i % 2 !== 0 ? 'bg-indigo-100' : ''}>
									<td class="px-4 py-1.5">{i + 1}</td>
									{#each filteredCols as column}
										<td
											class="px-4 py-2 text-center"
											class:text-start={column === 'title' || column === 'status'}
											class:capitalize={column === 'status'}
											class:text-nowrap={column !== 'done' && column !== 'title'}
											class:text-xs={column === 'author' ||
												column === 'added_at' ||
												column === 'updated_at' ||
												column === 'pages' ||
												column === 'done'}
											class:text-gray-600={column === 'author' ||
												column === 'added_at' ||
												column === 'updated_at' ||
												column === 'pages' ||
												column === 'done'}
										>
											{#if column === 'added_at'}
												{formatDate(book.added_at)}
											{:else if column === 'updated_at'}
												{formatDate(book.updated_at)}<br />{formatDate(book.updated_at, 'time')}
											{:else if column === 'done'}
												<span
													class="text-sm"
													style="color: var(--color-{statusColors[book.status]})">{book.done}</span
												>
												/ {book.pages}
											{:else if column === 'done_percent'}
												{(book.done_percent * 100).toFixed()}%
											{:else if column === 'status'}
												<div class="flex items-center gap-2">
													<FontAwesomeIcon
														icon={faCircle}
														class="size-2 text-{statusColors[book.status]}"
													/>
													{book.status}
												</div>
											{:else}
												{book[column as keyof TrackedBook]}
											{/if}
										</td>
									{/each}
									<td class="self-center px-4 py-2 text-center">
										{#if book.done !== 0}
											<div class="flex h-6 overflow-hidden rounded-lg bg-gray-200">
												<div
													class="h-full overflow-hidden duration-750 ease-out"
													style="width: {(
														book.done_percent * 100
													).toFixed()}%; background: var(--color-{statusColors[book.status]})"
												></div>
											</div>
										{/if}
									</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
			</div>
		</section>
		<p class="mt-3 text-xs text-gray-400">
			This report was printed on <span class="font-semibold"
				>{formatDate(date, 'date-time-day')}</span
			>.
		</p>
	</main>
{/if}
