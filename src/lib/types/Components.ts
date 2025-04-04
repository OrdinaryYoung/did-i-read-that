import type { Component } from 'svelte';

export type ModalConfig = {
	isOpen: boolean;
	component?: Component | null;
	size?: 'small' | 'medium' | 'large' | 'form';
	title?: string;
	color?: string;
	data?: object;
	message?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: (...args: any[]) => void;
};
