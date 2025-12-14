// Filmmaker Dashboard Page
'use client';

import React, { useEffect, useState } from 'react';

export default function FilmmakerDashboardPage() {
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError('');
      try {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/filmmaker/dashboard`, {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        if (!res.ok) throw new Error('Failed to load dashboard');
        const data = await res.json();
        setFestivals(data.festivals || []);
      } catch (err: any) {
        setError(err.message || 'Error loading dashboard');
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Filmmaker Dashboard</h1>
      {loading ? (
        <div>Loading…</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : festivals.length === 0 ? (
        <div>No festivals found.</div>
      ) : (
        <ul className="space-y-2">
          {festivals.map((festival: any) => (
            <li key={festival.id} className="border p-3 rounded">
              <div className="font-semibold">{festival.title}</div>
              <div className="text-xs text-gray-500">{festival.description}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
