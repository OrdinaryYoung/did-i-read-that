<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	import { modal } from '$lib/stores';
	import { type ModalConfig } from '$lib/types';

	let modalConfig: ModalConfig;
	modal.subscribe((value) => (modalConfig = value));
</script>

{#if modalConfig.isOpen}
	<div transition:fade={{ duration: 250 }} class="modal">
		<div
			transition:scale={{ duration: 250 }}
			class="modal-content"
			class:w-180={modalConfig.size == 'form'}
			class:w-120={modalConfig.size == 'large'}
			class:w-96={modalConfig.size == 'medium'}
			class:w-80={modalConfig.size == 'small'}
		>
			<svelte:component this={modalConfig.component} {modalConfig} />
		</div>
	</div>
{/if}

<style lang="postcss">
	@reference "tailwindcss";
	.modal {
		@apply fixed inset-0 z-50 flex items-center justify-center bg-[#0007] px-4;
	}
	.modal-content {
		@apply rounded-lg bg-white p-6 shadow-lg;
	}
</style>
