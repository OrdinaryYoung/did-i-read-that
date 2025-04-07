// See https://svelte.dev/docs/kit/types#app.d.ts

import type { Themes } from '$lib/types';

// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			theme: Themes;
		}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}
	}
}

export {};
