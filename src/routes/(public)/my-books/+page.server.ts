import { supabase } from '$lib/supabase';

const PAGE_TITLE = 'My Books';

export const load = async ({ cookies }) => {
	const session = null;

	if (session) {
		const { data: books, error } = await supabase
			.from('books')
			.select('*')
			.order('added_at', { ascending: false });

		if (error) {
			console.error('Error fetching books from Supabase:', error);
			return { books: [], error: error.message };
		}

		return { books, error: null };
	} else {
		const books = cookies.get('books') ? JSON.parse(cookies.get('books')!) : [];
		return { books, error: null, title: PAGE_TITLE };
	}
};
