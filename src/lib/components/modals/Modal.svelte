<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	import { modalStack, closeModal } from '$lib/stores';
	import type { ModalConfig } from '$lib/types';

	let modalStackConfig: ModalConfig[];
	modalStack.subscribe((stack) => (modalStackConfig = stack));

	function handleOutsideClick(event: MouseEvent, index: number) {
		if (index === modalStackConfig.length - 1 && event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

{#if modalStackConfig.length}
	<div class="modal-container">
		{#each modalStackConfig as modalConfig, index}
			{@const Modal = modalConfig.component}
			<div
				transition:fade={{ duration: 250 }}
				class="modal-overlay"
				aria-hidden="true"
				onclick={(event) => handleOutsideClick(event, index)}
			>
				<div
					transition:scale={{ duration: 250 }}
					class="modal-content"
					class:w-180={modalConfig.size == 'form'}
					class:w-120={modalConfig.size == 'large'}
					class:w-96={modalConfig.size == 'medium'}
					class:w-80={modalConfig.size == 'small'}
					role="dialog"
					aria-modal="true"
				>
					<Modal {modalConfig} />
				</div>
			</div>
		{/each}
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
	.modal-container {
		@apply fixed inset-0 z-50 flex items-center justify-center px-4;
	}

	.modal-overlay {
		@apply fixed inset-0 z-50 flex items-center justify-center bg-[#0007] px-4;
	}
	.modal-content {
		@apply rounded-lg bg-white p-6 shadow-lg;
	}
</style>
