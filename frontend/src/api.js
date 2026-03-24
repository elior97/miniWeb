const BASE_URL = 'http://localhost:3001';

export async function getStatuses() {
  const response = await fetch(`${BASE_URL}/api/statuses`);
  return response.json();
}

export async function addStatus(name, isInitial) {
  const response = await fetch(`${BASE_URL}/api/statuses`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, isInitial }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to add status.');
  }
  return data;
}

export async function deleteStatus(id) {
  const response = await fetch(`${BASE_URL}/api/statuses/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete status.');
  }
  return data;
}

export async function getTransitions() {
  const response = await fetch(`${BASE_URL}/api/transitions`);
  return response.json();
}

export async function addTransition(name, fromId, toId) {
  const response = await fetch(`${BASE_URL}/api/transitions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, fromId, toId }),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to add transition.');
  }
  return data;
}

export async function deleteTransition(id) {
  const response = await fetch(`${BASE_URL}/api/transitions/${id}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to delete transition.');
  }
  return data;
}

export async function resetAll() {
  const response = await fetch(`${BASE_URL}/api/reset`, { method: 'DELETE' });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Failed to reset.');
  }
  return data;
}
