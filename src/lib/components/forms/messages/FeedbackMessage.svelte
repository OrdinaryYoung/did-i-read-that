<script lang="ts">
	import {
		faCheckCircle,
		faExclamationCircle,
		faExclamationTriangle,
		faXmarkCircle
	} from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { fade } from 'svelte/transition';

	let { message, type, width } = $props();
</script>

<div
	in:fade={{ duration: 300, easing: (t) => t * t }}
	class="container"
	class:bg-green-500={type === 'success'}
	class:bg-red-500={type === 'error'}
	class:bg-blue-500={type === 'info'}
	class:bg-amber-500={type === 'warning'}
	class:bg-gray-500={type === 'network'}
	class:max-w-full={width === 'full'}
	class:max-w-96={width === 'medium'}
	class:max-w-64={width === 'small'}
	class:w-fit={width === 'fit'}
>
	<FontAwesomeIcon
		icon={type === 'success'
			? faCheckCircle
			: type === 'error'
				? faXmarkCircle
				: type === 'info'
					? faExclamationCircle
					: type === 'warning'
						? faExclamationTriangle
						: faXmarkCircle}
		size="lg"
		class="fa-beat"
		style="--fa-animation-iteration-count: 2;"
	/>
	<p class="error-message">{message}</p>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	.container {
		@apply mx-auto my-4 flex w-fit items-center gap-3 rounded px-3 py-3 text-white shadow-lg;
	}
	.error-message {
		@apply text-sm text-white;
	}
</style>
