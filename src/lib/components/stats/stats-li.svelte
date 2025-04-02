<script lang="ts">
	import { FontAwesomeIcon } from '@fortawesome/svelte-fontawesome';
	import { faCircle } from '@fortawesome/free-solid-svg-icons';

	let { color, type, value } = $props();
</script>

<li class="flex items-center justify-between">
	<div class="flex items-center gap-2">
		<FontAwesomeIcon icon={faCircle} class="size-4 {color}" />
		<a href="/my-books/{type.toLowerCase().split(' ').join('-')}" class="text-sm text-indigo-700"
			>{type}</a
		>
	</div>
	<p class="">{value}</p>
</li>
