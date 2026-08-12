'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Something went wrong');
        return;
      }
      setStatus(data.message ?? 'We have emailed your password reset link.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-4 text-sm text-[var(--pub-muted-3)]">
        Forgot your password? No problem. Just let us know your email address and we will email
        you a password reset link that will allow you to choose a new one.
      </div>

      {status && <p className="mb-4 text-sm text-green-600">{status}</p>}

      <form onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium text-[var(--pub-muted-3)]">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus
            className="w-full border p-2 rounded mt-1"
          />
        </div>

        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

        <div className="flex items-center justify-end mt-4">
          <button
            type="submit"
            disabled={loading}
            className="bg-gray-800 text-[var(--pub-text)] px-4 py-2 rounded disabled:opacity-50"
          >
            {loading ? 'Sending…' : 'Email Password Reset Link'}
          </button>
        </div>
      </form>
    </div>
  );
}
