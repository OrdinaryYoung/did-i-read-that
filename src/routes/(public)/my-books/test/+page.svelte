<script lang="ts">
	import { onMount } from 'svelte';

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
			id: 'c82a1b0d-9143-4a2b-9f23-5d098d8a4cd1',
			title: 'Beyond the Stars',
			author: 'Liam Harrison',
			pages: 420,
			status: 'reading',
			progress: 105,
			addedAt: '2025-03-30T14:12:10.567Z',
			updatedAt: '2025-04-02T10:45:33.789Z'
		},
		{
			id: 'f8e7d6c5-b4a3-2910-a8e5-2d7f9b5c4a1d',
			title: 'The Forgotten Tale',
			author: 'Emma K. White',
			pages: 290,
			status: 'completed',
			progress: 290,
			addedAt: '2025-03-29T07:50:45.342Z',
			updatedAt: '2025-03-31T15:32:21.678Z'
		},
		{
			id: 'a1b2c3d4-e5f6-7890-ab12-cd34ef56gh78',
			title: 'Echoes of the Past',
			author: 'Michael Thompson',
			pages: 310,
			status: 'on-hold',
			progress: 80,
			addedAt: '2025-03-28T09:15:37.890Z',
			updatedAt: '2025-03-30T14:05:50.234Z'
		},
		{
			id: 'd9e8c7b6-a5f4-3201-b7e6-2c5d4a3f8e9d',
			title: 'Under the Moonlight',
			author: 'Sophia L. Carter',
			pages: 280,
			status: 'dropped',
			progress: 50,
			addedAt: '2025-03-25T12:35:28.901Z',
			updatedAt: '2025-03-26T18:29:40.678Z'
		},
		{
			id: 'e7f6d5c4-b3a2-1920-a8e7-3d6f9b4c5a2d',
			title: 'A Journey Within',
			author: 'Isabella M. Brooks',
			pages: 330,
			status: 'reading',
			progress: 150,
			addedAt: '2025-03-20T08:10:55.134Z',
			updatedAt: '2025-04-01T11:25:30.345Z'
		},
		{
			id: 'f1e2d3c4-b5a6-7890-bc12-de34fa56gb78',
			title: 'Winds of Change',
			author: 'David R. Wallace',
			pages: 375,
			status: 'on-hold',
			progress: 200,
			addedAt: '2025-03-18T13:40:20.890Z',
			updatedAt: '2025-03-28T17:12:50.456Z'
		},
		{
			id: 'a8b7c6d5-e4f3-2109-a7e6-3c5d4b2a1f8e',
			title: 'Fading Footsteps',
			author: 'Olivia N. Harris',
			pages: 290,
			status: 'completed',
			progress: 290,
			addedAt: '2025-03-15T07:25:45.678Z',
			updatedAt: '2025-03-22T14:19:33.901Z'
		},
		{
			id: 'c1d2e3f4-b5a6-7890-bc12-de34fa56gb78',
			title: 'The Broken Compass',
			author: 'Henry J. Mitchell',
			pages: 400,
			status: 'reading',
			progress: 175,
			addedAt: '2025-03-10T09:05:30.234Z',
			updatedAt: '2025-03-29T20:30:25.567Z'
		}
	];

	onMount(() => {
		// Get existing books from localStorage
		const existingBooks = JSON.parse(localStorage.getItem('books') || '[]');

		// Merge new books, avoiding duplicates
		const mergedBooks = [
			...existingBooks,
			...books.filter((book) => !existingBooks.some((b) => b.id === book.id))
		];

		// Save updated books to localStorage
		localStorage.setItem('books', JSON.stringify(mergedBooks));

		console.log('Books added to localStorage!', mergedBooks);
	});
</script>

<main>
	<h1>Books Added to Local Storage</h1>
	<p>Check the console or localStorage to see the stored books.</p>
</main>
