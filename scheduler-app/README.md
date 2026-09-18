# Smart Scheduler — Restructured

Same app, same features — rebuilt from a single 1900-line `App.jsx` into a
proper multi-file architecture with real routing.

## Run it
```
npm install
npm start
```
Runs on http://localhost:3000, same as before.

## What changed
- **Real routes** instead of a `view` state string. `/dashboard`, `/schedule`,
  `/staff`, `/smart-match`, `/requests`, `/budget`, `/analytics`,
  `/audit-log`, `/find-events`, `/checkin`, `/profile` are now actual URLs —
  refreshing the page keeps you where you were, and the back button works.
- **Role-based route guards** (`routes/RouteGuards.jsx`) — Admin-only pages
  redirect a Manager or Staff account straight back to `/dashboard` if they
  try the URL directly, instead of just hiding the sidebar link.
- **Service layer** (`services/`) — all `localStorage` reads/writes and all
  auth logic (hashing, lockout, sign-up) live here, completely separate from
  React state. This is the seam you'll cut along when a real backend
  (Spring Boot + MySQL, matching your UDHR project) replaces `localStorage` —
  swap what's inside `authService.js` / `scheduleService.js` for `fetch`
  calls, and nothing above them (contexts, pages, components) has to change.
- **Two contexts** instead of one big provider: `AuthContext` (who's logged
  in) and `ScheduleContext` (events/staff/requests/toasts/audit log).
  `ScheduleContext` only mounts *after* login (see `AppRoutes.jsx`) — this
  matters, because mounting it earlier would let it cache stale data from
  before a sign-up/login writes to `localStorage`.
- **Reusable `ScheduleCard` and `StaffCard`** — the same card now renders in
  three places (full CRUD on Schedule/Staff pages, read-only on Dashboard/
  Manager views) instead of three copies of near-identical JSX.
- **Pages beyond your original six** — Events/Calendar merged into one
  `Schedule.jsx` (tabs), and `StaffPage.jsx`, `SmartMatch.jsx`, `Requests.jsx`,
  `Budget.jsx`, `Analytics.jsx`, `AuditLog.jsx`, `FindEvents.jsx`, `CheckIn.jsx`
  were added since the app has more sections than the six you sketched.
  `Profile.jsx` is genuinely new — it didn't exist before.

## What's identical
Every bit of business logic (the Smart Match scoring algorithm, password
hashing/strength rules, the staff-roster collision fix, request handling,
toast/audit behavior) was moved as-is, not rewritten. Behavior should match
the old single-file version exactly.

## Folder map
```
src/
├── components/       reusable UI (cards, badges, modals, sidebar, navbar…)
│   └── modals/
├── pages/            one file per route
├── layouts/          DashboardLayout.jsx — sidebar + navbar + <Outlet/>
├── context/          AuthContext, ScheduleContext
├── services/         authService.js, scheduleService.js — the data layer
├── routes/           AppRoutes.jsx, RouteGuards.jsx
├── utils/            constants.js, navigation.js, helpers.js
├── App.js
└── index.js
```

## Still on localStorage
Nothing about persistence changed yet — this is a *structural* refactor.
Data still lives in the browser's localStorage. When you're ready to point
this at a real backend, `services/scheduleService.js` and
`services/authService.js` are the only files that need to change.
