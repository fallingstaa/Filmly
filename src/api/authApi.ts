// src/api/authApi.ts
// Handles authentication API calls for Filmly backend

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function signup(email: string, password: string, username: string) {
  const res = await fetch(`${API_URL}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, username }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Signup failed');
  // Save access_token for session
  if (data.session?.access_token) {
    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token || '');
  }
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  // Save access_token if present (for future use)
  if (data.session?.access_token) {
    localStorage.setItem('access_token', data.session.access_token);
    localStorage.setItem('refresh_token', data.session.refresh_token || '');
  }
  return data;
}

export async function logout(accessToken: string) {
  const res = await fetch(`${API_URL}/api/auth/logout`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  if (!res.ok) throw new Error('Logout failed');
  return true;
}

export async function getCurrentUser(accessToken: string) {
  const res = await fetch(`${API_URL}/api/auth/currentUser`, {
    method: 'GET',
    headers: { 'Authorization': `Bearer ${accessToken}` },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Get user failed');
  return data;
}

export async function updateProfile(accessToken: string, profile: any) {
  const res = await fetch(`${API_URL}/api/user-profile`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`,
    },
    body: JSON.stringify(profile),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update profile failed');
  return data;
}
