<script lang="ts">
	let { children } = $props();
</script>

<ul>
	{@render children()}
</ul>

<style lang="postcss">
	@reference "tailwindcss";
	ul {
		@apply flex grow flex-col gap-1;
	}
</style>
