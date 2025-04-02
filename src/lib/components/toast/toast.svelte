<script lang="ts">
	import { toasts } from '$lib/stores/toastStore';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faXmark, faExclamation, faCheck } from '@fortawesome/free-solid-svg-icons';
	import { fly } from 'svelte/transition';

	let toastList = [];
	$: toasts.subscribe((t) => (toastList = t));
</script>

<div class="fixed top-7 right-7 flex flex-col-reverse gap-3 space-y-3">
	{#each toastList as toast}
		<div
			transition:fly={{ x: 80, duration: 750 }}
			class="flex items-center gap-4 rounded p-4 text-white shadow-lg"
			class:bg-green-500={toast.type === 'success'}
			class:bg-red-500={toast.type === 'error'}
			class:bg-blue-500={toast.type === 'info'}
		>
			<FontAwesomeIcon
				icon={toast.type === 'success'
					? faCheck
					: toast.type === 'error'
						? faXmark
						: toast.type === 'info'
							? faExclamation
							: faXmark}
				class="fa-beat "
				style="--fa-animation-iteration-count: 2;"
			/>
			{toast.message}
		</div>
	{/each}
</div>
