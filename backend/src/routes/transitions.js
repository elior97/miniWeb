const express = require('express');
const { readData, writeData } = require('../data');

const router = express.Router();

// GET /api/transitions — return all transitions
router.get('/', (req, res) => {
  const data = readData();
  res.json(data.transitions);
});

// POST /api/transitions — add a new transition
// Expected body: { "name": "...", "fromId": "...", "toId": "..." }
router.post('/', (req, res) => {
  const { name, fromId, toId } = req.body;

  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required.' });
  }

  if (!fromId || !toId) {
    return res.status(400).json({ error: 'fromId and toId are required.' });
  }

  const data = readData();

  // Name must be unique
  const duplicate = data.transitions.find((t) => t.name === name.trim());
  if (duplicate) {
    return res.status(400).json({ error: `A transition named "${name.trim()}" already exists.` });
  }

  // fromId and toId must reference existing statuses
  const fromStatus = data.statuses.find((s) => s.id === fromId);
  if (!fromStatus) {
    return res.status(400).json({ error: 'From status not found.' });
  }

  const toStatus = data.statuses.find((s) => s.id === toId);
  if (!toStatus) {
    return res.status(400).json({ error: 'To status not found.' });
  }

  const newTransition = {
    id: Date.now().toString(),
    name: name.trim(),
    fromId,
    toId,
  };

  data.transitions.push(newTransition);
  writeData(data);

  res.status(201).json(newTransition);
});

// DELETE /api/transitions/:id — remove a transition by id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();

  const index = data.transitions.findIndex((t) => t.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Transition not found' });
  }

  const removed = data.transitions.splice(index, 1)[0];
  writeData(data);

  res.json(removed);
});

module.exports = router;
