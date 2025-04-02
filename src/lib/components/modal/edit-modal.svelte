<script lang="ts">
	let {
		showModal,
		selectedBook,
		onClose,
		onSave
	}: {
		showModal: Boolean;
		selectedBook: Book;
		onClose: () => void;
		onSave: (updatedBook: Book) => void;
	} = $props();

	let updatedBook = $state({ ...selectedBook });
	function saveChanges() {
		if (updatedBook.pages < updatedBook.progress) {
			console.error('Current Page can not be greater than Total Pages');
			return;
		}
		updatedBook.progress =
			updatedBook.status == 'completed'
				? updatedBook.pages
				: updatedBook.status == 'plan-to-read'
					? 0
					: updatedBook.progress;
		onSave(updatedBook);
		onClose();
	}

	function closeModal() {
		onClose();
	}
</script>

{#if showModal}
	<div class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-[#0007] px-4">
		<div class="w-full rounded-lg bg-white p-6 shadow-xl md:w-128">
			<h2 class="mb-4 text-2xl font-semibold">Edit Book</h2>
			<form>
				<div class="mb-4">
					<label for="title" class="block text-sm font-medium">Title</label>
					<input
						id="title"
						type="text"
						bind:value={updatedBook.title}
						class="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>
				<div class="mb-4">
					<label for="author" class="block text-sm font-medium">Author</label>
					<input
						id="author"
						type="text"
						bind:value={updatedBook.author}
						class="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>
				<div class="mb-4">
					<label for="status" class="block text-sm font-medium">Status</label>
					<select
						id="status"
						bind:value={updatedBook.status}
						class="mt-1 w-full rounded-lg border px-4 py-2"
					>
						<option value="plan-to-read">Plan to Read</option>
						<option value="reading">Reading</option>
						<option value="completed">Completed</option>
						<option value="on-hold">Hold</option>
						<option value="dropped">Dropped</option>
					</select>
				</div>
				<div class="mb-4">
					<label for="pages" class="block text-sm font-medium">Pages</label>
					<input
						id="pages"
						type="number"
						bind:value={updatedBook.pages}
						class="mt-1 w-full rounded-lg border px-4 py-2"
					/>
				</div>
				{#if updatedBook.status !== 'completed' && updatedBook.status !== 'plan-to-read'}
					<div class="mb-4">
						<label>
							Current Page
							<input
								bind:value={updatedBook.progress}
								type="number"
								placeholder="Total Pages"
								class="mt-1 w-full rounded-lg border px-4 py-2"
								max={updatedBook.pages}
							/>
						</label>
					</div>
				{/if}
			</form>
			<div class="flex justify-end gap-4">
				<button
					onclick={closeModal}
					class="rounded-md bg-gray-500 px-4 py-2 text-white hover:bg-gray-600">Cancel</button
				>
				<button
					onclick={saveChanges}
					class="rounded-md bg-green-500 px-4 py-2 text-white hover:bg-green-600">Save</button
				>
			</div>
		</div>
	</div>
{/if}
