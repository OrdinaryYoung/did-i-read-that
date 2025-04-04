<script lang="ts">
	import { fly } from 'svelte/transition';

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faXmark, faExclamation, faCheck, faWifi } from '@fortawesome/free-solid-svg-icons';

	import { toasts } from '$lib/stores';
	import type { Toast } from '$lib/types';

	let toastList: Toast[] = [];
	toasts.subscribe((value) => (toastList = value));
</script>

<div class="toasts">
	{#each toastList as toast}
		<div
			transition:fly={{ x: 80, duration: 750 }}
			class="toast"
			class:bg-green-500={toast.type === 'success'}
			class:bg-red-500={toast.type === 'error'}
			class:bg-blue-500={toast.type === 'info'}
			class:bg-amber-500={toast.type === 'warning'}
			class:bg-gray-500={toast.type === 'network'}
		>
			<FontAwesomeIcon
				icon={toast.type === 'success'
					? faCheck
					: toast.type === 'error'
						? faXmark
						: toast.type === 'info'
							? faExclamation
							: toast.type === 'warning'
								? faExclamation
								: faWifi}
				class="fa-beat"
				style="--fa-animation-iteration-count: 2;"
			/>
			{toast.message}
		</div>
	{/each}
</div>

<style lang="postcss">
	@reference "tailwindcss";
	.toasts {
		@apply fixed top-7 right-7 flex flex-col-reverse gap-3;
	}
	.toast {
		@apply flex items-center gap-4 rounded p-4 text-white shadow-lg;
	}
</style>
