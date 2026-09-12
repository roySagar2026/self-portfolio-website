import { apiUrl } from './config.js';

function authHeaders() {
  const token = localStorage.getItem('portfolio_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, options = {}) {
  const headers = {
    ...authHeaders(),
    ...(options.headers || {}),
  };

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(apiUrl(path), {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error || `Request failed (${res.status})`);
  }
  return data;
}

export const api = {
  getContent: () => request('/api/content'),
  saveContent: (content) =>
    request('/api/content', { method: 'PUT', body: JSON.stringify(content) }),
  login: (email, password) =>
    request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),
  me: () => request('/api/auth/me'),
  sendContact: (payload) =>
    request('/api/contact', { method: 'POST', body: JSON.stringify(payload) }),
  getMessages: () => request('/api/contact/messages'),
  markRead: (id) =>
    request(`/api/contact/messages/${id}/read`, { method: 'PATCH' }),
  deleteMessage: (id) =>
    request(`/api/contact/messages/${id}`, { method: 'DELETE' }),
  uploadResume: async (file) => {
    const form = new FormData();
    form.append('resume', file);
    return request('/api/resume/upload', {
      method: 'POST',
      body: form,
      headers: { ...authHeaders() },
    });
  },
  deleteResume: () => request('/api/resume', { method: 'DELETE' }),
  resumeDownloadUrl: () => apiUrl('/api/resume'),
};
