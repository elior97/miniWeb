import { useState } from 'react';

function StatusList({ statuses, onAdd, onDelete }) {
  const [name, setName] = useState('');
  const [isInitial, setIsInitial] = useState(false);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    onAdd(name, isInitial)
      .then(() => {
        setName('');
        setIsInitial(false);
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

  return (
    <div className="panel">
      <h2>Statuses</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Status name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>
          <input
            type="checkbox"
            checked={isInitial}
            onChange={(e) => setIsInitial(e.target.checked)}
          />
          {' '}Initial
        </label>
        <button type="submit">Add</button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {statuses.length === 0 ? (
        <p>No statuses yet.</p>
      ) : (
        <ul>
          {statuses.map((status) => (
            <li key={status.id}>
              <strong>{status.name}</strong>
              {status.labels && status.labels.length > 0 && (
                <span> [{status.labels.join(', ')}]</span>
              )}
              <button onClick={() => handleDelete(status.id)}>Delete</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default StatusList;
