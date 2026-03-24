import { useState } from 'react';

function TransitionList({ statuses, transitions, onAdd, onDelete }) {
  const [name, setName] = useState('');
  const [fromId, setFromId] = useState('');
  const [toId, setToId] = useState('');
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    onAdd(name, fromId, toId)
      .then(() => {
        setName('');
        setFromId('');
        setToId('');
      })
      .catch((err) => {
        setError(err.message);
      });
  }

  function handleDelete(id) {
    setError('');
    onDelete(id).catch((err) => {
      setError(err.message);
    });
  }

  // Helper: find status name by id
  function statusName(id) {
    const s = statuses.find((s) => s.id === id);
    return s ? s.name : id;
  }

  return (
    <div className="panel">
      <h2>Transitions</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Transition name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <select value={fromId} onChange={(e) => setFromId(e.target.value)}>
          <option value="">From status...</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <select value={toId} onChange={(e) => setToId(e.target.value)}>
          <option value="">To status...</option>
          {statuses.map((s) => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {transitions.length === 0 ? (
        <p>No transitions yet.</p>
      ) : (
        <ul>
          {transitions.map((t) => (
            <li key={t.id}>
              <strong>{t.name}</strong>: {statusName(t.fromId)} → {statusName(t.toId)}
              <button onClick={() => handleDelete(t.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default TransitionList;
