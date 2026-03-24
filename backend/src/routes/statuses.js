const express = require('express');
const { readData, writeData } = require('../data');

const router = express.Router();

// Compute derived labels for a single status.
// labels are never stored — they are recalculated on every read.
function computeLabels(status, transitions) {
  const labels = [];

  if (status.isInitial) {
    labels.push('initial');
  }

  const hasOutgoing = transitions.some((t) => t.fromId === status.id);
  if (!hasOutgoing) {
    labels.push('final');
  }

  const hasIncoming = transitions.some((t) => t.toId === status.id);
  if (!status.isInitial && !hasIncoming) {
    labels.push('orphan');
  }

  return labels;
}

// GET /api/statuses — return all statuses with computed labels
router.get('/', (req, res) => {
  const data = readData();
  const result = data.statuses.map((status) => ({
    ...status,
    labels: computeLabels(status, data.transitions),
  }));
  res.json(result);
});

// POST /api/statuses — add a new status
// Expected body: { "name": "Open", "isInitial": false }
router.post('/', (req, res) => {
  const { name, isInitial = false } = req.body;

  // Rule: name is required
  if (!name || name.trim() === '') {
    return res.status(400).json({ error: 'Name is required.' });
  }

  const data = readData();

  // Rule: names must be unique (case-sensitive exact match)
  const duplicate = data.statuses.find((s) => s.name === name);
  if (duplicate) {
    return res.status(400).json({ error: `A status named "${name}" already exists.` });
  }

  // Rule: at most one initial status
  if (isInitial) {
    const existingInitial = data.statuses.find((s) => s.isInitial === true);
    if (existingInitial) {
      return res.status(400).json({ error: 'An initial status already exists.' });
    }
  }

  const newStatus = {
    id: Date.now().toString(),
    name: name.trim(),
    isInitial: Boolean(isInitial),
  };

  data.statuses.push(newStatus);
  writeData(data);

  res.status(201).json({
    ...newStatus,
    labels: computeLabels(newStatus, data.transitions),
  });
});

// DELETE /api/statuses/:id — remove a status by id
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  const data = readData();

  const index = data.statuses.findIndex((s) => s.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Status not found.' });
  }

  const removed = data.statuses.splice(index, 1)[0];

  // Cascade: remove all transitions that reference this status
  data.transitions = data.transitions.filter(
    (t) => t.fromId !== id && t.toId !== id
  );

  writeData(data);

  // Return deleted object without labels (it no longer exists)
  res.json(removed);
});

module.exports = router;
