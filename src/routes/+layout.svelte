<script lang="ts">
	import '../app.css';

	import { onMount } from 'svelte';
	import { page } from '$app/state';
	import { scale } from 'svelte/transition';
	8;

	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faWifi } from '@fortawesome/free-solid-svg-icons';

	import { Modal, Toast } from '$lib/components';
	import { showToast, theme } from '$lib/stores';

	let { children } = $props();

	let hasMounted = false;

	let is_online: boolean = $state(true);

	$effect(() => {
		if (is_online === undefined || !hasMounted) return;

		if (!is_online) {
			showToast('Network connection lost. You are currently offline.', 'network');
		} else showToast('Network connection restored.', 'network');
	});

	onMount(() => {
		theme.set(page.data.theme);

		hasMounted = true;
	});
</script>

<svelte:head>
	<title>{page.data.title || 'Did I Read That?'}</title>
</svelte:head>

<svelte:window bind:online={is_online} />
{@render children()}

<Modal />
<Toast />
{#if is_online === false}
	<div class="fixed end-1 bottom-1 z-50 select-none" transition:scale>
		<div
			class="absolute top-1/2 left-1/2 h-full w-0.5 translate-[-50%] rotate-45 rounded-full bg-red-500"
		></div>
		<FontAwesomeIcon icon={faWifi} />
	</div>
{/if}
