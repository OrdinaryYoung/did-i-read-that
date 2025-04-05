import 'crypto';

import { type TrackedBook, type LocalStorage } from '$lib/types';
import { sortBooks } from './format';

const STORAGE_BOOKS = 'books';
const STORAGE_SORT = 'sortBy';
const STORAGE_SORT_ACS = 'isAcscending';

export function loadStorage(): LocalStorage {
	const books: TrackedBook[] = loadBooks();

	const sortBy: string = localStorage.getItem(STORAGE_SORT) || 'updated_at';
	const isAcscending: boolean = localStorage.getItem(STORAGE_SORT_ACS) === 'true' ? true : false;

	return {
		books: sortBooks(books, sortBy as keyof TrackedBook, isAcscending),
		sortBy,
		isAcscending
	};
}

// Load books from Local Storage and sort by updatedAt (newer first)
export function loadBooks(): TrackedBook[] {
	const books = localStorage.getItem(STORAGE_BOOKS);
	return books ? JSON.parse(books) : [];
}

// Save into the Local Storage
export function saveBooks(books: TrackedBook[]) {
	localStorage.setItem(STORAGE_BOOKS, JSON.stringify(books));
}
export function saveSortBy(sortBy: keyof TrackedBook, isAcscending: boolean) {
	localStorage.setItem(STORAGE_SORT, sortBy);
	localStorage.setItem(STORAGE_SORT_ACS, JSON.stringify(isAcscending));
}

// Add a new book to Local Storage
export function addBook(book: TrackedBook) {
	const { title, author, status, pages, done }: TrackedBook = book;
	const books: TrackedBook[] = loadBooks();

	const DATE = new Date();
	const newBook: TrackedBook = {
		id: crypto.randomUUID(),
		title,
		author,
		added_at: DATE,
		status,
		updated_at: DATE,
		pages,
		done,
		done_percent: done / pages
	};
	books.push(newBook);

	saveBooks(books);
}

// Delete a book from Local Storage
export function deleteBook(id: string) {
	let books: TrackedBook[] = loadBooks();
	books = books.filter((book: TrackedBook) => book.id !== id);
	saveBooks(books);
}

// Update a book in Local Storage
export function updateBook(updatedBook: TrackedBook) {
	let books: TrackedBook[] = loadBooks();
	books = books.map((book: TrackedBook) => (book.id === updatedBook.id ? updatedBook : book));
	saveBooks(books);
}
