# Plan 004 – Statuses Feature

## Goal

Give the user a working Statuses panel: they can view all statuses, add a new
one (optionally marking it as the initial status), and delete any status.

The backend enforces two business rules: status names must be unique, and at
most one status may be the initial status.

The backend computes and returns a `labels` array for every status so the
frontend can display it without duplicating logic.

Both backend and frontend work are covered in this single plan.

---

## What Gets Changed

```
backend/src/routes/
└── statuses.js          ← fill in real logic (was a stub in plan 002)

frontend/src/
├── App.jsx              ← add addStatus / deleteStatus handlers; pass them down
├── api.js               ← add addStatus() and deleteStatus() helper functions
└── components/
    └── StatusList.jsx   ← replace placeholder with full CRUD UI
```

No other files are touched.

---

## Data Model

Each status stored in `state.json` has three fields:

```json
{
  "id": "1711234567890",
  "name": "Open",
  "isInitial": true
}
```

| Field | Type | Notes |
|---|---|---|
| `id` | string | Set to `Date.now().toString()` on creation. Simple and unique enough for a local tool. |
| `name` | string | Non-empty. Must be unique across all statuses (exact match). |
| `isInitial` | boolean | `true` for at most one status at a time. Defaults to `false`. |

The `transitions` array in `state.json` is left untouched by this plan.

---

## Derived Labels

The backend computes a `labels` array and includes it in every status it
returns. Labels are never stored — they are recalculated on every read.

| Label | Condition |
|---|---|
| `"initial"` | `status.isInitial === true` |
| `"final"` | No transition in the transitions array has `from` equal to this status's `id`. With no transitions yet, every status is final. |
| `"orphan"` | `status.isInitial === false` AND no transition has `to` equal to this status's `id`. With no transitions yet, every non-initial status is an orphan. |

A status can carry more than one label. For example, a non-initial status
with no incoming or outgoing transitions is both `"orphan"` and `"final"`.

Computing labels now (even though transitions are empty) means the logic will
continue to work correctly once plan 005 adds transitions — no changes needed.

---

## Business Rules

1. **Unique name** — if a POST arrives with a name that already exists
   (case-sensitive exact match), the backend returns `400` with a clear
   message. No silent deduplication.
2. **One initial** — if a POST has `isInitial: true` and there is already an
   initial status, the backend returns `400`. The user must delete or keep the
   existing initial status first.
3. **Name required** — if `name` is missing or is an empty/whitespace-only
   string, the backend returns `400`.
4. **Delete clears initial flag** — deleting the current initial status is
   allowed. No special handling is needed because the status object (including
   its `isInitial: true`) is simply removed from the array.
5. **Delete unknown id** — returns `404`.

---

## API Endpoints

### GET `/api/statuses`

Returns all statuses with computed labels.

**Response 200**
```json
[
  {
    "id": "1711234567890",
    "name": "Open",
    "isInitial": true,
    "labels": ["initial", "final"]
  },
  {
    "id": "1711234567999",
    "name": "Closed",
    "isInitial": false,
    "labels": ["orphan", "final"]
  }
]
```

An empty array `[]` is returned when there are no statuses.

---

### POST `/api/statuses`

Adds a new status.

**Request body**
```json
{ "name": "In Progress", "isInitial": false }
```

`isInitial` is optional and defaults to `false` when omitted.

**Response 201** — the newly created status object, including computed labels:
```json
{
  "id": "1711234568000",
  "name": "In Progress",
  "isInitial": false,
  "labels": ["orphan", "final"]
}
```

**Response 400** — on any rule violation:
```json
{ "error": "A status named \"In Progress\" already exists." }
```
```json
{ "error": "An initial status already exists." }
```
```json
{ "error": "Name is required." }
```

---

### DELETE `/api/statuses/:id`

Removes the status with the given id.

**Response 200** — the deleted status object (without labels; it no longer exists):
```json
{ "id": "1711234568000", "name": "In Progress", "isInitial": false }
```

**Response 404**
```json
{ "error": "Status not found." }
```

---

## Backend — `statuses.js` Implementation Notes

The file already exists from plan 002 as a stub. Replace its contents with
the following logic (no new files needed).

### Helper: `computeLabels(status, allStatuses, transitions)`

A small private function at the top of `statuses.js`.  
Takes one status object, the full statuses array, and the transitions array.  
Returns an array of label strings using the conditions from the Derived Labels
table above.

```
computeLabels(status, allStatuses, transitions)
  labels = []
  if status.isInitial → push "initial"
  if no transition has .from === status.id → push "final"
  if !status.isInitial AND no transition has .to === status.id → push "orphan"
  return labels
```

### GET handler

1. Call `readData()` to get `{ statuses, transitions }`.
2. Map over `statuses`, attaching a `labels` field to each via `computeLabels`.
3. Return the mapped array as JSON with status 200.

### POST handler

1. Destructure `name` and `isInitial` (default `false`) from `req.body`.
2. Validate: trim `name`; if empty → 400.
3. Call `readData()`.
4. Check uniqueness: if any existing status has the same `name` → 400.
5. If `isInitial` is `true`: check if any existing status already has
   `isInitial: true` → 400 if so.
6. Build new status object: `{ id: Date.now().toString(), name: name.trim(), isInitial }`.
7. Push it to `data.statuses`; call `writeData(data)`.
8. Return the new status with `computeLabels` attached, status 201.

### DELETE handler

1. Get `id` from `req.params.id`.
2. Call `readData()`.
3. Find the index of the status with matching `id`; if not found → 404.
4. Splice it out of `data.statuses`; call `writeData(data)`.
5. Return the removed status object (no labels needed), status 200.

---

## Frontend — `api.js` Changes

Add two new exported functions below the existing ones:

```
addStatus(name, isInitial)
  POST /api/statuses
  body: { name, isInitial }
  returns: parsed JSON (the new status object) or throws on non-2xx

deleteStatus(id)
  DELETE /api/statuses/:id
  returns: parsed JSON (the deleted status object) or throws on non-2xx
```

Both functions follow the same pattern as the existing `getStatuses()`:
use `fetch()`, check `response.ok`, parse JSON.  
For error responses (4xx), read the JSON body and throw an `Error` using the
`error` field so the UI can display it.

---

## Frontend — `App.jsx` Changes

`App.jsx` already holds `statuses` state and fetches on mount (plan 003).
Add the following in this plan:

### `addStatus(name, isInitial)`

```
async function addStatus(name, isInitial) {
  const newStatus = await api.addStatus(name, isInitial)
  setStatuses(prev => [...prev, newStatus])
}
```

If `api.addStatus` throws, catch the error and store the message in a new
`error` state string so it can be displayed near the form.

### `deleteStatus(id)`

```
async function deleteStatus(id) {
  await api.deleteStatus(id)
  setStatuses(prev => prev.filter(s => s.id !== id))
}
```

Pass `addStatus`, `deleteStatus`, and `error` down to `<StatusList>` as props.

---

## Frontend — `StatusList.jsx` Changes

Replace the placeholder content with a full CRUD panel.

### Props

| Prop | Type | Purpose |
|---|---|---|
| `statuses` | array | List of status objects (each has `id`, `name`, `isInitial`, `labels`) |
| `onAdd` | function | Called with `(name, isInitial)` when the form is submitted |
| `onDelete` | function | Called with `(id)` when a delete button is clicked |
| `error` | string or null | If set, display as an error message above the form |

### Status List

- Render a `<ul>` where each `<li>` contains:
  - The status `name`
  - The `labels` array displayed as small inline tags (e.g. `<span>` elements
    with a class like `label`) — one tag per label
  - A "Delete" `<button>` that calls `onDelete(status.id)`
- If the array is empty, show "No statuses yet." as before.

### Add Form

A small form below the list with:
- A text `<input>` for the name (controlled with local `useState`)
- A `<label>` + `<input type="checkbox">` for "Set as initial status"
  - Disabled (and unchecked) if any status in the `statuses` prop already has
    `isInitial: true`, so the user cannot accidentally attempt a second initial
- An "Add" `<button>` of `type="submit"`
- On submit: call `onAdd(name, isInitial)`, then clear the local input state
- If the `error` prop is set, show it in a `<p>` with a red color above the
  submit button; clear it when the user starts typing (reset `error` in
  `App.jsx` by calling a `clearError` prop, or simply clear it on the next
  successful add)

---

## UI Appearance

No design system is required. Plain HTML elements and a small number of inline
styles or simple CSS classes are fine.

Suggested label colors (optional — any visual distinction works):

| Label | Suggested color |
|---|---|
| `initial` | blue |
| `final` | green |
| `orphan` | orange |

---

## Out of Scope for This Plan

- Transitions feature (plan 005)
- Renaming a status
- Reordering statuses
- Changing which status is the initial (requires a dedicated "set as initial"
  action — the only way to set it in this plan is at creation time)
- Error handling beyond displaying the server's error message string
- Any styling beyond what is needed to make the UI usable
