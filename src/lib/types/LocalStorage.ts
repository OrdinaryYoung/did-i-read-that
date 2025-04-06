import type { TrackedBook, TrackingStatsistics } from './TrackedBook';

export type LocalStorage = {
	books: TrackedBook[];
	statsistics: TrackingStatsistics;
	currentReading: TrackedBook | null;
	sortBy: string;
	isAcscending: boolean;
	totalBooks: number;
	pageLimit: PageLimit;
};

export type PageLimit = 10 | 20 | 25 | 50 | 100;
