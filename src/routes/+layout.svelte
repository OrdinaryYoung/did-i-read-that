<script lang="ts">
	import '../app.css';
	import { page } from '$app/state';

	import { Modal, Toast } from '$lib/components';

	let { children } = $props();
</script>

<svelte:head>
	<title>{page.data.title || 'Did I Read That?'}</title>
</svelte:head>

{@render children()}

<Modal />
<Toast />
