# Task Tracker

Task Tracker is a simple full‑stack web application for managing personal tasks with user authentication.  
It was built as part of the **Brew Full‑Stack Developer Internship – Task Tracker Assignment** (`file://Hiring Assignment - Internship.pdf`).

Users can sign up, log in, and manage their own tasks (create, edit, delete) with status, priority, due dates, and filters.

## Tech Stack

- **Frontend**: Next.js (React, App Router, TypeScript) + Tailwind CSS  
  - Chosen for fast development, built‑in routing, good DX, and easy deployment to Vercel.
- **Backend**: Node.js + Express  
  - Simple, familiar HTTP API, easy to structure auth and task routes.
- **Database**: MongoDB Atlas (Mongoose ORM)  
  - Flexible document model, quick cloud setup, good for JSON-like task data.
- **Auth & Security**:
  - `bcryptjs` for password hashing
  - `jsonwebtoken` for JWT‑based authentication
  - `dotenv` for environment variables
  - CORS configured for frontend domain

This stack stays within the JavaScript/TypeScript ecosystem as required, and is easy to deploy on free tiers.

## Features

- **Authentication**
  - User sign up and login with email + password
  - Passwords hashed with bcrypt
  - JWT-based auth, protecting all task routes
  - Each user can only access their own tasks

- **Task Management**
  - Create tasks with:
    - Title (required)
    - Description (optional)
    - Due date (optional)
    - Priority: low / medium / high
    - Status: To Do / In Progress / Done
  - Edit and delete existing tasks
  - List view with:
    - **Filter by status**
    - **Search by title or description**

- **UI / UX**
  - Responsive, dark neon layout using Tailwind CSS
  - Separate pages for:
    - `/signup` – create account
    - `/login` – login
    - `/tasks` – main dashboard
  - Funky, glassmorphism-style cards with colorful priority/status badges

- **Other**
  - MongoDB Atlas for data persistence
  - Ready for deployment (backend + frontend separated)

## Project Structure

```text
task-tracker/
  ├─ backend/                 # Express + MongoDB API
  │  ├─ config/
  │  │  └─ db.js              # MongoDB connection helper
  │  ├─ middleware/
  │  │  └─ auth.js            # JWT auth middleware
  │  ├─ models/
  │  │  ├─ User.js            # User schema
  │  │  └─ Task.js            # Task schema
  │  ├─ routes/
  │  │  ├─ auth.js            # /api/auth/signup, /api/auth/login
  │  │  └─ task.js            # /api/tasks CRUD with filters & search
  │  ├─ server.js             # Express app entry
  │  └─ package.json
  │
  └─ frontend/                # Next.js app (App Router, TS, Tailwind)
     ├─ src/
     │  ├─ app/
     │  │  ├─ page.tsx        # Landing page (links to login/signup)
     │  │  ├─ login/page.tsx  # Login page
     │  │  ├─ signup/page.tsx # Signup page
     │  │  └─ tasks/page.tsx  # Task dashboard
     │  └─ lib/
     │     ├─ api.ts          # API helper with base URL + auth header
     │     └─ authStorage.ts  # LocalStorage token helpers
     └─ package.json
```

## Setup Instructions

### Prerequisites

- Node.js (v18+)
- npm
- MongoDB Atlas account
- Git

### 1. Clone the repository

```bash
git clone https://github.com/<your-username>/<your-repo>.git
cd <your-repo>
```

### 2. Backend setup

```bash
cd backend
npm install
```

Create `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your-strong-secret
```

Run backend:

```bash
npm run dev
```

Backend runs on `http://localhost:5000`.

### 3. Frontend setup

```bash
cd ../frontend
npm install
```

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

Run frontend:

```bash
npm run dev
```

Frontend runs on `http://localhost:3000`.

### 4. Local usage flow

1. Open `http://localhost:3000`.
2. Click **Sign up**, create a user.
3. You are redirected to `/tasks`.
4. Create, edit, delete tasks; use filters and search.
5. Logout and then login again at `/login`.

## API Overview (Backend)

Base URL (local): `http://localhost:5000`

### Auth

- **POST `/api/auth/signup`**
  - Body: `{ "name": string, "email": string, "password": string }`
  - Response: `{ token, user }`

- **POST `/api/auth/login`**
  - Body: `{ "email": string, "password": string }`
  - Response: `{ token, user }`

### Tasks (JWT required)

All requests must include header:

```http
Authorization: Bearer <token>
```

- **GET `/api/tasks?status=<status>&search=<text>`**
  - Returns tasks for the authenticated user.
  - Optional query:
    - `status` in `todo | in_progress | done`
    - `search` matches title or description (case‑insensitive).

- **POST `/api/tasks`**
  - Body:
    ```json
    {
      "title": "string",
      "description": "string (optional)",
      "dueDate": "ISO date string (optional)",
      "priority": "low | medium | high",
      "status": "todo | in_progress | done"
    }
    ```

- **PUT `/api/tasks/:id`**
  - Body: same fields as POST (all optional; only provided fields are updated).

- **DELETE `/api/tasks/:id`**
  - Deletes a task owned by the current user.

## Deployment

### Backend

- **Platform**: (e.g.) Render / Railway / Heroku
- **Environment variables** configured on the platform:
  - `PORT` (e.g. 5000 or the platform default)
  - `MONGO_URI` (MongoDB Atlas connection string)
  - `JWT_SECRET`

Example production base URL: `https://task-tracker-j407.onrender.com`

Make sure CORS in `backend/server.js` allows your frontend origin, e.g.:

```js
app.use(cors({
  origin: 'https://task-tracker-virid-six.vercel.app',
  credentials: true,
}));
```

### Frontend

- **Platform**: Vercel (recommended for Next.js)
- Set environment variable in Vercel project:
  - `NEXT_PUBLIC_API_BASE_URL=https://task-tracker-j407.onrender.com`

After deployment, the live app is accessible at:

- **Frontend URL**: `https://task-tracker-virid-six.vercel.app`
- **Backend URL**: `https://task-tracker-j407.onrender.com`

## Assumptions & Limitations

- The app is designed for **single-device, browser-based** usage (no mobile native client).
- Authentication uses simple JWT stored in `localStorage`; for a production app, httpOnly cookies and refresh tokens would be preferred.
- There is no role-based access control; all authenticated users have the same capabilities on their own tasks.
- Basic validation is performed on required fields (e.g. email, password, title) but advanced validation (e.g. password strength) is minimal for this assignment.

## AI Usage

I used AI assistance (e.g., ChatGPT/Cursor) for:

- Generating boilerplate setup (Express server structure, model outlines, Next.js page skeletons).
- Getting ideas for API design and React component structure.
- Debugging errors (e.g., configuration and middleware ordering issues).

All code and architecture were reviewed, understood, and adapted by me.  
The README and the explainer video script/structure were written in my own words following the assignment guidelines.