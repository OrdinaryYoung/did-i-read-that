export type ToastType = 'success' | 'warning' | 'network' | 'error' | 'info';
export type Toast = {
	message: string;
	type: ToastType;
};
