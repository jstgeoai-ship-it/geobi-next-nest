'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthUser } from '@/lib/useAuthUser';

function BreezeNav() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: user } = useAuthUser();

  async function handleLogout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
    router.push('/login');
  }

  return (
    <nav className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center gap-10">
            <Link href="/katalog/dashboard-pbb" className="font-bold text-gray-800">GeoportalSmartTax</Link>
            <Link href="/katalog/dashboard-pbb" className="text-sm text-gray-500 hover:text-gray-700 border-b-2 border-transparent hover:border-gray-300 h-16 flex items-center">Dashboard</Link>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">{user?.name}</span>
            <button onClick={handleLogout} className="text-sm text-gray-500 hover:text-gray-700">Log Out</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return (
    <div className="p-4 sm:p-8 bg-white shadow sm:rounded-lg">
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
        <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
        <p className="mt-1 text-sm text-gray-600">Update your account&apos;s profile information and email address.</p>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} required autoFocus className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-4">
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">Save</button>
          {saved && <p className="text-sm text-gray-600">Saved.</p>}
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
        <h2 className="text-lg font-medium text-gray-900">Update Password</h2>
        <p className="mt-1 text-sm text-gray-600">Ensure your account is using a long, random password to stay secure.</p>
      </header>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        <div>
          <label htmlFor="current_password" className="block text-sm font-medium text-gray-700">Current Password</label>
          <input id="current_password" type="password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} autoComplete="current-password" className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="new_password" className="block text-sm font-medium text-gray-700">New Password</label>
          <input id="new_password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" minLength={8} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        <div>
          <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-700">Confirm Password</label>
          <input id="password_confirmation" type="password" value={passwordConfirmation} onChange={(e) => setPasswordConfirmation(e.target.value)} autoComplete="new-password" minLength={8} className="mt-1 block w-full border-gray-300 rounded-md shadow-sm" />
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <div className="flex items-center gap-4">
          <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-md text-sm">Save</button>
          {saved && <p className="text-sm text-gray-600">Saved.</p>}
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
        <h2 className="text-lg font-medium text-gray-900">Delete Account</h2>
        <p className="mt-1 text-sm text-gray-600">
          Once your account is deleted, all of its resources and data will be permanently deleted.
          Before deleting your account, please download any data or information that you wish to retain.
        </p>
      </header>

      {!confirming ? (
        <button onClick={() => setConfirming(true)} className="bg-red-600 text-white px-4 py-2 rounded-md text-sm">
          Delete Account
        </button>
      ) : (
        <form onSubmit={handleDelete} className="border border-red-200 rounded-md p-4 space-y-4">
          <p className="text-sm text-gray-600">
            Please enter your password to confirm you would like to permanently delete your account.
          </p>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="block w-3/4 border-gray-300 rounded-md shadow-sm"
          />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <div className="flex justify-end gap-3">
            <button type="button" onClick={() => { setConfirming(false); setPassword(''); setError(null); }} className="text-sm text-gray-600">
              Cancel
            </button>
            <button type="submit" className="bg-red-600 text-white px-4 py-2 rounded-md text-sm">
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
    <div className="min-h-screen bg-gray-100">
      <BreezeNav />
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h2 className="font-semibold text-xl text-gray-800 leading-tight">Profile</h2>
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
