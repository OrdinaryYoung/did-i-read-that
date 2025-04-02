import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

const books = [
	{
		id: 'f23a22fc-f419-4525-b98a-59b07d033895',
		title: 'Me in The Street',
		author: 'Barak Obama',
		pages: 120,
		status: 'on-hold',
		progress: 0,
		addedAt: '2025-04-02T13:21:50.783Z',
		updatedAt: '2025-04-02T13:21:50.783Z'
	},
	{
		id: 'b1234567-1234-1234-1234-1234567890ab',
		title: 'The Silent Ocean',
		author: 'Sarah L. Jones',
		pages: 350,
		status: 'completed',
		progress: 350,
		addedAt: '2025-04-01T08:30:15.123Z',
		updatedAt: '2025-04-01T12:45:22.987Z'
	},
	{
		id: 'c2345678-2345-2345-2345-2345678901bc',
		title: 'Artificial Dawn',
		author: 'Liam Roberts',
		pages: 500,
		status: 'reading',
		progress: 150,
		addedAt: '2025-03-31T09:15:40.345Z',
		updatedAt: '2025-04-01T10:10:30.567Z'
	},
	{
		id: 'd3456789-3456-3456-3456-3456789012cd',
		title: 'Into the Abyss',
		author: 'Emily Carter',
		pages: 280,
		status: 'dropped',
		progress: 50,
		addedAt: '2025-03-29T14:00:00.000Z',
		updatedAt: '2025-03-30T08:20:10.123Z'
	},
	{
		id: 'e4567890-4567-4567-4567-4567890123de',
		title: 'Shadows of Time',
		author: 'James Oliver',
		pages: 600,
		status: 'reading',
		progress: 300,
		addedAt: '2025-03-25T18:45:30.678Z',
		updatedAt: '2025-03-28T09:30:45.890Z'
	},
	{
		id: 'f5678901-5678-5678-5678-5678901234ef',
		title: 'Echoes of the Past',
		author: 'Sophia Reynolds',
		pages: 200,
		status: 'on-hold',
		progress: 100,
		addedAt: '2025-03-20T12:15:20.456Z',
		updatedAt: '2025-03-22T17:05:33.345Z'
	},
	{
		id: 'g6789012-6789-6789-6789-6789012345fg',
		title: 'The Forgotten Realm',
		author: 'Michael Smith',
		pages: 450,
		status: 'plan-to-read',
		progress: 0,
		addedAt: '2025-03-15T15:30:10.789Z',
		updatedAt: '2025-03-15T15:30:10.789Z'
	},
	{
		id: 'h7890123-7890-7890-7890-7890123456gh',
		title: 'Digital Minds',
		author: 'Olivia Martinez',
		pages: 320,
		status: 'completed',
		progress: 320,
		addedAt: '2025-03-10T10:10:10.123Z',
		updatedAt: '2025-03-12T20:20:20.345Z'
	},
	{
		id: 'i8901234-8901-8901-8901-8901234567hi',
		title: 'Winds of Change',
		author: 'Ethan Harris',
		pages: 150,
		status: 'reading',
		progress: 75,
		addedAt: '2025-03-05T08:00:00.000Z',
		updatedAt: '2025-03-07T12:45:55.456Z'
	}
];

export const GET: RequestHandler = ({ cookies }) => {
	cookies.set('books', JSON.stringify(books), {
		path: '/',
		httpOnly: false, // Set to true for security, but false allows frontend access
		maxAge: 60 * 60 * 24 * 365
	});

	return json({ message: 'Books saved to cookies!', books });
};
