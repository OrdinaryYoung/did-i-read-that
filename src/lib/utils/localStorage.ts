import { STORAGE_BOOKS, STORAGE_PAGE_LIMIT, STORAGE_SORT, STORAGE_SORT_ACS } from '$lib/constants';
import { type TrackedBook, type LocalStorage, type PageLimit } from '$lib/types';
import { sortBooks, updateStats } from './format';

export function loadStorage(curPage: number = 1): LocalStorage {
	const pageLimit: PageLimit =
		(Number(localStorage.getItem(STORAGE_PAGE_LIMIT)) as PageLimit) || 25;
	const start: number = pageLimit * (curPage - 1);
	const end: number = start + pageLimit;
	const books: TrackedBook[] = loadBooks();
	const totalBooks = books.length;
	const currentReading: TrackedBook = books.filter((book) => book.status === 'reading')[0];

	const sortBy: string = localStorage.getItem(STORAGE_SORT) || 'updated_at';
	const isAscending: boolean = localStorage.getItem(STORAGE_SORT_ACS) === 'true' ? true : false;

	return {
		books: sortBooks(books, sortBy as keyof TrackedBook, isAscending).slice(start, end),
		statistics: updateStats(books),
		currentReading,
		sortBy,
		isAscending,
		pageLimit,
		totalBooks
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
export function saveSortBy(sortBy: keyof TrackedBook, isAscending: boolean) {
	localStorage.setItem(STORAGE_SORT, sortBy);
	localStorage.setItem(STORAGE_SORT_ACS, JSON.stringify(isAscending));
}
export function savePageLimit(limit: PageLimit) {
	localStorage.setItem(STORAGE_PAGE_LIMIT, JSON.stringify(limit));
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
