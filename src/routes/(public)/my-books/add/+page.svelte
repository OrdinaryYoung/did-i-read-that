<script lang="ts">
	import { goto } from '$app/navigation';
	import { fade, scale } from 'svelte/transition';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faTurnUp } from '@fortawesome/free-solid-svg-icons';
	import { FeedbackMessage, GlobalModal } from '$lib/components';
	import { openModal, showToast } from '$lib/stores';
	import { AddBookStorage } from '$lib/utils';
	import { MAX_AUTHOR_LENGTH, MAX_PAGES, MAX_TITLE_LENGTH } from '$lib/constants';

	import type { TrackedBook } from '$lib/types';
	import { validateAuthor, validatePages, validateProgress, validateTitle } from '$lib/utils';

	let book: TrackedBook = $state({
		id: '',
		title: '',
		author: '',
		added_at: '',
		status: 'plan-to-read',
		updated_at: '',
		pages: 1,
		done: 0,
		done_percent: 0
	});

	let feedbackMessage: string = $state('');

	const addBook = () => {
		try {
			book.done =
				book.status == 'completed' ? book.pages : book.status == 'plan-to-read' ? 0 : book.done;

			const vt = validateTitle(book.title);
			if (vt) throw vt;

			const va = validateAuthor(book.author);
			if (va) throw va;

			const vpg = validatePages(book.pages);
			if (vpg) throw vpg;

			const vpr = validateProgress(book.done, book.status, book.pages);
			if (vpr) throw vpr;
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
		} catch (error: any) {
			feedbackMessage = error;
			console.error(error);
		}
	};

	const discardBook = () => {
		openModal(
			GlobalModal,
			'medium',
			'Discard new Book?',
			'Are you sure you want to go back without saving?',
			'red',
			{},
			() => goto('/my-books'),
			'Discard',
			'Cancel'
		);
	};
</script>

<section in:scale={{ duration: 250 }}>
	<div class="modal-wrapper">
		<button class="back-btn" onclick={discardBook}>
			<FontAwesomeIcon icon={faTurnUp} class="rotate-270 text-xl text-gray-600" />
		</button>
		<h2>Add a New Book</h2>

		{#if feedbackMessage}
			<FeedbackMessage message={feedbackMessage} type="error" width="medium" />
		{/if}
		<form>
			<label for="title"
				>Title
				<input id="title" maxlength={MAX_TITLE_LENGTH} bind:value={book.title} />
			</label>
			<label for="author"
				>Author
				<input id="author" maxlength={MAX_AUTHOR_LENGTH} bind:value={book.author} />
			</label>
			<label for="status"
				>Status
				<select id="status" bind:value={book.status}>
					<option value="plan-to-read">Plan to Read</option>
					<option value="reading">Reading</option>
					<option value="completed">Completed</option>
					<option value="on-hold">On Hold</option>
					<option value="dropped">Dropped</option>
				</select>
			</label>
			<label for="pages"
				>Pages
				<input id="pages" type="number" min="1" max={MAX_PAGES} bind:value={book.pages} />
			</label>

			{#if book.status !== 'completed' && book.status !== 'plan-to-read'}
				<label for="done" in:fade>
					Achieved Page
					<input
						id="done"
						type="number"
						placeholder="Number of pages you have read"
						min="0"
						max={book.pages}
						bind:value={book.done}
					/>
				</label>
			{/if}
		</form>

		<div class="actions">
			<button class="cancel-btn" onclick={discardBook}> Back </button>
			<button type="submit" class="confirm-btn" onclick={addBook}> Add Book </button>
		</div>
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
