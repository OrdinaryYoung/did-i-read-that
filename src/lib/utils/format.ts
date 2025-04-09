import type { TrackedBook, TrackingStatistics } from '$lib/types';
import { format } from 'date-fns';

export function formatDate(
	dateString: string | Date,
	type: 'date' | 'time' | 'date-time' | 'date-time-day' = 'date'
): string {
	const date = new Date(dateString);

	switch (type) {
		case 'time':
			return format(date, 'h:mm a'); // Example: "2:30 PM"
		case 'date-time':
			return format(date, 'MMMM d, yyyy h:mm a'); // Example: "April 2, 2025 2:30 PM"
		case 'date-time-day':
			return format(date, 'EEEE, MMMM d, yyyy h:mm a'); // Example: "Wednesday, April 2, 2025 2:30 PM"
		case 'date':
		default:
			return format(date, 'MMMM d, yyyy'); // Example: "April 2, 2025"
	}
}

export function sortBooks(
	books: TrackedBook[],
	sortBy: keyof TrackedBook = 'updated_at',
	isAscending: boolean = false
): TrackedBook[] {
	const sorted = books.sort((a: TrackedBook, b: TrackedBook) => {
		const aValue = a[sortBy];
		const bValue = b[sortBy];
		if (typeof aValue === 'string' && typeof bValue === 'string') {
			return aValue.localeCompare(bValue);
		}
		if (typeof aValue === 'number' && typeof bValue === 'number') {
			return aValue - bValue;
		}
		if (aValue instanceof Date && bValue instanceof Date) {
			return aValue.getTime() - bValue.getTime();
		}
		return 0;
	});
	if (!isAscending) {
		return sorted.reverse();
	}
	return sorted;
}

export const updateStats = (books: TrackedBook[]): TrackingStatistics => {
	const stats = {
		reading: 0,
		completed: 0,
		'on-hold': 0,
		dropped: 0,
		'plan-to-read': 0,
		totalBooks: 0,
		totalPages: 0
	};

	stats.totalBooks = books.length;
	stats.totalPages = books.reduce((sum, book) => sum + book.done, 0);

	Object.keys(stats).forEach((status) => {
		if (status !== 'totalBooks' && status !== 'totalPages') {
			stats[status as keyof typeof stats] = books.filter((book) => book.status === status).length;
		}
	});
	return stats;
};
