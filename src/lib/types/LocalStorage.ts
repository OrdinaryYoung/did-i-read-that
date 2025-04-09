import type { TrackedBook, TrackingStatistics } from './TrackedBook';

export type LocalStorage = {
	books: TrackedBook[];
	statistics: TrackingStatistics;
	currentReading: TrackedBook | null;
	sortBy: string;
	isAscending: boolean;
	totalBooks: number;
	pageLimit: PageLimit;
};

export type PageLimit = 10 | 20 | 25 | 50 | 100;

export type Themes = 'light' | 'dark' | null;
