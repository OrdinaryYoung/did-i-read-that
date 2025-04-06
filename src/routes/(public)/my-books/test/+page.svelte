<script lang="ts">
	import type { TrackedBook } from '$lib/types';
	import { onMount } from 'svelte';

	const books: TrackedBook[] = [
		{
			id: 'a1b2c3d4-e5f6-7890-gh12-ij34kl56mn78',
			title: 'The Silent Realm',
			author: 'Emma K. Sterling',
			added_at: '2025-01-15T09:30:22.123Z',
			status: 'reading',
			updated_at: '2025-04-03T16:45:10.456Z',
			pages: 420,
			done: 180,
			done_percent: 42.86
		},
		{
			id: 'b2c3d4e5-f6g7-8901-hi23-jk45lm67no89',
			title: 'Echoes of Tomorrow',
			author: 'James R. Hartley',
			added_at: '2025-02-01T14:20:35.789Z',
			status: 'completed',
			updated_at: '2025-03-28T11:10:55.234Z',
			pages: 300,
			done: 300,
			done_percent: 100
		},
		{
			id: 'c3d4e5f6-g7h8-9012-ij34-kl56mn78op90',
			title: 'Whispers in the Void',
			author: 'Sarah L. Grayson',
			added_at: '2024-12-25T08:15:00.000Z',
			status: 'plan-to-read',
			updated_at: '2025-01-10T09:25:30.567Z',
			pages: 380,
			done: 0,
			done_percent: 0
		},
		{
			id: 'd4e5f6g7-h8i9-0123-jk45-lm67no89pq01',
			title: 'The Crimson Tide',
			author: 'Robert M. Vance',
			added_at: '2025-03-10T13:40:15.890Z',
			status: 'on-hold',
			updated_at: '2025-03-25T17:30:45.678Z',
			pages: 450,
			done: 120,
			done_percent: 26.67 // Fixed typo from "done W_percent" to "done_percent"
		},
		{
			id: 'e5f6g7h8-i9j0-1234-kl56-mn78op90qr12',
			title: 'Beyond the Horizon',
			author: 'Lisa T. Brooks',
			added_at: '2025-02-15T10:25:40.345Z',
			status: 'dropped',
			updated_at: '2025-03-20T15:15:25.901Z',
			pages: 320,
			done: 80,
			done_percent: 25
		},
		{
			id: 'f6g7h8i9-j0k1-2345-lm67-no89pq01rs23',
			title: 'Shadows of Destiny',
			author: 'Michael P. Evans',
			added_at: '2025-01-20T11:15:30.234Z',
			status: 'reading',
			updated_at: '2025-04-02T09:45:20.567Z',
			pages: 390,
			done: 250,
			done_percent: 64.1
		},
		{
			id: 'g7h8i9j0-k1l2-3456-mn78-op90qr12st34',
			title: 'The Last Frontier',
			author: 'Olivia R. Chen',
			added_at: '2025-03-05T16:30:45.678Z',
			status: 'completed',
			updated_at: '2025-03-30T14:20:10.890Z',
			pages: 280,
			done: 280,
			done_percent: 100
		},
		{
			id: 'h8i9j0k1-l2m3-4567-no89-pq01rs23tu45',
			title: 'Veil of Dreams',
			author: 'Thomas J. Riley',
			added_at: '2024-11-30T08:45:15.901Z',
			status: 'plan-to-read',
			updated_at: '2025-02-15T12:10:35.123Z',
			pages: 410,
			done: 0,
			done_percent: 0
		},
		{
			id: 'i9j0k1l2-m3n4-5678-op90-qr12st34uv56',
			title: 'Winds of Change',
			author: 'Katherine L. Moore',
			added_at: '2025-02-28T13:25:40.456Z',
			status: 'on-hold',
			updated_at: '2025-03-15T17:55:25.789Z',
			pages: 360,
			done: 90,
			done_percent: 25
		},
		{
			id: 'j0k1l2m3-n4o5-6789-pq01-rs23tu45vw67',
			title: 'The Eternal Flame',
			author: 'David S. Parker',
			added_at: '2025-01-10T09:15:20.234Z',
			status: 'dropped',
			updated_at: '2025-02-20T11:30:50.567Z',
			pages: 340,
			done: 150,
			done_percent: 44.12
		},
		{
			id: 'k1l2m3n4-o5p6-7890-qr12-st34uv56wx78',
			title: 'Crystal Depths',
			author: 'Laura B. Weston',
			added_at: '2025-03-15T10:40:35.890Z',
			status: 'reading',
			updated_at: '2025-04-01T15:25:15.123Z',
			pages: 430,
			done: 200,
			done_percent: 46.51
		},
		{
			id: 'l2m3n4o5-p6q7-8901-rs23-tu45vw67xy89',
			title: 'The Forgotten Path',
			author: 'William T. Hayes',
			added_at: '2025-02-10T14:50:10.456Z',
			status: 'completed',
			updated_at: '2025-03-25T09:15:40.678Z',
			pages: 310,
			done: 310,
			done_percent: 100
		},
		{
			id: 'm3n4o5p6-q7r8-9012-st34-uv56wx78yz90',
			title: 'Mirrors of Time',
			author: 'Sophie A. Grant',
			added_at: '2024-12-15T07:30:25.901Z',
			status: 'plan-to-read',
			updated_at: '2025-01-25T13:45:55.234Z',
			pages: 370,
			done: 0,
			done_percent: 0
		},
		{
			id: 'n4o5p6q7-r8s9-0123-tu45-vw67xy89za01',
			title: 'The Shattered Crown',
			author: 'Henry G. Ford',
			added_at: '2025-03-01T11:20:50.567Z',
			status: 'on-hold',
			updated_at: '2025-03-20T16:10:20.890Z',
			pages: 400,
			done: 180,
			done_percent: 45
		},
		{
			id: 'o5p6q7r8-s9t0-1234-uv56-wx78yz90ab12',
			title: 'Echoes of Silence',
			author: 'Rachel M. Stone',
			added_at: '2025-02-05T09:10:15.123Z',
			status: 'dropped',
			updated_at: '2025-03-10T14:35:45.456Z',
			pages: 330,
			done: 100,
			done_percent: 30.3
		},
		{
			id: 'p6q7r8s9-t0u1-2345-vw67-xy89za01bc23',
			title: 'The Golden Spiral',
			author: 'Peter N. Clark',
			added_at: '2025-01-25T15:45:40.678Z',
			status: 'reading',
			updated_at: '2025-04-04T08:20:10.901Z',
			pages: 380,
			done: 300,
			done_percent: 78.95
		},
		{
			id: 'q7r8s9t0-u1v2-3456-wx78-yz90ab12cd34',
			title: 'Beneath the Stars',
			author: 'Julia K. Ellis',
			added_at: '2025-03-20T12:15:25.234Z',
			status: 'completed',
			updated_at: '2025-04-03T17:50:35.567Z',
			pages: 290,
			done: 290,
			done_percent: 100
		},
		{
			id: 'r8s9t0u1-v2w3-4567-xy89-za01bc23de45',
			title: 'The Hidden Realm',
			author: 'Mark L. Jensen',
			added_at: '2024-11-20T08:25:50.890Z',
			status: 'plan-to-read',
			updated_at: '2025-02-01T10:40:15.123Z',
			pages: 350,
			done: 0,
			done_percent: 0
		},
		{
			id: 's9t0u1v2-w3x4-5678-yz90-ab12cd34ef56',
			title: 'Flames of Eternity',
			author: 'Nancy R. Wells',
			added_at: '2025-02-20T13:35:20.456Z',
			status: 'on-hold',
			updated_at: '2025-03-15T09:15:40.678Z',
			pages: 440,
			done: 220,
			done_percent: 50
		},
		{
			id: 't0u1v2w3-x4y5-6789-za01-bc23de45fg67',
			title: 'The Lost Symphony',
			author: 'Edward P. Lane',
			added_at: '2025-01-05T10:50:45.901Z',
			status: 'dropped',
			updated_at: '2025-02-25T16:25:10.234Z',
			pages: 320,
			done: 60,
			done_percent: 18.75
		},
		{
			id: 'u1v2w3x4-y5z6-7890-ab12-cd34ef56gh78',
			title: 'Tides of Memory',
			author: 'Grace T. Adams',
			added_at: '2025-03-25T14:10:15.567Z',
			status: 'reading',
			updated_at: '2025-04-02T11:45:35.890Z',
			pages: 410,
			done: 150,
			done_percent: 36.59
		},
		{
			id: 'v2w3x4y5-z6a7-8901-bc23-de45fg67hi89',
			title: 'The Crystal Veil',
			author: 'Brian S. Turner',
			added_at: '2025-02-15T09:20:40.123Z',
			status: 'completed',
			updated_at: '2025-03-20T13:30:50.456Z',
			pages: 270,
			done: 270,
			done_percent: 100
		},
		{
			id: 'w3x4y5z6-a7b8-9012-cd34-ef45gh67ij90',
			title: 'Whispers of Power',
			author: 'Claire M. Hudson',
			added_at: '2024-12-10T07:15:25.678Z',
			status: 'plan-to-read',
			updated_at: '2025-01-30T15:10:20.901Z',
			pages: 390,
			done: 0,
			done_percent: 0
		},
		{
			id: 'x4y5z6a7-b8c9-0123-de45-fg67hi89jk01',
			title: 'The Iron Throne',
			author: 'George R. King',
			added_at: '2025-03-10T11:40:50.234Z',
			status: 'on-hold',
			updated_at: '2025-03-28T17:25:45.567Z',
			pages: 460,
			done: 230,
			done_percent: 50
		},
		{
			id: 'y5z6a7b8-c9d0-1234-ef45-gh67ij89kl12',
			title: 'Shadows of Light',
			author: 'Helen J. Price',
			added_at: '2025-01-15T13:55:15.890Z',
			status: 'dropped',
			updated_at: '2025-02-28T10:35:25.123Z',
			pages: 340,
			done: 120,
			done_percent: 35.29
		},
		{
			id: 'z6a7b8c9-d0e1-2345-fg67-hi89jk90lm23',
			title: 'The Endless Sea',
			author: 'Patrick L. Dunn',
			added_at: '2025-03-01T08:30:40.456Z',
			status: 'reading',
			updated_at: '2025-04-03T14:15:10.678Z',
			pages: 400,
			done: 320,
			done_percent: 80
		},
		{
			id: 'a7b8c9d0-e1f2-3456-gh67-ij89kl90mn34',
			title: 'Pillars of Dust',
			author: 'Megan K. Ross',
			added_at: '2025-02-25T15:10:25.901Z',
			status: 'completed',
			updated_at: '2025-03-30T09:45:35.234Z',
			pages: 310,
			done: 310,
			done_percent: 100
		},
		{
			id: 'b8c9d0e1-f2g3-4567-hi89-jk90lm01no45',
			title: 'The Broken Sky',
			author: 'Steven R. Cole',
			added_at: '2024-11-25T10:25:50.567Z',
			status: 'plan-to-read',
			updated_at: '2025-02-10T12:50:15.890Z',
			pages: 370,
			done: 0,
			done_percent: 0
		},
		{
			id: 'c9d0e1f2-g3h4-5678-ij89-kl90mn12op56',
			title: 'Echoes of War',
			author: 'Linda T. Myers',
			added_at: '2025-03-15T13:45:20.123Z',
			status: 'on-hold',
			updated_at: '2025-03-25T16:20:40.456Z',
			pages: 420,
			done: 210,
			done_percent: 50
		},
		{
			id: 'd0e1f2g3-h4i5-6789-jk90-lm01no23pq67',
			title: 'The Final Dawn',
			author: 'Andrew P. Blake',
			added_at: '2025-02-01T09:15:45.678Z',
			status: 'dropped',
			updated_at: '2025-03-05T11:30:25.901Z',
			pages: 350,
			done: 140,
			done_percent: 40
		},

		{
			id: 'h8i9j0k1-l2m3-4567-no89-pq01rs23tu45',
			title: 'Veil of Shadows',
			author: 'Thomas J. Riley',
			added_at: '2025-02-10T08:45:20.789Z',
			status: 'completed',
			updated_at: '2025-03-15T16:30:45.234Z',
			pages: 280,
			done: 280,
			done_percent: 100
		},
		{
			id: 'i9j0k1l2-m3n4-5678-op90-qr12st34uv56',
			title: 'Winds of Fate',
			author: 'Katherine L. Moore',
			added_at: '2025-03-01T11:20:35.567Z',
			status: 'reading',
			updated_at: '2025-04-04T13:25:50.890Z',
			pages: 360,
			done: 180,
			done_percent: 50
		},
		{
			id: 'j0k1l2m3-n4o5-6789-pq01-rs23tu45vw67',
			title: 'The Eternal Quest',
			author: 'David S. Parker',
			added_at: '2025-01-25T09:10:15.901Z',
			status: 'on-hold',
			updated_at: '2025-02-28T15:40:25.123Z',
			pages: 430,
			done: 150,
			done_percent: 34.88
		},
		{
			id: 'k1l2m3n4-o5p6-7890-qr12-st34uv56wx78',
			title: 'Crystal Horizons',
			author: 'Laura B. Weston',
			added_at: '2025-02-20T13:35:40.456Z',
			status: 'dropped',
			updated_at: '2025-03-10T10:15:20.678Z',
			pages: 340,
			done: 90,
			done_percent: 26.47
		},
		{
			id: 'l2m3n4o5-p6q7-8901-rs23-tu45vw67xy89',
			title: 'The Forgotten Realm',
			author: 'William T. Hayes',
			added_at: '2024-12-20T07:25:50.234Z',
			status: 'plan-to-read',
			updated_at: '2025-02-01T12:30:45.567Z',
			pages: 390,
			done: 0,
			done_percent: 0
		},
		{
			id: 'm3n4o5p6-q7r8-9012-st34-uv56wx78yz90',
			title: 'Mirrors of Eternity',
			author: 'Sophie A. Grant',
			added_at: '2025-03-05T15:40:10.890Z',
			status: 'reading',
			updated_at: '2025-04-03T09:20:35.123Z',
			pages: 370,
			done: 220,
			done_percent: 59.46
		},
		{
			id: 'n4o5p6q7-r8s9-0123-tu45-vw67xy89za01',
			title: 'The Shattered Veil',
			author: 'Henry G. Ford',
			added_at: '2025-02-15T10:50:25.456Z',
			status: 'completed',
			updated_at: '2025-03-25T14:15:40.789Z',
			pages: 310,
			done: 310,
			done_percent: 100
		},
		{
			id: 'o5p6q7r8-s9t0-1234-uv56-wx78yz90ab12',
			title: 'Echoes of the Lost',
			author: 'Rachel M. Stone',
			added_at: '2025-01-10T08:15:30.901Z',
			status: 'on-hold',
			updated_at: '2025-02-20T11:45:55.234Z',
			pages: 400,
			done: 200,
			done_percent: 50
		},
		{
			id: 'p6q7r8s9-t0u1-2345-vw67-xy89za01bc23',
			title: 'The Golden Path',
			author: 'Peter N. Clark',
			added_at: '2025-03-20T12:30:45.567Z',
			status: 'dropped',
			updated_at: '2025-03-30T16:25:10.890Z',
			pages: 330,
			done: 110,
			done_percent: 33.33
		},
		{
			id: 'q7r8s9t0-u1v2-3456-wx78-yz90ab12cd34',
			title: 'Beneath the Veil',
			author: 'Julia K. Ellis',
			added_at: '2024-11-25T09:20:15.123Z',
			status: 'plan-to-read',
			updated_at: '2025-01-15T13:35:40.456Z',
			pages: 350,
			done: 0,
			done_percent: 0
		},
		{
			id: 'r8s9t0u1-v2w3-4567-xy89-za01bc23de45',
			title: 'The Hidden Flame',
			author: 'Mark L. Jensen',
			added_at: '2025-02-25T14:45:50.678Z',
			status: 'reading',
			updated_at: '2025-04-02T10:10:25.901Z',
			pages: 420,
			done: 300,
			done_percent: 71.43
		},
		{
			id: 's9t0u1v2-w3x4-5678-yz90-ab12cd34ef56',
			title: 'Flames of Destiny',
			author: 'Nancy R. Wells',
			added_at: '2025-03-15T11:15:20.234Z',
			status: 'completed',
			updated_at: '2025-04-01T15:40:35.567Z',
			pages: 290,
			done: 290,
			done_percent: 100
		},
		{
			id: 't0u1v2w3-x4y5-6789-za01-bc23de45fg67',
			title: 'The Lost Echo',
			author: 'Edward P. Lane',
			added_at: '2025-01-30T07:25:45.890Z',
			status: 'on-hold',
			updated_at: '2025-03-05T09:30:15.123Z',
			pages: 380,
			done: 190,
			done_percent: 50
		},
		{
			id: 'u1v2w3x4-y5z6-7890-ab12-cd34ef56gh78',
			title: 'Tides of Fate',
			author: 'Grace T. Adams',
			added_at: '2025-02-05T13:40:10.456Z',
			status: 'dropped',
			updated_at: '2025-02-25T16:15:40.789Z',
			pages: 340,
			done: 85,
			done_percent: 25
		},
		{
			id: 'v2w3x4y5-z6a7-8901-bc23-de45fg67hi89',
			title: 'The Crystal Flame',
			author: 'Brian S. Turner',
			added_at: '2024-12-30T10:50:25.901Z',
			status: 'plan-to-read',
			updated_at: '2025-02-10T14:20:50.234Z',
			pages: 400,
			done: 0,
			done_percent: 0
		},
		{
			id: 'w3x4y5z6-a7b8-9012-cd34-ef45gh67ij90',
			title: 'Whispers of Eternity',
			author: 'Claire M. Hudson',
			added_at: '2025-03-25T08:15:35.567Z',
			status: 'reading',
			updated_at: '2025-04-04T11:45:20.890Z',
			pages: 370,
			done: 250,
			done_percent: 67.57
		},
		{
			id: 'x4y5z6a7-b8c9-0123-de45-fg67hi89jk01',
			title: 'The Iron Crown',
			author: 'George R. King',
			added_at: '2025-02-15T15:30:40.123Z',
			status: 'completed',
			updated_at: '2025-03-20T09:25:15.456Z',
			pages: 310,
			done: 310,
			done_percent: 100
		},
		{
			id: 'y5z6a7b8-c9d0-1234-ef45-gh67ij89kl12',
			title: 'Shadows of Eternity',
			author: 'Helen J. Price',
			added_at: '2025-01-20T11:45:50.678Z',
			status: 'on-hold',
			updated_at: '2025-03-01T13:40:25.901Z',
			pages: 430,
			done: 215,
			done_percent: 50
		},
		{
			id: 'z6a7b8c9-d0e1-2345-fg67-hi89jk90lm23',
			title: 'The Endless Void',
			author: 'Patrick L. Dunn',
			added_at: '2025-03-10T09:20:15.234Z',
			status: 'dropped',
			updated_at: '2025-03-25T16:15:40.567Z',
			pages: 350,
			done: 140,
			done_percent: 40
		},
		{
			id: 'a7b8c9d0-e1f2-3456-gh67-ij89kl90mn34',
			title: 'Pillars of Eternity',
			author: 'Megan K. Ross',
			added_at: '2024-11-20T07:35:20.890Z',
			status: 'plan-to-read',
			updated_at: '2025-01-25T10:50:45.123Z',
			pages: 390,
			done: 0,
			done_percent: 0
		},
		{
			id: 'b8c9d0e1-f2g3-4567-hi89-jk90lm01no45',
			title: 'The Broken Realm',
			author: 'Steven R. Cole',
			added_at: '2025-02-25T13:15:35.456Z',
			status: 'reading',
			updated_at: '2025-04-03T14:30:10.789Z',
			pages: 420,
			done: 320,
			done_percent: 76.19
		},
		{
			id: 'c9d0e1f2-g3h4-5678-ij89-kl90mn12op56',
			title: 'Echoes of Destiny',
			author: 'Linda T. Myers',
			added_at: '2025-03-05T10:40:50.901Z',
			status: 'completed',
			updated_at: '2025-03-30T15:25:20.234Z',
			pages: 280,
			done: 280,
			done_percent: 100
		},
		{
			id: 'd0e1f2g3-h4i5-6789-jk90-lm01no23pq67',
			title: 'The Final Echo',
			author: 'Andrew P. Blake',
			added_at: '2025-01-15T08:25:15.567Z',
			status: 'on-hold',
			updated_at: '2025-02-20T11:15:40.890Z',
			pages: 400,
			done: 200,
			done_percent: 50
		},
		{
			id: 'e1f2g3h4-i5j6-7890-kl90-mn12op34qr78',
			title: 'The Silent Tide',
			author: 'Rebecca L. Shaw',
			added_at: '2025-02-10T14:50:20.123Z',
			status: 'dropped',
			updated_at: '2025-03-15T09:30:45.456Z',
			pages: 330,
			done: 100,
			done_percent: 30.3
		},
		{
			id: 'f2g3h4i5-j6k7-8901-lm01-no23pq45rs89',
			title: 'Beyond the Veil',
			author: 'Daniel M. Pierce',
			added_at: '2024-12-15T07:15:35.789Z',
			status: 'plan-to-read',
			updated_at: '2025-02-05T13:25:10.901Z',
			pages: 370,
			done: 0,
			done_percent: 0
		},
		{
			id: 'g3h4i5j6-k7l8-9012-mn12-op34qr56st90',
			title: 'The Crimson Flame',
			author: 'Emily R. Carter',
			added_at: '2025-03-20T11:30:50.234Z',
			status: 'reading',
			updated_at: '2025-04-04T08:45:25.567Z',
			pages: 410,
			done: 300,
			done_percent: 73.17
		},
		{
			id: 'h4i5j6k7-l8m9-0123-no23-pq45rs67tu01',
			title: 'Whispers of Fate',
			author: 'John T. Harris',
			added_at: '2025-02-20T09:40:15.890Z',
			status: 'completed',
			updated_at: '2025-03-25T14:15:40.123Z',
			pages: 290,
			done: 290,
			done_percent: 100
		},
		{
			id: 'i5j6k7l8-m9n0-1234-op34-qr56st78uv12',
			title: 'The Lost Crown',
			author: 'Anna L. Brooks',
			added_at: '2025-01-25T13:25:20.456Z',
			status: 'on-hold',
			updated_at: '2025-03-10T16:30:55.789Z',
			pages: 380,
			done: 190,
			done_percent: 50
		},
		{
			id: 'j6k7l8m9-n0o1-2345-pq45-rs67tu89vw23',
			title: 'Shadows of the Void',
			author: 'Paul R. Evans',
			added_at: '2025-03-15T08:15:45.901Z',
			status: 'dropped',
			updated_at: '2025-03-30T11:45:20.234Z',
			pages: 340,
			done: 120,
			done_percent: 35.29
		},
		{
			id: 'k7l8m9n0-o1p2-3456-qr56-st78uv90wx34',
			title: 'The Eternal Horizon',
			author: 'Sarah M. Lee',
			added_at: '2024-11-30T10:50:10.567Z',
			status: 'plan-to-read',
			updated_at: '2025-01-20T14:20:35.890Z',
			pages: 400,
			done: 0,
			done_percent: 0
		},
		{
			id: 'l8m9n0o1-p2q3-4567-rs67-tu89vw01xy45',
			title: 'Crystal Echoes',
			author: 'Michael T. Gray',
			added_at: '2025-02-15T07:35:25.123Z',
			status: 'reading',
			updated_at: '2025-04-02T09:15:50.456Z',
			pages: 370,
			done: 280,
			done_percent: 75.68
		},
		{
			id: 'm9n0o1p2-q3r4-5678-st78-uv90wx12yz56',
			title: 'The Forgotten Flame',
			author: 'Lisa R. Turner',
			added_at: '2025-03-25T14:20:40.789Z',
			status: 'completed',
			updated_at: '2025-04-03T16:25:15.901Z',
			pages: 310,
			done: 310,
			done_percent: 100
		},
		{
			id: 'n0o1p2q3-r4s5-6789-tu89-vw01xy23za67',
			title: 'Mirrors of Destiny',
			author: 'Robert L. King',
			added_at: '2025-01-10T09:45:55.234Z',
			status: 'on-hold',
			updated_at: '2025-02-25T13:30:20.567Z',
			pages: 430,
			done: 215,
			done_percent: 50
		},
		{
			id: 'o1p2q3r4-s5t6-7890-uv90-wx12yz34ab78',
			title: 'The Shattered Echo',
			author: 'Jennifer M. Cole',
			added_at: '2025-02-05T11:15:20.890Z',
			status: 'dropped',
			updated_at: '2025-03-15T15:40:45.123Z',
			pages: 350,
			done: 140,
			done_percent: 40
		},
		{
			id: 'p2q3r4s5-t6u7-8901-vw01-xy23za45bc89',
			title: 'Echoes of the Void',
			author: 'Thomas R. Shaw',
			added_at: '2024-12-25T08:30:35.456Z',
			status: 'plan-to-read',
			updated_at: '2025-02-15T10:25:50.789Z',
			pages: 390,
			done: 0,
			done_percent: 0
		},
		{
			id: 'q3r4s5t6-u7v8-9012-wx12-yz34ab56cd90',
			title: 'The Golden Flame',
			author: 'Emma L. Pierce',
			added_at: '2025-03-20T13:45:10.901Z',
			status: 'reading',
			updated_at: '2025-04-04T07:35:25.234Z',
			pages: 420,
			done: 340,
			done_percent: 80.95
		},
		{
			id: 'r4s5t6u7-v8w9-0123-xy23-za45bc67de01',
			title: 'Beneath the Horizon',
			author: 'James T. Carter',
			added_at: '2025-02-25T09:20:45.567Z',
			status: 'completed',
			updated_at: '2025-03-30T11:15:40.890Z',
			pages: 280,
			done: 280,
			done_percent: 100
		},
		{
			id: 's5t6u7v8-w9x0-1234-yz34-ab56cd78ef12',
			title: 'The Hidden Echo',
			author: 'Sarah R. Harris',
			added_at: '2025-01-20T07:35:50.123Z',
			status: 'on-hold',
			updated_at: '2025-03-05T14:20:15.456Z',
			pages: 400,
			done: 200,
			done_percent: 50
		},
		{
			id: 't6u7v8w9-x0y1-2345-za45-bc67de89fg23',
			title: 'Flames of the Void',
			author: 'David L. Brooks',
			added_at: '2025-03-15T10:50:25.789Z',
			status: 'dropped',
			updated_at: '2025-03-25T16:45:40.901Z',
			pages: 330,
			done: 110,
			done_percent: 33.33
		},
		{
			id: 'u7v8w9x0-y1z2-3456-ab56-cd78ef90gh34',
			title: 'The Lost Horizon',
			author: 'Laura T. Evans',
			added_at: '2024-11-15T13:15:20.234Z',
			status: 'plan-to-read',
			updated_at: '2025-01-10T09:30:45.567Z',
			pages: 370,
			done: 0,
			done_percent: 0
		},
		{
			id: 'v8w9x0y1-z2a3-4567-bc67-de89fg01hi45',
			title: 'Tides of Eternity',
			author: 'William R. Lee',
			added_at: '2025-02-20T08:45:35.890Z',
			status: 'reading',
			updated_at: '2025-04-03T12:25:10.123Z',
			pages: 410,
			done: 320,
			done_percent: 78.05
		},
		{
			id: 'w9x0y1z2-a3b4-5678-cd78-ef90gh12ij56',
			title: 'The Crystal Horizon',
			author: 'Rachel T. Gray',
			added_at: '2025-03-25T11:20:50.456Z',
			status: 'completed',
			updated_at: '2025-04-04T14:15:25.789Z',
			pages: 290,
			done: 290,
			done_percent: 100
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
		books.map((book) => {
			book.done_percent = book.done_percent / 100;
			return book;
		});
		localStorage.setItem('books', JSON.stringify(mergedBooks));

		console.log('Books added to localStorage!', mergedBooks);
	});
</script>

<main>
	<h1>Books Added to Local Storage</h1>
	<p>Check the console or localStorage to see the stored books.</p>
</main>
