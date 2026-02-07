# Smart AI-Powered Interview Preparation App

A full-stack MERN application for AI-powered interview preparation using the Gemini API.

## Tech Stack

- **Frontend:** React (Vite), Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas
- **Auth:** JWT (email + password)
- **AI:** Google Gemini API

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas account (free tier)
- Google Gemini API key

## Setup

### 1. Environment Variables

Copy `server/.env.example` to `server/.env` and fill in the values:

```bash
cd server
copy .env.example .env
```

On Unix/Mac: `cp .env.example .env`

Edit `server/.env`:

- `MONGODB_URI` - MongoDB Atlas connection string from [cloud.mongodb.com](https://cloud.mongodb.com)
- `JWT_SECRET` - Any secure random string for JWT signing
- `GEMINI_API_KEY` - API key from [Google AI Studio](https://makersuite.google.com/app/apikey)

### 2. Install Dependencies

From project root:
```bash
npm run install:all
```

Or manually:
```bash
cd server
npm install
cd ../client
npm install
```

### 3. Run the Application

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```
Server runs on `http://localhost:5000`

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```
App runs on `http://localhost:5173`

### One-Line Setup (from project root)

```bash
cd server && npm install && cd ../client && npm install
```

Then run backend and frontend in separate terminals as above.

## Project Structure

```
├── client/          # React frontend
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
├── server/          # Express backend
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── server.js
├── .env.example
└── README.md
```

## Quick Run (Windows)

**Double-click `START_APP.bat`** or `DO_EVERYTHING.bat` (installs Node + deps if needed).

Or in VS Code terminal: `.\START_APP.bat`

See **HOW_TO_RUN_IN_VSCODE.md** for detailed steps.

## Features

- **Authentication:** Register, Login, JWT-based auth
- **Interview Sessions:** Create sessions with role and experience level
- **AI-Generated Q&A:** Gemini API generates interview questions and suggested answers
- **Accordion UI:** Expandable questions with answers
- **Pin/Unpin:** Mark important questions
- **Light/Dark Mode:** Theme toggle with persistence
- **Leaderboard:** Top users by sessions and questions practiced
- **Peer Discussions:** Create discussions, reply to others
- **Shareable Links:** Share sessions or questions via public links
- **Mock Interview:** Practice questions one by one

## Environment Variables

| Variable      | Description                    |
|---------------|--------------------------------|
| PORT          | Server port (default: 5000)    |
| MONGODB_URI   | MongoDB Atlas connection string|
| JWT_SECRET    | Secret for JWT signing         |
| GEMINI_API_KEY| Google Gemini API key          |

