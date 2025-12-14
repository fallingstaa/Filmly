'use client';

import { useState } from 'react';
import * as passwordApi from '../../api/passwordApi';
import { useRouter, useSearchParams, useParams } from 'next/navigation';

import Brand from '../../components/Brand';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const params = useSearchParams();
  const routeParams = useParams<{ locale?: string }>();
  const locale = typeof routeParams?.locale === 'string' ? routeParams.locale : undefined;
  const [email, setEmail] = useState(params.get('email') ?? '');

  const [sent, setSent] = useState(false);
  const [err, setErr] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setErr('');
    setLoading(true);
    try {
      await passwordApi.requestPasswordReset(email);
      setSent(true);
    } catch (err: any) {
      setErr(err.message || 'Failed to send reset email');
    }
    setLoading(false);
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-[10px] border border-[#EDEDED] bg-white p-6 shadow-sm">
      <Brand />
      <h1 className="mt-4 text-center text-sm font-semibold text-[#00441B]">
        Forgot your password?
      </h1>
      {sent ? (
        <p className="mt-4 text-center text-green-700">Check your email for reset instructions.</p>
      ) : (
        <>
          <p className="mt-2 text-center text-xs text-[#4D4D4D]">
            Please enter your email address. We will send you a message with a code to reset your password.
          </p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-3">
            <div>
              <label className="block text-xs text-[#4D4D4D]">Email</label>
              <input
                type="email"
                className="mt-1 w-full rounded-md border border-[#EDEDED] px-3 py-2 text-xs"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
            {err && <p className="text-[11px] text-red-600">{err}</p>}
            <button
              type="submit"
              disabled={loading}
              className="mt-2 w-full rounded-md border border-[#00441B] bg-[#00441B] px-3 py-2 text-xs font-medium text-white hover:bg-[#0A5B28] disabled:opacity-50"
            >
              {loading ? 'Sending…' : 'Reset Password'}
            </button>
            <button
              type="button"
              onClick={() => router.push(locale ? `/${locale}/login` : '/login')}
              className="w-full rounded-md border border-[#EDEDED] bg-[#F5F5F5] px-3 py-2 text-xs text-[#4D4D4D] hover:bg-[#eaeaea]"
            >
              Back
            </button>
          </form>
        </>
      )}

      <p className="mt-6 text-center text-[10px] text-[#A0A0A0]">
        © {new Date().getFullYear()} Filmly. All rights reserved.
      </p>
    </div>
  );
}