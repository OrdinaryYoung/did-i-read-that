import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'info';

export const toasts = writable<{ message: string; type: ToastType }[]>([]);

export function showToast(message: string, type: ToastType = 'info') {
	toasts.update((t) => [...t, { message, type }]);

	// Remove after 3 seconds
	setTimeout(() => {
		toasts.update((t) => t.slice(1));
	}, 3000);
}
