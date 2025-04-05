import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { visualizer } from 'rollup-plugin-visualizer';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		visualizer({ open: true }) // 👀 auto-opens analysis in browser
	],
	server: {
		port: 5180,
		strictPort: true
	}
});
