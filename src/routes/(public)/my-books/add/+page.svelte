<script lang="ts">
	import { goto } from '$app/navigation';
	import { scale } from 'svelte/transition';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faTurnUp } from '@fortawesome/free-solid-svg-icons';
	import { GlobalModal } from '$lib/components';
	import { openModal, showToast } from '$lib/stores';
	import { AddBookStorage } from '$lib/utils';

	import type { Book } from '$lib/types';

	let book: Book = {
		id: '',
		addedAt: '',
		updatedAt: '',
		title: '',
		author: '',
		pages: 0,
		progress: 0,
		status: 'plan-to-read'
	};

	let error = '';

	const addBook = () => {
		error = '';

		if (!book.title || !book.author || book.pages <= 0) {
			error = 'Title, Author, and Pages are required.';
			return;
		}
		book.progress =
			book.status == 'completed' ? book.pages : book.status == 'plan-to-read' ? 0 : book.progress;
		if (book.progress > book.pages) {
			error = 'Current Page can not be greater than Total Pages';
			return;
		}
		openModal(
			GlobalModal,
			'medium',
			'Add Book?',
			'Are you sure you want to save the new book?',
			'indigo',
			{},
			() => {
				AddBookStorage(book);
				showToast('Book added successfully!', 'success');
				goto('/my-books');
			},
			'Add',
			'Back'
		);
	};
</script>

<section in:scale={{ duration: 250 }}>
	<div class="modal-wrapper">
		<button class="back-btn" on:click={() => goto('/my-books')}>
			<FontAwesomeIcon icon={faTurnUp} class="rotate-270 text-xl text-gray-600" />
		</button>
		<h2>Add a New Book</h2>

		{#if error}
			<p>{error}</p>
		{/if}

		<form on:submit|preventDefault={addBook}>
			<label>
				Book Title
				<input type="text" placeholder="Book Title" bind:value={book.title} />
			</label>
			<label>
				Book Author
				<input bind:value={book.author} />
			</label>

			<label>
				Total Pages
				<input type="number" placeholder="Total Pages" bind:value={book.pages} />
			</label>

			<label>
				Book Status
				<select bind:value={book.status}>
					<option value="plan-to-read">Plan to Read</option>
					<option value="reading">Reading</option>
					<option value="completed">Completed</option>
					<option value="on-hold">On Hold</option>
					<option value="dropped">Dropped</option>
				</select>
			</label>
			{#if book.status !== 'completed' && book.status !== 'plan-to-read'}
				<label for="progress">
					Current Page
					<input
						id="progress"
						type="number"
						placeholder="Total Pages"
						min="0"
						max={book.pages}
						bind:value={book.progress}
					/>
				</label>
			{/if}
			<div class="actions">
				<button type="button" class="cancel-btn" on:click={() => goto('/my-books')}>
					Cancel
				</button>
				<button type="submit" class="confirm-btn"> Add Book </button>
			</div>
		</form>
	</div>
</section>

<style lang="postcss">
	@reference "tailwindcss";
	section {
		@apply flex h-screen w-full items-center justify-center;
	}
	.modal-wrapper {
		@apply relative mx-auto w-full max-w-lg rounded-lg bg-white p-6 md:shadow-md;
	}
	.modal-wrapper .back-btn {
		@apply absolute start-5 top-4 size-8 rounded-full p-1 text-gray-600 hover:bg-gray-200;
	}
	.modal-wrapper h2 {
		@apply mt-8 mb-4 text-lg font-bold md:text-xl;
	}
	.modal-wrapper p {
		@apply text-red-500;
	}
	form {
		@apply mb-4 flex flex-col gap-4;
	}
	form label {
		@apply relative flex flex-col text-start text-sm font-medium text-gray-700;
	}
	form label input,
	form label select {
		@apply mt-1 block w-full rounded-md border border-gray-300 p-2.5 shadow-sm focus:outline-indigo-600;
	}
	.actions {
		@apply mt-4 flex justify-end gap-3;
	}
	.actions .cancel-btn {
		@apply rounded-md bg-gray-500 px-4 py-2 text-white duration-150 hover:bg-gray-600;
	}
	.actions .confirm-btn {
		@apply rounded-md bg-indigo-500 px-4 py-2 text-white duration-150 hover:bg-indigo-600;
	}
</style>
