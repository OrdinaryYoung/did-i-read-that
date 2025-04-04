<footer>
	<div class="wrapper">
		<p>&copy; 2025 Ordinary Guy. All rights reserved.</p>
	</div>
</footer>

<style lang="postcss">
	@reference "tailwindcss";
	footer {
		@apply flex h-20 w-full bg-indigo-800 px-4 shadow-md;
	}
	.wrapper {
		@apply container mx-auto flex items-center justify-center;
	}
	.wrapper p {
		@apply text-sm font-bold text-white;
	}
</style>
