# MERN Notes App

A full-stack notes application with JWT authentication. Users can register, log in and manage their own private notes.

**Live demo:** _Coming soon._

## Features

- User registration and login with JWT authentication
- Create, read, update and delete notes
- Notes are private: each user only sees their own
- Responsive UI built with Tailwind CSS

## Tech Stack

- **Frontend:** React and Tailwind CSS
- **Backend:** Node.js and Express
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens and bcryptjs

## Getting Started

### Prerequisites

- Node.js 18+
- A MongoDB database (local or MongoDB Atlas)

### Setup

1. Clone the repo and install dependencies:

    git clone https://github.com/pjperfect/mern-notes-app.git
    cd mern-notes-app
    cd server && npm install
    cd ../client && npm install

2. Create `server/.env` (see `server/.env.example`):

    cd server && npm run dev
    cd client && npm run dev

## API Endpoints

| Method | Route | Description | Auth |
|--------|-------|-------------|------|
| POST | /api/auth/register | Create an account | No |
| POST | /api/auth/login | Log in, receive a JWT | No |
| GET | /api/notes | List your notes | Yes |
| POST | /api/notes | Create a note | Yes |
| PUT | /api/notes/:id | Update a note | Yes |
| DELETE | /api/notes/:id | Delete a note | Yes |

## Project Structure

    mern-notes-app/
    ├── client/   # React frontend
    └── server/   # Express API

## What I Learned

_Coming soon._