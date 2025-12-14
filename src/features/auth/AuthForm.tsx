'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
// NOTE: Assuming this path is correct for your local setup
import { useAuthStore } from '../../shared/store/authStore';
import * as authApi from '../../api/authApi';

type Mode = 'login' | 'signup';
type Role = 'filmmaker' | 'organizer';

interface AuthFormProps {
  mode: Mode;
}

export default function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const signIn = useAuthStore((s) => s.signIn);

  const [role, setRole] = useState<Role>('filmmaker');
  const [name, setName] = useState('');
  const [org, setOrg] = useState('');
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [country, setCountry] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr('');
    if (!email || !pw) return setErr('Email and password are required.');
    setLoading(true);
    try {
      if (mode === 'signup') {
        // Call backend signup
        const data = await authApi.signup(email, pw, name || org || email.split('@')[0]);
        useAuthStore.getState().setUser(email, []);
        router.push('/choose-role');
      } else {
        // Login
        const data = await authApi.login(email, pw);
        useAuthStore.getState().setUser(email, data.profile?.roles || []);
        router.push('/choose-role');
      }
    } catch (err: any) {
      setErr(err.message || 'Authentication failed.');
    }
    setLoading(false);
  };

  return (
    <div className="mx-auto w-full max-w-md rounded-[10px] border border-[#EDEDED] bg-white p-6 shadow-sm">
      {/* Logo row (Assuming Icon.svg is available) */}
      <div className="flex items-center justify-center gap-2">
        <span
          className="h-6 w-6 bg-[#00441B]"
          style={{
            WebkitMaskImage: 'url(/Icon.svg)',
            maskImage: 'url(/Icon.svg)',
            WebkitMaskRepeat: 'no-repeat',
            maskRepeat: 'no-repeat',
            WebkitMaskSize: 'contain',
            maskSize: 'contain',
          }}
          aria-hidden
        />
        <span className="text-sm font-semibold text-[#00441B]">Filmly</span>
      </div>

      {/* Headings */}
      <h1 className="mt-4 text-center text-sm font-semibold text-[#00441B]">
        {mode === 'signup' ? 'Create Your Account' : 'Sign in to Filmly'}
      </h1>
      <p className="mt-2 text-center text-xs text-[#4D4D4D]">
        {mode === 'signup' ? 'Join the global filmmaker community' : 'Welcome back'}
      </p>

      <form onSubmit={onSubmit} className="mt-5 space-y-4">
        
        {/* Role selection removed for signup. */}

        {/* Filmmaker specific field: Full Name - INTEGRATED FROM YOUR SNIPPET */}
        {mode === 'signup' && role === 'filmmaker' && (
          <div>
            <label className="block text-xs text-[#4D4D4D]">Full name</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-[#EDEDED] px-3 py-2 text-xs focus:ring-[#00441B] focus:border-[#00441B]"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="Your full name"
              required
            />
          </div>
        )}

        {/* Organizer specific field: Organization - INTEGRATED FROM YOUR SNIPPET */}
        {mode === 'signup' && role === 'organizer' && (
          <div>
            <label className="block text-xs text-[#4D4D4D]">Organization</label>
            <input
              type="text"
              className="mt-1 w-full rounded-md border border-[#EDEDED] px-3 py-2 text-xs focus:ring-[#00441B] focus:border-[#00441B]"
              value={org}
              onChange={e => setOrg(e.target.value)}
              placeholder="Your organization"
              required
            />
          </div>
        )}

        {/* Country field (applies to both signup roles) */}
        {mode === 'signup' && (
          <div>
            <label className="block text-xs text-[#4D4D4D]">Country</label>
            <select
              className="mt-1 w-full rounded-md border border-[#EDEDED] px-3 py-2 text-xs bg-white focus:ring-[#00441B] focus:border-[#00441B]"
              value={country}
              onChange={e => setCountry(e.target.value)}
              required
            >
              <option value="">Select country</option>
              <option value="US">United States</option>
              <option value="GB">United Kingdom</option>
              <option value="CA">Canada</option>
              <option value="DE">Germany</option>
              <option value="FR">France</option>
              <option value="IN">India</option>
              <option value="JP">Japan</option>
              <option value="NG">Nigeria</option>
              <option value="BR">Brazil</option>
              <option value="ZA">South Africa</option>
              {/* ...add more as needed */}
            </select>
          </div>
        )}

        {/* Email */}
        <div>
          <label className="block text-xs text-[#4D4D4D]">Email</label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border border-[#EDEDED] px-3 py-2 text-xs focus:ring-[#00441B] focus:border-[#00441B]"
            value={email}
            onChange={e => setEmail(e.target.value)}
            placeholder="you@email.com"
            required
            autoComplete="email"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs text-[#4D4D4D]">Password</label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border border-[#EDEDED] px-3 py-2 text-xs focus:ring-[#00441B] focus:border-[#00441B]"
            value={pw}
            onChange={e => setPw(e.target.value)}
            placeholder="••••••••"
            required
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          />
        </div>

        {err && <p className="text-[11px] text-red-600">{err}</p>}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="mt-2 w-full rounded-md bg-[#00441B] px-3 py-2 text-xs font-medium text-white hover:bg-[#0A5B28] disabled:opacity-50 transition duration-150"
        >
          {loading ? (mode === 'login' ? 'Signing in…' : 'Creating…') : (mode === 'login' ? 'Sign In' : 'Get Started')}
        </button>

        {/* Footer Links (Login Mode) */}
        {mode === 'login' && (
          <div className="flex justify-between pt-1">
            <button
              type="button"
              onClick={() => router.push('/forgot-password')}
              className="text-[11px] text-[#00441B] hover:underline"
            >
              Forgot password?
            </button>
            <button
              type="button"
              onClick={() => router.push('/signup')}
              className="text-[11px] text-[#00441B] hover:underline"
            >
              Create account
            </button>
          </div>
        )}

        {/* Footer Links (Signup Mode) */}
        {mode === 'signup' && (
          <div className="pt-1 text-center">
            <button
              type="button"
              onClick={() => router.push('/login')}
              className="text-[11px] text-[#00441B] hover:underline"
            >
              Already have an account? Sign in
            </button>
          </div>
        )}
      </form>

      <p className="mt-6 text-center text-[10px] text-[#A0A0A0]">
        © {new Date().getFullYear()} Filmly. All rights reserved.
      </p>
    </div>
  );
}