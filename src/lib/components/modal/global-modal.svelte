<script lang="ts">
	import { modal, closeModal } from '$lib/stores/modalStore';
	import { fade, scale } from 'svelte/transition';
	let modalConfig: {
		isOpen: boolean;
		title: string;
		color: string;
		message: string;
		cancelText: string;
		onConfirm: () => void;
		confirmText: string;
	};
	modal.subscribe((value) => (modalConfig = value));
</script>

{#if modalConfig.isOpen}
	<div
		transition:fade={{ duration: 250 }}
		class="bg-opacity-50 fixed inset-0 z-50 flex items-center justify-center bg-[#0007] px-4"
	>
		<div transition:scale={{ duration: 250 }} class="w-96 rounded-lg bg-white p-6 shadow-lg">
			<h2 class="mb-3 text-lg font-bold">{modalConfig.title}</h2>
			<p class="mb-5 text-gray-700">{modalConfig.message}</p>
			<div class="flex justify-end space-x-3">
				<button
					on:click={closeModal}
					class="rounded-md bg-gray-500 px-4 py-2 text-white duration-150 hover:bg-gray-600"
				>
					{modalConfig.cancelText}
				</button>
				<button
					on:click={() => {
						modalConfig.onConfirm?.();
						closeModal();
					}}
					class="rounded-md bg-{modalConfig.color}-500 px-4 py-2 text-white hover:bg-{modalConfig.color}-600 duration-150"
				>
					{modalConfig.confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
