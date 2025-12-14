"use client";
import React, { useEffect, useState } from 'react';
import OrganizerProfileView from '../../../src/view/organizer/profile/OrganizerProfileView';
import { getCurrentUser } from '../../../src/api/authApi';

export default function OrganizerProfilePage() {
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
          role: 'organizer',
          bio: res.user.bio || '',
          email: res.user.email,
          country: res.user.country || '',
          contact: res.user.contact || '',
          organization: res.user.organization || '',
          social: res.user.social || '',
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
  return <OrganizerProfileView user={user} />;
}
