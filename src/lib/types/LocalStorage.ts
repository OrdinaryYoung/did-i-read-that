import type { TrackedBook } from './TrackedBook';

export type LocalStorage = {
	books: TrackedBook[];
	sortBy: string;
	isAcscending: boolean;
};
