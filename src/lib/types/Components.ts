import type { Component } from 'svelte';

export type ModalConfig = {
	component: Component | null;
	size?: 'small' | 'medium' | 'large' | 'form';
	title?: string;
	color?: string;
	data?: Record<string, any>; // More flexible than `object`
	message?: string;
	confirmText?: string;
	cancelText?: string;
	onConfirm?: (...args: unknown[]) => void;
};
