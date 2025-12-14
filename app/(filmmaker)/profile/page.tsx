'use client';

import FilmmakerProfileView from '@/view/films/profile/FilmmakerProfileView';

import React, { useEffect, useState } from 'react';
import FilmmakerProfileView from '@/view/films/profile/FilmmakerProfileView';
import { getCurrentUser } from '@/api/authApi';

export default function FilmmakerProfilePage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        if (!accessToken) throw new Error('Not logged in');
        const res = await getCurrentUser(accessToken);
        setUser({
          name: res.user.name || res.user.username || res.user.email.split('@')[0],
          role: 'filmmaker',
          gmail: res.user.email,
          country: res.user.country || '',
          contact: res.user.contact || '',
          social: res.user.social || '',
          bio: res.user.bio || '',
          image: '/profile-default.png',
        });
      } catch (err: any) {
        setError(err.message || 'Failed to load user');
      }
      setLoading(false);
    };
    fetchUser();
    // Refetch user info every time the page is shown (e.g. after switching roles)
    window.addEventListener('focus', fetchUser);
    return () => window.removeEventListener('focus', fetchUser);
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-600">{error}</div>;
  if (!user) return <div>No user found.</div>;
  return <FilmmakerProfileView user={user} />;
}