<script lang="ts">
	import { fly } from 'svelte/transition';

	import { faCircleNotch } from '@fortawesome/free-solid-svg-icons';
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
</script>

<div class="overlay">
	<div
		in:fly={{ duration: 150, y: -100, easing: (t) => t * t }}
		out:fly={{ duration: 400, y: -100, easing: (t) => t * t }}
		class="wrapper"
	>
		<FontAwesomeIcon icon={faCircleNotch} class="size-12 animate-spin text-gray-800" />
		<p>Loading...</p>
	</div>
</div>

<style lang="postcss">
	@reference "tailwindcss";
	.overlay {
		@apply fixed inset-0 z-50 flex items-center justify-center px-4;
	}
	.wrapper {
		@apply fixed start-1/2 top-10 z-50 flex w-75 translate-x-[-50%] flex-col items-center justify-center gap-4 rounded-lg bg-white py-4 shadow-lg;
	}
	.wrapper p {
		@apply text-xl text-gray-800;
	}
</style>
