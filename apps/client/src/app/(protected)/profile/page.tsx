'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '@/lib/useAuthUser';
import { Navbar } from '@/components/Navbar';

const inputClass =
  'mt-1 block w-full rounded-md bg-slate-800 border border-white/10 text-white placeholder-slate-500 px-3 py-2 text-sm outline-none focus:border-cyan-400 transition-colors';
const labelClass = 'block text-sm font-medium text-slate-300';

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-8 bg-slate-900 border border-white/10 shadow-lg sm:rounded-xl">
      <div className="max-w-xl">{children}</div>
    </div>
  );
}

function ProfileInformationForm() {
  const { data: user } = useAuthUser();
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    const res = await fetch('/api/users/me', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? 'Failed to update profile');
      return;
    }
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-white">Profile Information</h2>
        <p className="mt-1 text-sm text-slate-400">Update your account&apos;s profile information and email address.</p>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="name" className={labelClass}>Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required autoFocus className={inputClass} />
        </div>
        <div>
          <label htmlFor="email" className={labelClass}>Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className={inputClass} />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex items-center gap-4">
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-4 py-2 rounded-md text-sm font-semibold">Save</button>
          {saved && <p className="text-sm text-slate-400">Saved.</p>}
        </div>
      </form>
    </section>
  );
}

function UpdatePasswordForm() {
  const [currentPassword, setCurrentPassword] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(false);
    if (password !== passwordConfirmation) {
      setError('Password confirmation does not match.');
      return;
    }
    const res = await fetch('/api/users/me/password', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ currentPassword, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? 'Failed to update password');
      return;
    }
    setCurrentPassword('');
    setPassword('');
    setPasswordConfirmation('');
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <section>
      <header>
        <h2 className="text-lg font-medium text-white">Update Password</h2>
        <p className="mt-1 text-sm text-slate-400">Ensure your account is using a long, random password to stay secure.</p>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="current_password" className={labelClass}>Current Password</label>
          <input id="current_password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" className={inputClass} />
        </div>
        <div>
          <label htmlFor="new_password" className={labelClass}>New Password</label>
          <input id="new_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} className={inputClass} />
        </div>
        <div>
          <label htmlFor="password_confirmation" className={labelClass}>Confirm Password</label>
          <input id="password_confirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} autoComplete="new-password" minLength={8} className={inputClass} />
        </div>
        {error && <p className="text-sm text-red-400">{error}</p>}
        <div className="flex items-center gap-4">
          <button type="submit" className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-4 py-2 rounded-md text-sm font-semibold">Save</button>
          {saved && <p className="text-sm text-slate-400">Saved.</p>}
        </div>
      </form>
    </section>
  );
}

function DeleteUserForm() {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  async function handleDelete(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const res = await fetch('/api/users/me', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(data.message ?? 'Failed to delete account');
      return;
    }
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  }

  return (
    <section className="space-y-6">
      <header>
        <h2 className="text-lg font-medium text-white">Delete Account</h2>
        <p className="mt-1 text-sm text-slate-400">
          Once your account is deleted, all of its resources and data will be permanently deleted.
          Before deleting your account, please download any data or information that you wish to retain.
        </p>
      </header>

      {!confirming ? (
        <button onClick={() => setConfirming(true)} className="bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-md text-sm font-semibold">
          Delete Account
        </button>
      ) : (
        <form onSubmit={handleDelete} className="border border-red-500/30 rounded-md p-4 space-y-4 bg-red-500/5">
          <p className="text-sm text-slate-400">
            Please enter your password to confirm you would like to permanently delete your account.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className={`${inputClass} w-3/4`}
          />
          {error && <p className="text-sm text-red-400">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setConfirming(false); setPassword(''); setError(null); }} className="text-sm text-slate-400 hover:text-white transition-colors">
              Cancel
            </button>
            <button type="submit" className="bg-red-600 hover:bg-red-700 transition-colors text-white px-4 py-2 rounded-md text-sm font-semibold">
              Delete Account
            </button>
          </div>
        </form>
      )}
    </section>
  );
}

export default function ProfilePage() {
  return (
    <div className="min-h-screen bg-black pt-16">
      <Navbar />
      <header className="bg-slate-900 border-b border-white/10">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="font-semibold text-xl text-cyan-400 leading-tight">Profile</h2>
        </div>
      </header>
      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <Card><ProfileInformationForm /></Card>
          <Card><UpdatePasswordForm /></Card>
          <Card><DeleteUserForm /></Card>
        </div>
      </div>
    </div>
  );
}
