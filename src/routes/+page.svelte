<script lang="ts">
	import { inview } from 'svelte-inview';
	import { fade, fly } from 'svelte/transition';

	let IsInView: boolean = $state(false);
</script>

<section
	use:inview={{ unobserveOnEnter: true, rootMargin: '-20%' }}
	oninview_enter={({ detail }) => {
		IsInView = detail.inView;
	}}
	class="flex h-screen w-full flex-col items-center justify-center gap-4 bg-linear-to-br from-cyan-500 to-indigo-500 px-4 text-center text-white"
>
	{#if IsInView}
		<p in:fly={{ duration: 1000, y: 30 }} class="text-2xl sm:text-3xl">
			Did you read that book? <span in:fly={{ duration: 1000, y: 30, delay: 1500 }}>
				Let us see...</span
			>
		</p>
		<a
			in:fade={{ duration: 250, delay: 2500 }}
			href="/my-books"
			class="rounded-xl border px-4 py-2 duration-150 hover:bg-white hover:text-indigo-400"
			>Go To My Books List</a
		>
	{/if}
</section>

<style lang="postcss">
</style>
