import 'crypto';
import { json } from '@sveltejs/kit';

import { type Book } from '$lib/types';

const STORAGE_KEY = 'books';

// Load books from Local Storage and sort by updatedAt (newer first)
export function loadBooks(): Book[] {
	const books = localStorage.getItem(STORAGE_KEY);
	return books
		? JSON.parse(books).sort(
				(a: { updatedAt: string | number | Date }, b: { updatedAt: string | number | Date }) =>
					new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
			)
		: [];
}

// Save books to Local Storage
export function saveBooks(books: Book[]) {
	localStorage.setItem(STORAGE_KEY, JSON.stringify(books));
}

// Add a new book to Local Storage
export function addBook(book: Book) {
	const { title, author, pages, status, progress }: Book = book;
	const books: Book[] = loadBooks();

	if (!title || !author || pages <= 0 || progress == null) {
		return json({ error: 'Title, Author, Progress, and Pages are required.' }, { status: 400 });
	}
	const DATE = new Date();
	const newBook: Book = {
		id: crypto.randomUUID(),
		title,
		author,
		pages,
		status,
		progress,
		addedAt: DATE,
		updatedAt: DATE
	};
	books.push(newBook);

	saveBooks(books);
}

// Delete a book from Local Storage
export function deleteBook(id: string) {
	let books: Book[] = loadBooks();
	books = books.filter((book: Book) => book.id !== id);
	saveBooks(books);
}

// Update a book in Local Storage
export function updateBook(updatedBook: Book) {
	updatedBook.updatedAt = new Date();
	let books: Book[] = loadBooks();
	books = books.map((book: Book) => (book.id === updatedBook.id ? updatedBook : book));
	saveBooks(books);
}
