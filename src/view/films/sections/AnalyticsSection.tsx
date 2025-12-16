"use client";
import React, { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend } from 'recharts';

type Film = {
  id: number;
  uid?: number;
  genre?: string[];
  title: string;
  s3_link?: string | null;
  duration?: number | null;
  language?: string;
  description?: string | null;
  subtitle_file?: string | null;
};

type GenreStat = { genre: string; percent: number };
type CategoryStat = { category: string; count: number };

export default function AnalyticsSection() {
  const [genreStats, setGenreStats] = useState<GenreStat[]>([]);
  const [categoryStats, setCategoryStats] = useState<CategoryStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchFilms() {
      setLoading(true);
      setError('');
      try {
        const accessToken = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        const url = '/api/films';
        const res = await fetch(url, {
          headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
        });
        if (!res.ok) {
          const text = await res.text();
          throw new Error(text || 'Failed to load films');
        }
        const data = await res.json();
        const films: Film[] = Array.isArray(data.films) ? data.films : [];

        // Calculate genre stats
        const genreCounts: Record<string, number> = {};
        let totalGenreEntries = 0;
        films.forEach(film => {
          (film.genre || []).forEach(g => {
            genreCounts[g] = (genreCounts[g] || 0) + 1;
            totalGenreEntries++;
          });
        });
        const genreStats = Object.entries(genreCounts).map(([genre, count]) => ({
          genre,
          percent: totalGenreEntries > 0 ? Math.round((count / totalGenreEntries) * 100) : 0,
        }));
        setGenreStats(genreStats);

        // Calculate category stats (using language as a stand-in for category, since no category field exists)
        const categoryCounts: Record<string, number> = {};
        films.forEach(film => {
          const category = film.language || 'Unknown';
          categoryCounts[category] = (categoryCounts[category] || 0) + 1;
        });
        const categoryStats = Object.entries(categoryCounts).map(([category, count]) => ({
          category,
          count,
        }));
        setCategoryStats(categoryStats);
      } catch (err: any) {
        setError(err.message || 'Error loading analytics');
      }
      setLoading(false);
    }
    fetchFilms();
  }, []);

  return (
    <section className="mt-6">
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
                <ResponsiveContainer width="100%" height={260}>
                  <PieChart>
                    <Pie
                      data={genreStats}
                      dataKey="percent"
                      nameKey="genre"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label={({ name, percent }) => `${name} ${(percent || 0).toFixed(0)}%`}
                    >
                      {genreStats.map((entry, idx) => (
                        <Cell key={`cell-${idx}`} fill={['#14532d', '#22c55e', '#bbf7d0', '#4ade80', '#a7f3d0', '#16a34a'][idx % 6]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value: any) => `${value}%`} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>

          {/* Bar chart tile */}
          <div className="rounded-2xl border border-[#EDEDED] bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-[#00441B]">Submissions by Language</h3>
            <div className="mt-4 min-h-[260px]">
              {categoryStats.length === 0 ? (
                <div className="text-xs text-gray-500">No category stats available.</div>
              ) : (
                <ResponsiveContainer width="100%" height={260}>
                  <BarChart data={categoryStats} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="category" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <RechartsTooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#14532d" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}