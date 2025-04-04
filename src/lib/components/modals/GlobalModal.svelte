<script lang="ts">
	import { closeModal } from '$lib/stores';
	import { type ModalConfig } from '$lib/types';

	let { modalConfig } = $props() as { modalConfig: ModalConfig };
</script>

<div class="wrapper">
	<h2>{modalConfig.title}</h2>
	<p>{modalConfig.message}</p>
	<div class="actions">
		<button class="cancel-btn" onclick={closeModal}>
			{modalConfig.cancelText}
		</button>
		<button
			class="confirm-btn bg-{modalConfig.color}-500 hover:bg-{modalConfig.color}-600"
			onclick={() => {
				modalConfig.onConfirm?.();
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
	.wrapper p {
		@apply mb-5 text-gray-700;
	}
	.actions {
		@apply flex justify-end gap-3;
	}
	.actions .cancel-btn {
		@apply rounded-md bg-gray-500 px-4 py-2 text-white duration-150 hover:bg-gray-600;
	}
	.actions .confirm-btn {
		@apply rounded-md px-4 py-2 text-white duration-150;
	}
</style>
