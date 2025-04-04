<script lang="ts">
	import { Footer, Header } from '$lib/components';

	let { children } = $props();
</script>

<Header />
<main class="flex min-h-[calc(100vh-9rem)] flex-col">
	{@render children()}
</main>
<Footer />
