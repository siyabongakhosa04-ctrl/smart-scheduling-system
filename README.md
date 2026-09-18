# Smart Scheduler — Full Stack (React + Express + MySQL)

This replaces the old localStorage-only version with a real backend.
Both halves have been end-to-end tested against a real MySQL 8 instance
during development — not just syntax-checked.

## 1. Backend setup

```
cd backend
npm install
cp .env.example .env
```

Edit `.env` and fill in your real MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_actual_mysql_password
DB_NAME=smart_scheduler
JWT_SECRET=change-this-to-a-long-random-string
```

Create the database and tables:
```
mysql -u root -p < sql/schema.sql
```
### Demo Accounts

The application includes seeded demo accounts for testing.

> Demo credentials are intentionally not published in this repository.
> They can be provided separately for demonstrations.

Start the API:
```
npm run dev
```
Runs on `http://localhost:5000`. Visit it in a browser — you should see
`{"message":"Scheduling System Backend is running!"}`.

## 2. Frontend setup

```
cd scheduler-app
npm install
npm start
```
Runs on `http://localhost:3000` as before. It talks to the backend at
`http://localhost:5000/api` by default — if you ever deploy the backend
somewhere else, set `REACT_APP_API_URL` in a `.env` file in `scheduler-app/`.

## What actually changed

- **`services/authService.js`** and **`services/scheduleService.js`** (in the
  frontend) no longer touch `localStorage` for app data — every function now
  calls the real API. Every other file (pages, components, contexts) works
  exactly as before; that separation is *why* this swap didn't require
  touching the UI at all.
- **Passwords are now bcrypt-hashed server-side**, not SHA-256-in-the-browser.
  The client-side password strength meter still runs live as you type (good
  UX, no network round-trip per keystroke) — the backend independently
  re-validates and is the authoritative check.
- **Login lockout is enforced server-side** (in-memory, per email) instead of
  in the browser — a determined attacker can no longer just clear
  `localStorage` to reset their attempt count.
- **The staff-ID collision bug is now structurally impossible.** Every ID is
  a real MySQL `AUTO_INCREMENT` primary key. Two people registering at the
  same instant can never receive the same staff ID, because the database
  itself serializes the inserts — there's no separate "counter" for two
  different code paths to race against, which is what caused the original
  bug in the localStorage version.
- **Deletes now cascade correctly at the database level** — deleting an
  event automatically removes its requests and assignments (`ON DELETE
  CASCADE`), and rolls back the affected staff members' booked hours in the
  same transaction, so it can't partially fail.

## Verified during development

I actually installed MySQL 8 and ran this end-to-end rather than just
checking it compiles: registered a real account, logged in, hit
role-protected routes as the wrong role (correctly got a 403), created and
deleted an event (staff hours correctly rolled back, related requests
correctly cascaded away), and triggered the 5-attempt login lockout (correctly
locked for 30 seconds). Everything above is checked behavior, not assumed
behavior.

## Still to do (fair to flag)

- **CORS** is currently wide open to `http://localhost:3000` — fine for
  local dev, but if you deploy this, update `CLIENT_ORIGIN` in `.env`.
- **Rate limiting is in-memory** — restarting the backend clears any active
  lockouts. Fine for a demo/presentation; a production deployment would use
  Redis or a database table so lockouts survive a restart.
- **No password reset flow** — "Forgot password?" is still a visual-only
  link, same as before.
