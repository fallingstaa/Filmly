// src/api/passwordApi.ts
// Handles password reset API calls for Filmly backend

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_URL}/api/auth/forgetPassword`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send reset email');
  return data;
}

export async function resetPassword(email: string, code: string, newPassword: string) {
  const res = await fetch(`${API_URL}/api/auth/resetPassword`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to reset password');
  return data;
}
