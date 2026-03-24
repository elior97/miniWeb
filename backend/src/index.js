const express = require('express');
const cors = require('cors');

const statusesRouter = require('./routes/statuses');
const transitionsRouter = require('./routes/transitions');

const app = express();
const PORT = 3001;

// Parse incoming JSON request bodies automatically
app.use(express.json());

// Allow the frontend (running on port 5173) to call this backend
app.use(cors());

// Mount the route files
app.use('/api/statuses', statusesRouter);
app.use('/api/transitions', transitionsRouter);

// DELETE /api/reset — clear all statuses and transitions
app.delete('/api/reset', (req, res) => {
  const { writeData } = require('./data');
  writeData({ statuses: [], transitions: [] });
  res.json({ ok: true });
});

// Start listening
app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
