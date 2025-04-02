# Reading Tracker

A web application for tracking your reading progress. Users can add, edit, and delete books, and keep track of their reading status and progress.

## Features

- 📚 **Add Books**: Users can add books to their list with details such as title, author, pages, and status.
- ✏️ **Edit Books**: Modify book details, including progress and status.
- ❌ **Delete Books**: Remove books from the list after confirmation.
- 📊 **Statistics**: Track total books, reading progress, and different reading statuses.
- 💾 **Local Storage**: Books are stored in the browser's local storage for persistent tracking.
- 🔔 **Modals & Toasts**: Confirmation modals for critical actions and toast notifications for feedback.

## Tech Stack

- **SvelteKit** - Frontend framework
- **TypeScript** - Typed JavaScript for better maintainability
- **Tailwind CSS** - Utility-first styling
- **FontAwesome** - Icons for UI elements
- **Local Storage** - Temporary storage for book data

## Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/yourusername/reading-tracker.git
   cd reading-tracker
   ```
2. Install dependencies:
   ```sh
   npm install
   ```
3. Run the development server:
   ```sh
   npm run dev
   ```
4. Open the app in your browser at `http://localhost:5173`

## Usage

- Click the **Add Book** button to add a new book.
- Click the **Edit** (✏️) button to modify book details.
- Click the **Delete** (🗑️) button to remove a book after confirmation.
- View stats in the **Books Stats** section.

## Future Improvements

- 🔐 User Authentication
- ☁️ Sync data with a backend (Supabase or another DB)
- 📱 Responsive enhancements

## Contributing

Feel free to fork this project and submit pull requests with improvements or fixes. 🚀

## License

MIT License
