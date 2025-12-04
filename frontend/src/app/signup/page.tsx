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

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState('');
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
      const res = await apiRequest<AuthResponse>('/api/auth/signup', {
        method: 'POST',
        body: { name, email, password },
      });
      setToken(res.token);
      router.push('/tasks');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-3xl border border-slate-800/70 bg-slate-900/80 p-8 shadow-[0_0_35px_rgba(168,85,247,0.35)] backdrop-blur-xl">
        <h1 className="text-2xl font-semibold mb-2 text-center">
          Create your{" "}
          <span className="bg-gradient-to-r from-cyan-400 via-fuchsia-400 to-orange-300 bg-clip-text text-transparent">
            workspace
          </span>
        </h1>
        <p className="text-xs text-center text-slate-300 mb-6">
          Sign up to start organising tasks with priorities, statuses, and a little bit of neon.
        </p>
        {error && (
          <p className="mb-4 text-xs text-red-300 bg-red-900/40 border border-red-500/60 rounded px-3 py-2">
            {error}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="name">
              Name (optional)
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/80 focus:border-fuchsia-400/80"
              placeholder="Your name"
            />
          </div>
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
              className="w-full rounded-xl border border-slate-700 bg-slate-900/60 px-3 py-2 text-sm text-slate-50 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-400/80 focus:border-orange-400/80"
              placeholder="••••••••"
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-full bg-gradient-to-r from-fuchsia-500 via-cyan-400 to-emerald-400 py-2.5 text-sm font-semibold text-slate-950 shadow-lg shadow-fuchsia-500/30 transition hover:brightness-110 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <p className="mt-4 text-xs text-center text-slate-300">
          Already have an account?{' '}
          <Link href="/login" className="text-cyan-300 font-medium hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}


