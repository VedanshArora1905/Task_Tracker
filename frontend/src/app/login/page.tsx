'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { setToken } from '@/lib/authStorage';
import Link from 'next/link';

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name?: string;
    email: string;
  };
}

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      const res = await apiRequest<AuthResponse>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      setToken(res.token);
      router.push('/tasks');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800/70 bg-slate-900/80 p-8 shadow-[0_0_35px_rgba(56,189,248,0.35)] backdrop-blur-xl">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Welcome{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-emerald-300 bg-clip-text text-transparent">
            back
          </span>
        </h1>
        <p className="text-xs text-center text-slate-300 mb-6">
          Log in to see your neon‑coded tasks and pick up where you left off.
        </p>
        {error && (
          <p className="mb-4 text-xs text-red-300 bg-red-900/40 border border-red-500/60 rounded px-3 py-2">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-cyan-400/80 focus:border-cyan-400/80"
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80 focus:border-fuchsia-400/80"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-cyan-500 via-sky-400 to-emerald-400 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/30 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>
        <p className="mt-4 text-xs text-center text-slate-300">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-cyan-300 font-medium hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}


