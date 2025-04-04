import { writable } from 'svelte/store';

import type { Component } from 'svelte';
import type { ModalConfig } from '$lib/types';

export const modalStack = writable<ModalConfig[]>([]);

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
	try {
		modalStack.update((stack) => [
			...stack,
			{
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
			}
		]);
	} catch (error) {
		throw Error('Error opening modal: ' + error);
	}
}

export function closeModal() {
	try {
		modalStack.update((stack) => {
			if (stack.length > 0) {
				stack.pop(); // Remove only the top modal
			}
			return [...stack];
		});
	} catch (error) {
		throw Error('Error closing modal: ' + error);
	}
}

export function closeAllModals() {
	try {
		modalStack.set([]); // Clears all modals
	} catch (error) {
		throw Error('Error closing all modals: ' + error);
	}
}
