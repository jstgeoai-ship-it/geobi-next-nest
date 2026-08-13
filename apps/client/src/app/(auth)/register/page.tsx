'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useQueryClient } from '@tanstack/react-query';

export default function RegisterPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Password confirmation does not match.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message ?? 'Registration failed');
        return;
      }
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      router.push('/katalog/dashboard-pbb');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label className="block text-sm font-medium text-[var(--pub-muted-3)]">Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          autoFocus
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[var(--pub-muted-3)]">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[var(--pub-muted-3)]">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      <div className="mt-4">
        <label className="block text-sm font-medium text-[var(--pub-muted-3)]">Confirm Password</label>
        <input
          type="password"
          value={passwordConfirmation}
          onChange={(e) => setPasswordConfirmation(e.target.value)}
          required
          minLength={8}
          className="w-full border p-2 rounded mt-1"
        />
      </div>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <div className="flex items-center justify-end mt-4">
        <Link href="/login" className="underline text-sm text-[var(--pub-muted-3)] hover:text-[var(--pub-text)]">
          Already registered?
        </Link>
        <button
          type="submit"
          disabled={loading}
          className="ms-4 bg-gray-800 text-[var(--pub-text)] px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Registering…' : 'Register'}
        </button>
      </div>
    </form>
  );
}
