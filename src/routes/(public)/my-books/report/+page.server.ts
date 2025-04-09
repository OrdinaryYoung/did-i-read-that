import type { TrackedBook } from '$lib/types';
import { sortBooks, updateStats } from '$lib/utils';

const PAGE_TITLE = 'My Books | Export';

export const load = ({ cookies }) => {
	const booksRaw = cookies.get('report-books');
	const sortBy = cookies.get('report-sort') || 'title';
	const isAscending = cookies.get('report-asc') === 'true';

	let books = [];
	if (booksRaw) {
		try {
			books = JSON.parse(booksRaw);
		} catch (err) {
			console.error('Failed to parse books cookie:', err);
		}
	}

	return {
		localStorage: {
			books: sortBooks(books, sortBy as keyof TrackedBook, isAscending),
			statistics: updateStats(books),
			sortBy,
			isAscending
		},
		title: PAGE_TITLE
	};
};
