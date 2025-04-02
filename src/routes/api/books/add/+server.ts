import 'crypto';
import { json } from '@sveltejs/kit';

import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { title, author, pages, status, progress } = await request.json();

	if (!title || !author || pages <= 0 || progress == null) {
		return json({ error: 'Title, Author, Progress, and Pages are required.' }, { status: 400 });
	}
	const DATE = new Date().toISOString();
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

	// Store in cookies (secure cookie storage is essential)
	let books = cookies.get('books') ? JSON.parse(cookies.get('books')!) : [];

	// Add the new book to the books list
	books.push(newBook);

	// Save back the updated books list in the cookie
	cookies.set('books', JSON.stringify(books), {
		httpOnly: true, // Secure cookies (only accessible via HTTP)
		maxAge: 60 * 60 * 24 * 30, // Store for 30 days
		path: '/'
	});

	return json({ success: true, message: 'Book added to cookies' });
};
