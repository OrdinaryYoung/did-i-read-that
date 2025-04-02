import { writable } from 'svelte/store';

export type ModalConfig = {
	isOpen: boolean;
	title?: string;
	color?: string;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: () => void;
};

export const modal = writable<ModalConfig>({ isOpen: false });

export function showGModal(
	title: string,
	message: string,
	color: string,
	onConfirm: () => void,
	confirmText = 'Confirm',
	cancelText = 'Cancel'
) {
	modal.set({ isOpen: true, title, message, color, confirmText, cancelText, onConfirm });
}

export function closeModal() {
	modal.set({ isOpen: false });
}
