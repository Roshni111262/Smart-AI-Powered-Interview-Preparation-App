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

- `MONGO_URI` - MongoDB Atlas connection string from [cloud.mongodb.com](https://cloud.mongodb.com)
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

## Features (Production-Oriented SaaS Modules)

- **Authentication:** Register, Login, JWT-based auth
- **Interview Sessions:** Create sessions with role and experience level
- **AI-Generated Q&A:** Gemini API generates interview questions and suggested answers
- **Accordion UI:** Expandable questions with answers
- **Pin/Unpin:** Mark important questions
- **Light/Dark Mode:** Theme toggle with persistence
- **Dynamic AI Explanations:** Explain and save explanation per question
- **Notes:** Add/update/delete personal notes per question
- **Leaderboard:** Top users by sessions, questions, pinned count, mock score, contributions
- **Peer Discussions:** Create discussions and nested replies
- **Shareable Links:** Share by token and fetch shared question by question ID
- **Progress Tracking:** Sessions, topics, question reviews, pinned, notes, mock improvement
- **Mock Interview:** Start mock, submit responses, complete with score + summary
- **Role-Based Access:** `user` and `admin` roles with protected backend routes
- **Subscription & Payments:** Payment intent + confirmation flow (Stripe/Khalti/esewa-ready abstraction)
- **Premium Access Control:** Premium plan required for advanced modules (mock interview flow)
- **Ticket Module:** User ticket history (last 6 months) with payment status and accessed features
- **Admin Dashboard APIs:** User management, block/delete users, monitor payments/discussions/tickets
- **Movie/Theater Admin Data:** Theater city hall movie details and top occupancy performer analytics

## Environment Variables

| Variable      | Description                    |
|---------------|--------------------------------|
| PORT          | Server port (default: 5000)    |
| MONGO_URI     | MongoDB Atlas URI (optional if using local mode) |
| USE_LOCAL_MONGO | `true` = in-memory DB, no Atlas login (good for college demo) |
| JWT_SECRET    | Secret for JWT signing         |
| GEMINI_API_KEY| Google Gemini API key          |
| FRONTEND_URL  | Share URL base (default localhost:5173) |

## API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/sessions`
- `GET /api/sessions`
- `GET /api/sessions/:id`
- `GET /api/questions/:sessionId/:questionIndex`
- `PATCH /api/questions/pin`
- `POST /api/explanations`
- `POST /api/notes`
- `GET /api/notes?sessionId=<id>`
- `PUT /api/notes/:id`
- `DELETE /api/notes/:id`
- `POST /api/discussions`
- `GET /api/discussions`
- `POST /api/discussions/:id/reply`
- `GET /api/progress/me`
- `POST /api/mock/start`
- `POST /api/mock/response`
- `POST /api/mock/complete`
- `GET /api/mock/history`
- `POST /api/payments/intent`
- `POST /api/payments/confirm`
- `GET /api/payments/me`
- `GET /api/tickets/me`
- `GET /api/theaters/city-hall-movies`
- `GET /api/theaters/occupancy/top`
- `POST /api/theaters/movies` (admin)
- `POST /api/theaters/theaters` (admin)
- `GET /api/admin/overview`
- `GET /api/admin/users`
- `PATCH /api/admin/users/:userId/block`
- `DELETE /api/admin/users/:userId`
- `GET /api/admin/payments`
- `GET /api/admin/discussions`
- `GET /api/admin/tickets`
- `GET /api/leaderboard`
- `POST /api/share`
- `GET /api/share/:token`
- `GET /api/share/id/:sessionId/:questionIndex`

## Seed Demo Data (Viva Ready)

From root:

```bash
npm run seed
```

Demo login from seed:

- `demo@example.com`
- `Password@123`

Admin login from seed:

- `admin@example.com`
- `Password@123`

## Notes

- Without `GEMINI_API_KEY`, the app uses fallback questions.
- Default `server/.env` uses `USE_LOCAL_MONGO=true` so the app runs without Atlas login (data clears when server stops).
- For persistent Atlas: set real `MONGO_URI` and `USE_LOCAL_MONGO=false`.
- CORS is enabled for `localhost:5173`.
- Frontend proxies `/api` to backend in development.
