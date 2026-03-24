# Plan 003 – Frontend Shell

## Goal

Replace the Vite starter content with a minimal React shell that shows both
the Statuses panel and the Transitions panel on one screen, and has a thin
`api.js` helper ready to call the backend.  
No business rules, no full CRUD UI yet — just the skeleton that plans 004 and
005 will fill in.

---

## What Gets Changed

```
frontend/src/
├── App.jsx          ← replace starter content with two-panel layout
├── App.css          ← replace starter styles with minimal layout styles
├── api.js           ← NEW: thin fetch wrapper pointing at http://localhost:3001
├── components/
│   ├── StatusList.jsx      ← NEW: empty panel for statuses
│   └── TransitionList.jsx  ← NEW: empty panel for transitions
```

`main.jsx`, `index.css`, and all other existing files are left untouched.

---

## Screen Layout

```
┌─────────────────────────────────────────────────────┐
│  Workflow Editor                                    │
├──────────────────────────┬──────────────────────────┤
│  Statuses                │  Transitions             │
│  ─────────────────────   │  ─────────────────────   │
│  (list will go here)     │  (list will go here)     │
│                          │                          │
└──────────────────────────┴──────────────────────────┘
```

- A single-page layout; no router needed at this stage.
- Two equal-width columns side by side (`display: flex` on a wrapper div).
- Each column has a heading and a placeholder message.
- No sticky header, no sidebar, no modal — keep it flat.

---

## Component Responsibilities (this plan only)

### `App.jsx`
- Holds `statuses` and `transitions` as `useState` arrays (both start empty).
- Calls `api.getStatuses()` and `api.getTransitions()` inside a single
  `useEffect` on mount, then stores the results in state.
- Renders `<StatusList>` and `<TransitionList>` side by side, passing the
  arrays down as props.
- No add/delete handlers yet — those come in plans 004 and 005.

### `components/StatusList.jsx`
- Accepts a `statuses` prop (array).
- Renders a `<h2>Statuses</h2>` heading.
- If the array is empty, shows a short placeholder string (e.g. "No statuses yet.").
- If the array has items, renders them in a `<ul>` — each item shows only
  its `id` and `name` for now.
- No add/delete controls yet.

### `components/TransitionList.jsx`
- Same shape as `StatusList` but for the `transitions` prop.
- Placeholder: "No transitions yet."
- Each item shows `id`, `from`, and `to` for now.
- No add/delete controls yet.

### `api.js`
- Exports two async functions: `getStatuses()` and `getTransitions()`.
- Each does a plain `fetch()` call to the matching `/api/…` endpoint and
  returns the parsed JSON array.
- Base URL `http://localhost:3001` is defined as a single constant at the top
  of the file so it is easy to change later.
- No error handling beyond what the browser provides — full error handling is
  out of scope for this step.

---

## State Shape in App.jsx

```js
const [statuses,    setStatuses]    = useState([]);
const [transitions, setTransitions] = useState([]);
```

Both arrays are populated once on mount via `useEffect`.  
No derived state, no context, no global store — plain `useState` is enough.

---

## Styling Notes

- Remove all Vite starter CSS from `App.css`; add only what the two-column
  layout needs (~20 lines).
- `index.css` keeps any existing base resets (font, box-sizing, etc.) and is
  not modified.
- No CSS framework, no CSS modules — a single `App.css` is fine for this stage.

---

## Questions for User

No additional user decision is required for this step.  
All choices (JavaScript, React, Vite, port 5173 / 3001) were locked in during
Plan 001.

---

## Out of Scope for This Step

- No add / delete controls (plans 004 and 005)
- No derived status labels — `initial`, `orphan`, `final` (plan 004)
- No cascade-delete logic (plan 005)
- No Save / Reset buttons (plan 006)
- No routing (single-page layout is sufficient)
- No loading spinner or error message UI
- No authentication or environment variables
- No Docker configuration

---

## Definition of Done

- `npm run dev` inside `frontend/` starts without errors on port 5173
- The browser shows a heading and two side-by-side panels
- With the backend running, both panels load data from the API without errors
  (the arrays will be empty but no console errors should appear)
- With the backend stopped, no unhandled crash — browser may show a network
  error in the console, which is acceptable at this stage
- `main.jsx` and `index.css` are unchanged

---

## HISTORY

> Copilot: Do not use this section as implementation instructions.
> This section is for historical prompt documentation only.

<!--
2026-03-24 — User requested plan/003-frontend-shell.md only.
  Requirements: JavaScript, React only, beginner-friendly structure,
  simple screen layout for statuses and transitions, connect to backend
  with minimum needed foundation, no full business rules yet.
  Do not implement anything; create the plan file only.

2026-03-24 — User wrote "plan 3 approved".
  All decisions locked in: two-panel layout (flexbox), App.jsx with useState +
  useEffect on mount, api.js with BASE_URL constant, StatusList and
  TransitionList as prop-driven components, App.css rebuilt from scratch,
  main.jsx and index.css untouched. No add/delete controls, no derived labels,
  no routing. Ready to proceed to plan 004.
-->
