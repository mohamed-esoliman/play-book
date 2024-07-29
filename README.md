# PlayBook

A full-stack gaming platform where users can browse, track, and interact with video games.

## Features

- **User Authentication**: Email/password, Google login, password reset
- **Game Browsing**: Search and browse games with modern pagination
- **Game Details**: Comprehensive information, media gallery, similar games
- **User Interactions**: Favorites, reviews, ratings, profile management
- **Responsive Design**: Mobile-friendly with smooth animations

## Tech Stack

- **Frontend**: Next.js, TypeScript, Tailwind CSS, Framer Motion
- **Backend**: Next.js API routes, Firebase Authentication, MongoDB
- **External APIs**: IGDB (Internet Game Database)

## Getting Started

### Environment Setup

The project includes an `.env.example` file with all required environment variables. Copy this file to `.env.local` and add your keys:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your actual credentials.

### Installation

1. Clone the repository
2. Install dependencies:
   ```
   npm install
   ```
3. Start the development server:
   ```
   npm run dev
   ```
4. Open http://localhost:3000 in your browser

## License

This project is licensed under the MIT License. See the [LICENSE](./LICENSE) file for details.