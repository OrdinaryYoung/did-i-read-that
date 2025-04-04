<script lang="ts">
	import { writable } from 'svelte/store';
	import { closeModal } from '$lib/stores';

	import type { ModalConfig, Book } from '$lib/types';

	let { modalConfig } = $props() as { modalConfig: ModalConfig };

	let updatedBook = writable({ ...(modalConfig.data as Book) });
</script>

<div class="wrapper">
	<h2>Edit Book</h2>
	<form>
		<label for="title"
			>Title
			<input id="title" bind:value={$updatedBook.title} />
		</label>
		<label for="author"
			>Author
			<input id="author" bind:value={$updatedBook.author} />
		</label>
		<label for="status"
			>Status
			<select id="status" bind:value={$updatedBook.status}>
				<option value="plan-to-read">Plan to Read</option>
				<option value="reading">Reading</option>
				<option value="completed">Completed</option>
				<option value="on-hold">Hold</option>
				<option value="dropped">Dropped</option>
			</select>
		</label>
		<label for="pages"
			>Pages
			<input id="pages" type="number" bind:value={$updatedBook.pages} />
		</label>

		{#if $updatedBook.status !== 'completed' && $updatedBook.status !== 'plan-to-read'}
			<label for="progress">
				Current Page
				<input
					id="progress"
					type="number"
					placeholder="Total Pages"
					min="0"
					max={$updatedBook.pages}
					bind:value={$updatedBook.progress}
				/>
			</label>
		{/if}
	</form>
	<div class="actions">
		<button class="cancel-btn" onclick={closeModal}>
			{modalConfig.cancelText}
		</button>
		<button
			class="confirm-btn bg-{modalConfig.color}-500 hover:bg-{modalConfig.color}-600"
			onclick={() => {
				modalConfig.onConfirm?.($updatedBook);
				closeModal();
			}}
		>
			{modalConfig.confirmText}
		</button>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	.wrapper h2 {
		@apply mb-3 text-lg font-bold;
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
		@apply rounded-md px-4 py-2 text-white duration-150;
	}
</style>
