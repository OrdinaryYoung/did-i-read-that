<script lang="ts">
	import { goto } from '$app/navigation';

	import { lsAddBook } from '$lib';
	import { showGModal } from '$lib/stores/modalStore';
	import { showToast } from '$lib/stores/toastStore';
	import { faTurnUp } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { scale } from 'svelte/transition';

	let title = '';
	let author = '';
	let pages = 0;
	let progress = 0;
	let status = 'plan-to-read';
	let error = '';

	async function addBook() {
		error = '';

		if (!title || !author || pages <= 0) {
			error = 'Title, Author, and Pages are required.';
			return;
		}
		progress = status == 'completed' ? pages : status == 'plan-to-read' ? 0 : progress;
		if (progress > pages) {
			error = 'Current Page can not be greater than Total Pages';
			return;
		}
		showGModal(
			'Add Book?',
			'Are you sure you want to save the new book?',
			'indigo',
			async () => {
				lsAddBook({ title, author, pages, status, progress });
				showToast('Book added successfully!', 'success');
				goto('/my-books'); // Redirect after adding
			},

			'Add',
			'Cancel'
		);
	}
</script>

<section in:scale={{ duration: 250 }} class="flex h-screen w-full items-center justify-center">
	<div class="relative mx-auto max-w-lg rounded-lg bg-white p-6 md:shadow-md">
		<button
			on:click={() => goto('/my-books')}
			class="absolute start-5 top-4 size-8 rounded-full p-1 text-gray-600 hover:bg-gray-200"
		>
			<FontAwesomeIcon icon={faTurnUp} class="rotate-270 text-xl text-gray-600" />
		</button>

		<h1 class="mt-8 mb-4 text-2xl font-semibold">Add a New Book</h1>

		{#if error}
			<p class="text-red-500">{error}</p>
		{/if}

		<form on:submit|preventDefault={addBook} class="flex flex-col space-y-4">
			<label>
				Book Title
				<input
					bind:value={title}
					type="text"
					placeholder="Book Title"
					class="w-full rounded border p-2"
				/>
			</label>
			<label>
				Book Author
				<input bind:value={author} type="text" class="w-full rounded border p-2" />
			</label>

			<label>
				Total Pages
				<input
					bind:value={pages}
					type="number"
					placeholder="Total Pages"
					class="w-full rounded border p-2"
				/>
			</label>

			<label>
				Book Status
				<select bind:value={status} class="w-full rounded border p-2">
					<option value="plan-to-read">Plan to Read</option>
					<option value="reading">Reading</option>
					<option value="completed">Completed</option>
					<option value="on-hold">On Hold</option>
					<option value="dropped">Dropped</option>
				</select>
			</label>
			{#if status !== 'completed' && status !== 'plan-to-read'}
				<label>
					Current Page
					<input
						bind:value={progress}
						type="number"
						placeholder="Total Pages"
						class="w-full rounded border p-2"
						max={pages}
					/>
				</label>
			{/if}

			<button
				type="submit"
				class="w-full rounded bg-indigo-500 p-2 text-white duration-150 hover:bg-indigo-600"
			>
				Add Book
			</button>
		</form>
	</div>
</section>
