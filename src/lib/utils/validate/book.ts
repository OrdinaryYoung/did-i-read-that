import { MAX_AUTHOR_LENGTH, MAX_PAGES, MAX_TITLE_LENGTH } from '$lib/constants';
import type { Book } from '$lib/types';

export function validateTitle(title: Book['title']) {
	if (!title.trim()) {
		return 'Title cannot be empty.';
	}
	if (title.length > MAX_TITLE_LENGTH) {
		return `Title cannot exceed ${MAX_TITLE_LENGTH} characters.`;
	}
	return '';
}

export function validateAuthor(author: Book['author']) {
	if (!author.trim()) {
		return 'Author cannot be empty.';
	}
	if (author.length > MAX_AUTHOR_LENGTH) {
		return `Author name cannot exceed ${MAX_AUTHOR_LENGTH} characters.`;
	}
	return '';
}

export function validatePages(pages: Book['pages']) {
	if (!pages || pages <= 0) {
		return 'Pages must be a positive number.';
	}
	if (pages > MAX_PAGES) {
		return `Pages cannot exceed ${MAX_PAGES}.`;
	}
	return '';
}

export function validateProgress(
	progress: Book['progress'],
	status: Book['status'],
	pages: Book['pages']
) {
	if (status !== 'completed' && status !== 'plan-to-read') {
		if (progress < 0 || progress > pages) {
			return 'Progress must be between 0 and total pages.';
		}
	}
	return '';
}
