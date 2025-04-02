import { json } from '@sveltejs/kit';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request, cookies }) => {
	const { id, title, author, pages, progress, status, addedAt } = await request.json();
	const session = null;
	if (!id || !title || !author || progress == null || pages <= 0 || !addedAt) {
		return json({ error: 'All params are required.' }, { status: 400 });
	}
	const DATE = new Date().toISOString();
	const editBook: Book = {
		id: crypto.randomUUID(),
		title,
		author,
		pages,
		status,
		progress,
		addedAt,
		updatedAt: DATE
	};

	if (session) {
	} else {
		// Anonymous user: Update book in cookies
		let books = cookies.get('books') ? JSON.parse(cookies.get('books')!) : [];
		const bookIndex = books.findIndex((book: { id: any }) => book.id === id);

		if (bookIndex === -1) {
			return json({ error: 'Book not found in cookies' }, { status: 404 });
		}

		books[bookIndex] = editBook;

		cookies.set('books', JSON.stringify(books), {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 360,
			path: '/'
		});

		return json({ success: true, message: 'Book updated in cookies' });
	}
};
