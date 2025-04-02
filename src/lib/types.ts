type Book = {
	id: string; // Unique ID
	title: string; // Book Title
	author: string; // Book Author
	publishingYear?: number; // Year of Publication
	publishingHouse?: string; // Publishing House (optional)
	edition?: string; // Edition (optional)
	genre?: string[]; // Genres (supports multiple)
	coverImage?: string; // Cover Image URL (optional)
	description?: string; // Description (optional)
	language?: string; // ISO 639-1 Code (optional)
	isbn?: string; // ISBN (optional)
	pages: number; // Total Pages
	progress: number; // Pages Read
	status: 'plan-to-read' | 'reading' | 'completed' | 'on-hold' | 'dropped'; // Reading Status
	rating?: number; // 1-5 stars (optional)
	notes?: string; // Personal Notes
	addedAt: Date;
	updatedAt: Date;
	startedAt?: Date; // Date started reading (optional)
	finishedAt?: Date; // Date finished (optional)
};
