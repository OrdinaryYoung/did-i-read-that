import { json } from '@sveltejs/kit';

export const POST = async ({ request, cookies }) => {
	const { id } = await request.json();
	const session = null;

	if (!id) {
		return json({ error: 'ID is required.' }, { status: 400 });
	}

	if (session) {
	} else {
		// Anonymous user: Delete book from cookies
		let books = cookies.get('books') ? JSON.parse(cookies.get('books')!) : [];
		books = books.filter((book: { id: any }) => book.id !== id);

		cookies.set('books', JSON.stringify(books), {
			httpOnly: true,
			maxAge: 60 * 60 * 24 * 360,
			path: '/'
		});

		return json({ success: true, message: 'Book deleted from cookies' });
	}
};
