<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';
	import { page } from '$app/state';

	import { Modal, Toast } from '$lib/components';
	import { theme } from '$lib/stores';

	let { children } = $props();

	onMount(() => {
		theme.set(page.data.theme);
	});
</script>

<svelte:head>
	<title>{page.data.title || 'Did I Read That?'}</title>
</svelte:head>

{@render children()}

<Modal />
<Toast />
