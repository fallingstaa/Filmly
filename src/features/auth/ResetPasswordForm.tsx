'use client';

import { useRouter, useSearchParams, useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Brand from '../../components/Brand';

export default function ResetPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const routeParams = useParams<{ locale?: string }>();
  const locale = typeof routeParams?.locale === 'string' ? routeParams.locale : undefined;

  const [pw1, setPw1] = useState('');
  const [pw2, setPw2] = useState('');
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [accessToken, setAccessToken] = useState('');
  const [refreshToken, setRefreshToken] = useState('');

  // Read tokens from URL hash on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));
      const at = hashParams.get('access_token') || '';
      const rt = hashParams.get('refresh_token') || '';
      setAccessToken(at);
      setRefreshToken(rt);
    }
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      if (!accessToken) throw new Error('Invalid or missing reset link.');
      if (!pw1 || !pw2) throw new Error('All fields required.');
      if (pw1 !== pw2) throw new Error('Passwords do not match.');
      // POST to backend
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/resetPassword`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw1, access_token: accessToken, refresh_token: refreshToken }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to reset password');
      setSuccess(true);
      setTimeout(() => {
        const target = '/password-changed';
        router.push(locale ? `/${locale}${target}` : target);
      }, 1200);
    } catch (err: any) {
      setErr(err.message || 'Failed to reset password');
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[10px] border border-[#EDEDED] bg-white p-6 shadow-sm">
      <Brand />
      <h1 className="mt-4 text-center text-sm font-semibold text-[#00441B]">
        Enter New Password
      </h1>
      {success ? (
        <p className="mt-4 text-center text-green-700">Password reset! Redirecting…</p>
      ) : (
        <>
          {!accessToken ? (
            <p className="mt-4 text-center text-red-600">Invalid or missing reset link. Please use the link sent to your email.</p>
          ) : (
            <>
              <p className="mt-2 text-center text-xs text-[#4D4D4D]">
                Enter your new password below.
              </p>
              <form onSubmit={handleSubmit} className="mt-6 space-y-3">
                <div>
                  <label className="block text-xs text-[#4D4D4D]">New Password</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-md border border-[#EDEDED] px-3 py-2 text-xs"
                    value={pw1}
                    onChange={e => setPw1(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs text-[#4D4D4D]">Enter new password again</label>
                  <input
                    type="password"
                    className="mt-1 w-full rounded-md border border-[#EDEDED] px-3 py-2 text-xs"
                    value={pw2}
                    onChange={e => setPw2(e.target.value)}
                    required
                  />
                </div>
                {err && <p className="text-[11px] text-red-600">{err}</p>}
                <button
                  type="submit"
                  disabled={loading}
                  className="mt-2 w-full rounded-md bg-[#00441B] px-3 py-2 text-xs font-medium text-white hover:bg-[#0A5B28] disabled:opacity-50"
                >
                  {loading ? 'Updating…' : 'Reset Password'}
                </button>
                <button
                  type="button"
                  onClick={() => router.push(locale ? `/${locale}/forgot-password` : '/forgot-password')}
                  className="w-full rounded-md border border-[#EDEDED] bg-[#F5F5F5] px-3 py-2 text-xs text-[#4D4D4D] hover:bg-[#eaeaea]"
                >
                  Back
                </button>
              </form>
            </>
          )}
        </>
      )}
      <p className="mt-6 text-center text-[10px] text-[#A0A0A0]">
        © {new Date().getFullYear()} Filmly. All rights reserved.
      </p>
    </div>
  );
}