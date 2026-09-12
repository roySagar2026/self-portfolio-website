import { useState } from 'react';
import { api } from '../api';

export default function Login({ onSuccess }) {
  const [email, setEmail] = useState('admin@portfolio.local');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await api.login(email, password);
      localStorage.setItem('portfolio_token', data.token);
      onSuccess?.();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-wrap">
      <form className="login-card" onSubmit={onSubmit}>
        <h1>Admin Login</h1>
        <p>Sign in to update portfolio content and read contact messages. Session expires after 30 minutes.</p>

        <div className="admin-grid">
          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="From .env ADMIN_PASSWORD"
            />
          </div>
        </div>

        {error && (
          <div className="form-status form-status--err" style={{ marginTop: '1rem' }}>
            {error}
          </div>
        )}

        <div className="admin-actions">
          <button className="btn btn--solid" type="submit" disabled={loading}>
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
          <a className="btn btn--ghost" href="#/">
            Back to site
          </a>
        </div>
      </form>
    </div>
  );
}
