import React, { useEffect, useState } from 'react';

type GenreStat = { genre: string; percent: number };
type CategoryStat = { category: string; count: number };

export default function AnalyticsSection() {
  const [genreStats, setGenreStats] = useState<GenreStat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchDashboard() {
      setLoading(true);
      setError('');
      try {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const url = `${process.env.NEXT_PUBLIC_API_URL}/api/filmmaker/dashboard`;
        console.log('[AnalyticsSection] Fetching:', url);
        const res = await fetch(url, {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        console.log('[AnalyticsSection] Response status:', res.status);
        if (!res.ok) {
          const text = await res.text();
          console.error('[AnalyticsSection] Error response:', text);
          throw new Error('Failed to load analytics');
        }
        const data = await res.json();
        console.log('[AnalyticsSection] Data:', data);
        setGenreStats(data.genreStats || []);
        setCategoryStats(data.categoryStats || []);
      } catch (err: any) {
        console.error('[AnalyticsSection] Exception:', err);
        setError(err.message || 'Error loading analytics');
      }
      setLoading(false);
    }
    fetchDashboard();
  }, []);

  return (
    <section className="mt-6">
      <h2 className="text-[15px] font-semibold text-[#00441B]">Quick Analytics</h2>
      {loading ? (
        <div className="mt-4">Loading…</div>
      ) : error ? (
        <div className="mt-4 text-red-600">{error}</div>
      ) : (
        <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2">
          {/* Pie chart tile */}
          <div className="rounded-2xl border border-[#EDEDED] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#00441B]">Genre Success Rate</h3>
            <div className="mt-4 min-h-[260px]">
              {genreStats.length === 0 ? (
                <div className="text-xs text-gray-500">No genre stats available.</div>
              ) : (
                <ul className="space-y-2">
                  {genreStats.map((g) => (
                    <li key={g.genre} className="flex justify-between text-sm">
                      <span>{g.genre}</span>
                      <span className="font-semibold">{g.percent}%</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>

          {/* Bar chart tile */}
          <div className="rounded-2xl border border-[#EDEDED] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#00441B]">Submissions by Category</h3>
            <div className="mt-4 min-h-[260px]">
              {categoryStats.length === 0 ? (
                <div className="text-xs text-gray-500">No category stats available.</div>
              ) : (
                <ul className="space-y-2">
                  {categoryStats.map((c) => (
                    <li key={c.category} className="flex justify-between text-sm">
                      <span>{c.category}</span>
                      <span className="font-semibold">{c.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}