import { writable } from 'svelte/store';
import type { Toast, ToastType } from '$lib/types';

export const toasts = writable<Toast[]>([]);

export function showToast(message: string, type: ToastType = 'info') {
	toasts.update((t) => [...t, { message, type }]);

	setTimeout(() => {
		toasts.update((t) => t.slice(1));
	}, 3000);
}
