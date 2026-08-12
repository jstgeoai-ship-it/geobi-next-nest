'use client';

import { useQuery } from '@tanstack/react-query';

export interface AuthUser {
  id: number | string;
  name: string;
  email: string;
}

async function fetchMe(): Promise<AuthUser | null> {
  const res = await fetch('/api/auth/me');
  if (!res.ok) return null;
  const data = await res.json();
  return data.user ?? null;
}

export function useAuthUser() {
  return useQuery({ queryKey: ['auth', 'me'], queryFn: fetchMe });
}
