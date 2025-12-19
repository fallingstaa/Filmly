// src/api/userApi.ts
// Helper to fetch user profile by user ID (returns email)
const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Fetches the user profile by ID. 
 * Added TypeScript types to parameters to resolve Vercel build errors.
 */
export async function getUserProfileById(userId: string, accessToken?: string | null) {
  // Use provided token or try to get it from localStorage if in the browser
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);
  
  if (!token) {
    throw new Error('No access token available');
  }

  const res = await fetch(`${API_URL}/api/user-profile?id=${userId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  // Explicitly typing 'data' as 'any' so TypeScript doesn't complain about its properties
  const data: any = await res.json();

  if (!res.ok) {
    throw new Error(data.error || data.message || 'Failed to fetch user profile');
  }

  // Logic to handle different response shapes
  if (data && data.profile) {
    return data.profile;
  }

  if (Array.isArray(data) && data.length > 0) {
    return data[0];
  }

  return null;
}