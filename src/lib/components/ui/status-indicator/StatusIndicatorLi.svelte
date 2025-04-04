<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCircle } from '@fortawesome/free-solid-svg-icons';

	let { color, type, value } = $props();
</script>

<li>
	<div class="wrapper">
		<FontAwesomeIcon icon={faCircle} class="size-4 {color}" />
		<a href="/my-books/{type.toLowerCase().split(' ').join('-')}">{type}</a>
	</div>
	<p>{value}</p>
</li>

<style lang="postcss">
	@reference "tailwindcss";
	li {
		@apply flex items-center justify-between;
	}
	.wrapper {
		@apply flex items-center gap-2;
	}
	.wrapper a {
		@apply text-sm text-indigo-700;
	}
	li p {
		@apply text-sm text-gray-700;
	}
</style>
