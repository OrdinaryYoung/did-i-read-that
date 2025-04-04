<header>
	<div class="wrapper">
		<a href="/">Did I Read That?</a>
	</div>
</header>

<style lang="postcss">
	@reference "tailwindcss";
	header {
		@apply flex h-16 w-full bg-indigo-600 px-4 shadow-md;
	}
	.wrapper {
		@apply container mx-auto flex items-center justify-between;
	}
	.wrapper a {
		@apply font-['Mansalva'] text-xl font-bold text-white;
	}
</style>
