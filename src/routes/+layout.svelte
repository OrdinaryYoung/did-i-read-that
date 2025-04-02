<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';

	let { children } = $props();
</script>

<svelte:head>
	<title>{page.data.title || 'Did I Read That?'}</title>
</svelte:head>

{@render children()}
