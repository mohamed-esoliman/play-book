
# PlayBook

PlayBook is a full-stack web application designed for gamers to browse and interact with various games. The app provides detailed game information, user authentication, and the ability to rate and comment on games.

## Tech Stack

![Next.js](https://img.shields.io/badge/-Next.js-000000?logo=next.js&logoColor=white)
![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js&logoColor=white)
![Flask](https://img.shields.io/badge/-Flask-000000?logo=flask&logoColor=white)
![Firebase](https://img.shields.io/badge/-Firebase-FFCA28?logo=firebase&logoColor=white)
![MongoDB](https://img.shields.io/badge/-MongoDB-47A248?logo=mongodb&logoColor=white)
![SCSS](https://img.shields.io/badge/-SCSS-CC6699?logo=sass&logoColor=white)

## Features

- **Game Data Fetching:** Uses IGDB API to fetch game details.
- **User Authentication:** Secured with Firebase Auth, supporting OAuth 2.0 and MFA.
- **Game Ratings and Comments:** Allows users to rate games and leave comments.
- **Responsive UI:** Designed with SCSS for responsive and visually appealing layouts.

## Installation

### Set up Firebase and IGDB API keys in a `.env` file.

### MongoDB Setup

1. Install MongoDB on your machine by following the official [MongoDB Installation Guide](https://docs.mongodb.com/manual/installation/).
2. Once installed, start the MongoDB service.

### Backend (Flask)

1. Clone the repository:
   ```bash
   git clone <repo-link>
   ```

2. Navigate to the `backend` folder:
   ```bash
    cd backend
    ```

3. Navigate to `flask_api` and set up the Flask service:
   ```bash
   cd flask_api
   pip install -r requirements.txt
   python app.py
   ```

### Frontend (Next.js)

1. Navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open `http://localhost:3000` in your browser to view the project.