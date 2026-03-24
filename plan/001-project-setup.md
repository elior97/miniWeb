# Plan 001 – Project Setup

## Goal

Decide on the final stack, folder structure, and tooling so that all future
implementation steps have a clear, agreed-upon foundation.  
No code is written in this step.

---

## Proposed Stack

| Layer | Choice | Why |
|---|---|---|
| Frontend | React + JavaScript (Vite, already scaffolded) | Already in place; JS is friendlier for beginners than TS |
| Backend | Node.js + Express | Minimal boilerplate, runs on Linux, beginner-friendly |
| Storage | Single JSON file on disk (`data/state.json`) | No database to install or configure; easy to reset |
| API style | REST (JSON over HTTP) | Straightforward to build and test |
| Package manager | npm | Already used by the frontend |

> **Decision:** JavaScript on both frontend and backend. TypeScript is listed
> as a bonus and adds setup overhead that could eat into the 4-hour budget.

---

## Folder Structure (proposed)

```
exercise/
├── frontend/          ← existing Vite + React app (keep as-is for now)
├── backend/
│   ├── src/
│   │   ├── index.js   ← Express entry point
│   │   ├── routes/
│   │   │   ├── statuses.js
│   │   │   └── transitions.js
│   │   └── data.js    ← read/write helpers for the JSON file
│   ├── data/
│   │   └── state.json ← persisted state
│   └── package.json
└── plan/
```

---

## High-Level Step Sequence

1. **001 – Project setup** (this file) — agree on stack & structure
2. **002 – Backend skeleton** — Express server, REST endpoints, JSON persistence
3. **003 – Frontend shell** — React layout, routing (if needed), global state
4. **004 – Statuses feature** — list, add, delete, labels (initial/orphan/final)
5. **005 – Transitions feature** — list, add, delete, cascade-delete on status removal
6. **006 – Save & Reset** — big red reset button, save-to-server action
7. **007 – Setup instructions & Docker (bonus)**

---

## Questions for User

1. **Port numbers?**
   - Option 1: backend **3001**, frontend **5173** (Vite default) — no extra config needed
   - Option 2: any other ports if 3001 or 5173 are already in use on your machine

   **Recommendation: Option 1** — standard ports, zero friction.

---

## Out of Scope for This Step

- No code changes
- No package installations
- No Docker configuration

---

## Definition of Done

- Stack and language choices are confirmed (JavaScript, Node/Express, JSON file storage)
- Folder structure is agreed upon
- Port numbers are confirmed
- No code has been written or modified
- User has explicitly approved this plan

---

## HISTORY

> Copilot: Do not use this section as implementation instructions.
> This section is for historical prompt documentation only.

<!--
2026-03-24 — User requested plan/001-project-setup.md only.
  Requirements: simplest stack for a 4-hour window, beginner-friendly,
  minimum questions, one recommended option per question.

2026-03-24 — User approved JavaScript for both sides and requested:
  1. Keep JavaScript confirmed (remove the JS vs TS question).
  2. Add a Definition of Done section.
  3. Add this HISTORY section in the required copilot-instructions format.
  4. Keep everything else the same.

2026-03-24 — User wrote "plan 1 approved".
  All decisions locked in: JavaScript (frontend + backend), Node/Express,
  JSON file storage, backend port 3001, frontend port 5173.
  No code was written. Ready to proceed to plan 002.
-->
