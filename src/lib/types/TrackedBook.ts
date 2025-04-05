export type TrackedBook = {
	id: string; // Unique ID
	title: string; // Book Title
	author: string; // Book Author
	added_at: Date | string; // Date added to the list8
	status: BookStatus; // Reading StatusX
	updated_at: Date | string; // Date last updated
	pages: number; // Total Pages
	done: number; // Pages Finished
	done_percent: number; // Percentage of Pages Finished
};

export type BookStatus = 'plan-to-read' | 'reading' | 'completed' | 'on-hold' | 'dropped'; // Reading Status
