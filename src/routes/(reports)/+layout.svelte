<script lang="ts">
	import { Footer, Header } from '$lib/components';

	let { children } = $props();
</script>

<Header />
<main class="min-h-[calc(100vh-9rem)]">
	{@render children()}
</main>
<Footer />
