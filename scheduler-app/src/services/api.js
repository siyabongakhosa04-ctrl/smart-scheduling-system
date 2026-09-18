const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('sched_token');

export const apiFetch = async (path, { method = 'GET', body, auth = true } = {}) => {
  const headers = { 'Content-Type': 'application/json' };
  if (auth) {
    const token = getToken();
    if (token) headers.Authorization = `Bearer ${token}`;
  }
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try { data = await res.json(); } catch { /* no body */ }

  if (!res.ok) {
    const error = new Error(data?.error || `Request failed (${res.status})`);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
};

export default apiFetch;
