import { format } from 'date-fns';

export function formatDate(
	dateString: string | Date,
	type: 'date' | 'time' | 'date-time' | 'date-time-day' = 'date'
): string {
	const date = new Date(dateString);

	switch (type) {
		case 'time':
			return format(date, 'h:mm:ss a'); // Example: "2:30:15 PM"
		case 'date-time':
			return format(date, 'MMMM d, yyyy h:mm:ss a'); // Example: "April 2, 2025 2:30:15 PM"
		case 'date-time-day':
			return format(date, 'EEEE, MMMM d, yyyy h:mm:ss a'); // Example: "Wednesday, April 2, 2025 2:30:15 PM"
		case 'date':
		default:
			return format(date, 'MMMM d, yyyy'); // Example: "April 2, 2025"
	}
}
