import { writable } from 'svelte/store';

export const theme = writable('light');

theme.subscribe((value) => {
	if (typeof document !== 'undefined') {
		document.documentElement.setAttribute('data-theme', value);
	}
});
