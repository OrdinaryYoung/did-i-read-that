import 'crypto';
import { json } from '@sveltejs/kit';

import { type Book } from '$lib/types';
const STORAGE_KEY = 'books';

// Load books from Local Storage
export function loadBooks(): Book {
	const books = localStorage.getItem(STORAGE_KEY);
	return books ? JSON.parse(books) : [];
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
	let books: Book[] = loadBooks();
	books = books.map((book: Book) => (book.id === updatedBook.id ? updatedBook : book));
	saveBooks(books);
}
