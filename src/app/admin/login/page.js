'use client';
/* eslint-disable @next/next/no-img-element */
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Icon, Field } from '../ui';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return setError('Enter your email and password.');
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ email: form.email.trim(), password: form.password }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.status !== 'success') {
        setError(data.message || 'That email or password is incorrect. Try again.');
        setLoading(false);
        return;
      }

      localStorage.setItem('pkr_admin_token', data.access_token);
      localStorage.setItem('pkr_admin_user', JSON.stringify(data.user));
      router.push('/admin');
    } catch {
      setError("Couldn't reach the server. Check your connection and try again.");
      setLoading(false);
    }
  };

  return (
    <form className="a-card a-login" onSubmit={submit}>
      <div className="a-brand">
        <img src="/pkr-logo.webp" alt="PKR Estates" className="a-logo" />
        <span>Admin panel</span>
      </div>
      <h1>Welcome back</h1>
      <p className="a-sub">Log in to manage your website content.</p>

      {error && <div className="a-err" role="alert">{error}</div>}

      <Field label="Email">
        <div className="a-input-ic">
          <Icon name="mail" size={17} />
          <input type="email" placeholder="admin@pkr.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} autoComplete="email" />
        </div>
      </Field>
      <Field label="Password">
        <div className="a-input-ic">
          <Icon name="lock" size={17} />
          <input type="password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} autoComplete="current-password" />
        </div>
      </Field>

      <button className="a-btn" type="submit" disabled={loading}>
        {loading ? 'Logging in…' : 'Log in'}
      </button>
    </form>
  );
}