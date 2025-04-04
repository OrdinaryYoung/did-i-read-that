import { writable } from 'svelte/store';

import type { Component } from 'svelte';
import type { ModalConfig } from '$lib/types';

export const modal = writable<ModalConfig>({ isOpen: false });

export function openModal(
	component: Component | null,
	size: 'small' | 'medium' | 'large' | 'form' = 'small',
	title: string,
	message: string,
	color: string,
	data: object,
	onConfirm: (...args: any[]) => void,
	confirmText = 'Confirm',
	cancelText = 'Cancel'
) {
	modal.set({
		isOpen: true,
		component,
		size,
		title,
		message,
		color,
		data,
		confirmText,
		cancelText,
		onConfirm
	});
}

export function closeModal() {
	modal.set({ isOpen: false });
}
