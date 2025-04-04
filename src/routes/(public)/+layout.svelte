<script lang="ts">
	import { Footer, Header } from '$lib/components';

	let { children } = $props();
</script>

<Header />
{@render children()}
<Footer />
