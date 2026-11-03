# MERN Notes App

A full-stack notes application with JWT authentication. Users can register, log in, and manage their own private notes.

**Live demo:** https://YOUR-APP.vercel.app
_(The API runs on a free plan that sleeps when idle, so the first request after a quiet period can take up to about a minute.)_

## Features

- User registration and login with JWT authentication
- Create, read, update, and delete notes
- Notes are private: every query is scoped to the logged-in user
- Passwords are hashed with bcrypt and never returned by the API
- Responsive UI built with Tailwind CSS, with show/hide password and confirm password on sign-up

## Tech Stack

- **Frontend:** React (Vite), React Router, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB Atlas (Mongoose)
- **Auth:** JSON Web Tokens, bcryptjs
- **Hosting:** Vercel (client), Render (API)

## Getting Started

### Prerequisites

- Node.js 20.19 or newer
- A MongoDB database (local or MongoDB Atlas)

### Setup

1.  Clone the repo and install dependencies:

    git clone https://github.com/pjperfect/mern-notes-app.git
    cd mern-notes-app
    cd server && npm install
    cd ../client && npm install

2.  Create `server/.env` (see `server/.env.example`):

    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=a_long_random_string
    CLIENT_URL=http://localhost:5173

3.  Optional: create `client/.env` if the API is not on `http://localhost:5000` (see `client/.env.example`):

    VITE_API_URL=http://localhost:5000

4.  Run the app (two terminals):

        cd server && npm run dev
        cd client && npm run dev

    Then open http://localhost:5173.

## API Endpoints

| Method | Route              | Description                      | Auth |
| ------ | ------------------ | -------------------------------- | ---- |
| POST   | /api/auth/register | Create an account, receive a JWT | No   |
| POST   | /api/auth/login    | Log in, receive a JWT            | No   |
| GET    | /api/notes         | List your notes                  | Yes  |
| POST   | /api/notes         | Create a note                    | Yes  |
| PUT    | /api/notes/:id     | Update one of your notes         | Yes  |
| DELETE | /api/notes/:id     | Delete one of your notes         | Yes  |

Protected routes expect the header `Authorization: Bearer <token>`. Requests for a note that belongs to someone else return `404 Note not found`.

## Environment Variables

| Where  | Name           | Purpose                                                                         |
| ------ | -------------- | ------------------------------------------------------------------------------- |
| server | `MONGO_URI`    | MongoDB connection string                                                       |
| server | `JWT_SECRET`   | Secret used to sign and verify tokens                                           |
| server | `CLIENT_URL`   | Website allowed to call the API (CORS). Several URLs can be separated by commas |
| server | `PORT`         | Port to listen on (set automatically by most hosts)                             |
| client | `VITE_API_URL` | Base URL of the API, without `/api` and without a trailing slash                |

## Project Structure

    mern-notes-app/
    ├── client/                 # React frontend (Vite)
    │   └── src/
    │       ├── api.js          # fetch wrapper that talks to the API
    │       ├── context/        # AuthContext: login state shared across the app
    │       ├── components/     # ProtectedRoute, NoteForm, NoteCard, AuthLayout, PasswordInput
    │       └── pages/          # Login, Register, Dashboard
    └── server/                 # Express API
        ├── config/             # MongoDB connection
        ├── controllers/        # Request logic (auth, notes)
        ├── middleware/         # JWT check that protects routes
        ├── models/             # Mongoose models (User, Note)
        └── routes/             # URL -> controller mapping

## Deployment

- **API (Render):** Web Service, root directory `server`, build command `npm install`, start command `npm start`. Set `MONGO_URI`, `JWT_SECRET` and `CLIENT_URL` in the environment settings.
- **Client (Vercel):** import the repo, root directory `client`, framework preset Vite. Set `VITE_API_URL` to the Render URL. `client/vercel.json` sends every path to `index.html` so page refreshes work with React Router.
- **Database:** MongoDB Atlas, with network access allowing the host's IP addresses.
