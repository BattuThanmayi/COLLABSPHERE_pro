# CollabSphere Backend

This is the Node.js / Express backend for CollabSphere — a social collaboration platform connecting creators and developers.

Features
- JWT authentication (register/login)
- User profiles with skills and GitHub link
- Project management with join requests and contributors
- Messaging between users
- MongoDB via Mongoose

Quick start

1. Copy `.env.example` to `.env` and set `MONGO_URI` and `JWT_SECRET`.

2. Install dependencies:

```bash
cd backend
npm install
```

3. Run server (development):

```bash
npm run dev
```

APIs

- `POST /api/auth/register` — register
- `POST /api/auth/login` — login
- `GET /api/users/profile` — get profile (protected)
- `PUT /api/users/update` — update profile (protected)
- `POST /api/projects/create` — create project (protected)
- `GET /api/projects/all` — list projects
- `GET /api/projects/:id` — get project by id
- `DELETE /api/projects/delete/:id` — delete project (creator)
- `POST /api/projects/join/:id` — request to join project
- `GET /api/projects/:id/requests` — get join requests for a project (creator)
- `POST /api/projects/requests/:requestId/accept` — accept join request (creator)
- `POST /api/projects/requests/:requestId/reject` — reject join request (creator)
- `GET /api/projects/match/me` — returns projects matching current user's skills
- `POST /api/messages/send` — send a message to another user (protected)
- `GET /api/messages/chat/:userId` — get chat history with a user (protected)

Testing with Postman
1. Register a new user via `/api/auth/register` with `name`, `email`, `password`.
2. Login via `/api/auth/login` to receive a JWT token.
3. In Postman set header `Authorization: Bearer <token>` for protected routes.
4. Create projects, request to join, accept/reject, and test messaging.
