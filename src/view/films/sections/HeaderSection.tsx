'use client';


import React, { useEffect, useState } from 'react';

type Film = {
  id: string;
  title: string;
  genre?: string[];
  language?: string;
  description?: string;
  duration?: number;
};

export default function HeaderSection() {
  const [films, setFilms] = useState<Film[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  type UserProfile = {
    full_name?: string;
    email?: string;
    // Add other fields if needed
  };
        const res = await fetch('/api/films', {
  // Accept user_profile as a prop for consistency with profile view
  export default function HeaderSection({ user_profile }: { user_profile: UserProfile }) {
        });
        if (!res.ok) throw new Error('Failed to fetch films');
        const data = await res.json();
        setFilms(Array.isArray(data.films) ? data.films : []);
      } catch (e: any) {
        setError(e.message || 'Error fetching films');
      }
      setLoading(false);
    }
    fetchFilms();
  }, []);

  return (
    <div className="mb-6">
      <h1 className="text-2xl font-bold text-[#0C0C0C] mb-1">My Films</h1>
      <div className="mb-2 text-lg font-semibold text-[#00441B]">
        Welcome back,<br />
        <span className="text-sm font-normal text-gray-600">This is your filmmaker dashboard.</span>
      </div>
      <p className="text-sm text-gray-500 mb-4">Manage your submitted films and add new ones.</p>
      {loading ? (
        <div className="text-sm text-gray-400">Loading…</div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : films.length === 0 ? (
        <div className="text-sm text-gray-400">No films found.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {films.map((film) => (
            <div key={film.id} className="rounded-xl border border-[#EDEDED] bg-white shadow-sm p-4">
              <div className="font-semibold text-[#00441B] text-lg mb-1">{film.title}</div>
              <div className="text-xs text-[#6F6F6F] mb-1">
                {film.genre && film.genre.length > 0 ? film.genre.join(', ') : 'No genre'}
              </div>
              <div className="text-xs text-[#6F6F6F] mb-1">{film.language || 'No language'}</div>
              <div className="text-xs text-[#6F6F6F] mb-1">{film.duration ? `${film.duration} min` : ''}</div>
              <div className="text-xs text-[#4D4D4D] mb-2">{film.description || ''}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

