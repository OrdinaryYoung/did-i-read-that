import type { Themes } from '$lib/types';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	const theme = event.cookies.get('theme') || 'light';

	event.locals.theme = theme as Themes;

	const response = await resolve(event, {
		transformPageChunk: ({ html }) => html.replace('%sveltekit.theme%', `data-theme="${theme}"`)
	});

	return response;
};
