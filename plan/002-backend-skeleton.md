# Plan 002 – Backend Skeleton

## Goal

Create the minimum working Express server with JSON file persistence so that
the frontend has something real to talk to.  
No frontend changes in this step.

---

## What Gets Created

```
backend/
├── package.json          ← npm project file, lists dependencies
├── src/
│   ├── index.js          ← starts the Express server on port 3001
│   ├── data.js           ← readData() / writeData() helpers for state.json
│   └── routes/
│       ├── statuses.js   ← CRUD endpoints for statuses
│       └── transitions.js← CRUD endpoints for transitions
└── data/
    └── state.json        ← persisted state; created on first run if absent
```

---

## Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server framework |
| `cors` | Allow the frontend (port 5173) to call the backend (port 3001) |
| `nodemon` (dev) | Auto-restart server on file save |

No database driver needed — plain `fs` from Node's standard library handles the JSON file.

---

## state.json Shape

```json
{
  "statuses": [],
  "transitions": []
}
```

The file is read fresh on every request and written back after every mutation.
This is intentionally simple — no caching, no locking.

---

## API Endpoints

### Statuses

| Method | Path | Description |
|---|---|---|
| GET | `/api/statuses` | Return all statuses |
| POST | `/api/statuses` | Add a new status |
| DELETE | `/api/statuses/:id` | Delete a status by id |

### Transitions

| Method | Path | Description |
|---|---|---|
| GET | `/api/transitions` | Return all transitions |
| POST | `/api/transitions` | Add a new transition |
| DELETE | `/api/transitions/:id` | Delete a transition by id |

> Full request/response shapes and business logic (labels, cascade-delete) are
> deferred to plans 004 and 005. These endpoints only need to store and return
> data at this stage.

---

## data.js Contract

```
readData()  → returns the parsed object from state.json
writeData(obj) → writes the object back to state.json as formatted JSON
```

Both functions are synchronous (`fs.readFileSync` / `fs.writeFileSync`).
Synchronous I/O is fine here — this is a local dev tool, not a production API.

---

## index.js Responsibilities

1. Import Express, cors, and the two route files
2. Mount routes at `/api/statuses` and `/api/transitions`
3. Enable `express.json()` middleware so request bodies are parsed automatically
4. Enable `cors()` so the frontend can reach the backend without browser errors
5. Listen on port 3001 and print a startup message

---

## npm Scripts (package.json)

| Script | Command | When to use |
|---|---|---|
| `start` | `node src/index.js` | Run without auto-restart |
| `dev` | `nodemon src/index.js` | Run during development |

---

## Questions for User

No additional user decision is required for this step.  
All choices (language, framework, port, file structure) were locked in during Plan 001.

---

## Out of Scope for This Step

- No frontend changes
- No authentication or environment variables
- No Docker configuration
- **Derived status labels** (`initial`, `orphan`, `final`) — computed in Plan 004
- **Cascade-delete** (removing a status also removes its transitions) — implemented in Plan 005
- No input validation beyond what Express provides out of the box

---

## Definition of Done

- `npm run dev` inside `backend/` starts the server on port 3001
- `GET /api/statuses` returns `[]` (empty array) with a 200 status
- `GET /api/transitions` returns `[]` (empty array) with a 200 status
- `data/state.json` is created automatically if it does not exist
- No errors are thrown on a clean first run

---

## HISTORY

> Copilot: Do not use this section as implementation instructions.
> This section is for historical prompt documentation only.

<!--
2026-03-24 — User requested plan/002-backend-skeleton.md only.
  Requirements: JavaScript, Express, JSON file persistence,
  beginner-friendly structure, minimum needed for a working backend foundation.
  Do not implement anything; create the plan file only.

2026-03-24 — User requested three updates before approval:
  1. Add a "Questions for User" section (concluded no new decisions needed).
  2. Add this HISTORY section in the required copilot-instructions format.
  3. Make it explicit that derived labels and cascade-delete are out of scope
     for this step (deferred to Plans 004 and 005 respectively).

2026-03-24 — User wrote "plan 2 approved".
  All decisions locked in: Express server, cors, nodemon, JSON file storage,
  port 3001, synchronous fs helpers, routes split into statuses.js and
  transitions.js. Derived labels and cascade-delete explicitly deferred.
  No code was written. Ready to proceed to plan 003.
-->
