# Project Setup & Running Guide

This project consists of two separate parts:
- **Backend** — Node.js + Express REST API (runs on port `3001`)
- **Frontend** — React + Vite app (runs on port `5173`)

Both must be running at the same time for the app to work correctly.

---

## Prerequisites

Make sure you have the following installed:
- **Node.js** (v18 or later recommended) — install via your package manager:
  ```bash
  # Ubuntu / Debian
  sudo apt update && sudo apt install nodejs npm

  # Fedora / RHEL
  sudo dnf install nodejs

  # Arch Linux
  sudo pacman -S nodejs npm
  ```
  Or use [nvm](https://github.com/nvm-sh/nvm) (recommended):
  ```bash
  nvm install 18
  nvm use 18
  ```
- **npm** (comes bundled with Node.js)

---

## Running the Backend

1. Open a terminal and navigate to the `backend` folder:
   ```bash
   cd backend
   ```

2. Install dependencies (only needed the first time):
   ```bash
   npm install
   ```

3. Start the backend server:

   - **Development mode** (auto-restarts on file changes):
     ```bash
     npm run dev
     ```
   - **Production mode**:
     ```bash
     npm start
     ```

4. The backend will be running at:
   ```
   http://localhost:3001
   ```

---

## Running the Frontend

1. Open a **new** terminal and navigate to the `frontend` folder:
   ```bash
   cd frontend
   ```

2. Install dependencies (only needed the first time):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and go to:
   ```
   http://localhost:5173
   ```

---

## Available API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/statuses` | Get all statuses |
| POST | `/api/statuses` | Create a new status |
| DELETE | `/api/statuses/:id` | Delete a status |
| GET | `/api/transitions` | Get all transitions |
| POST | `/api/transitions` | Create a new transition |
| DELETE | `/api/transitions/:id` | Delete a transition |
| DELETE | `/api/reset` | Reset all data |

---

## Notes

- Make sure the **backend is running before using the frontend**, otherwise API calls will fail.
- Both servers must run in **separate terminal windows** simultaneously.
- Data is persisted in `backend/data/state.json`.
