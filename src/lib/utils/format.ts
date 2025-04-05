import type { TrackedBook } from '$lib/types';
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
	isAcscending: boolean = false
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
	if (!isAcscending) {
		return sorted.reverse();
	}
	return sorted;
}
