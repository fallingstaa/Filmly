'use client';

import React, { useEffect, useState } from 'react';

type Film = { id: string; title: string; year?: string };

function getStoredFilms(): Film[] {
  if (typeof window === 'undefined') return [];
  try {
    const data = localStorage.getItem('mock_films');
    if (data) return JSON.parse(data);
  } catch {}
  return [];
}

export default function MatchingTableSection() {
  const [films, setFilms] = useState<Film[]>([]);
  const [aiLoadingId, setAiLoadingId] = useState<string | null>(null);

  useEffect(() => {
    setFilms(getStoredFilms());
  }, []);

  function handleAiMatch(id: string, title: string) {
    setAiLoadingId(id);
    /**
     * NOTE: This is a mock for AI matching.
     * When integrating with backend:
     * - Send filmId (and film data if needed) to backend AI matching endpoint.
     * - Show loading spinner while waiting for response.
     * - When done, display matching results or redirect as needed.
     * - For now, we just show a loading state for 2 seconds.
     */
    setTimeout(() => {
      setAiLoadingId(null);
      alert(`AI matching completed for "${title}". (Mock only, user stays on this page)`);
      // Optionally, you could redirect or show results here.
    }, 2000);
  }

  return (
    <section className="rounded-xl border border-[#EDEDED] bg-white shadow-sm w-full overflow-hidden">
      {/* header */}
      <div className="px-4 py-3 hidden md:grid grid-cols-6 text-sm font-semibold text-[#6F6F6F] bg-[#FBFBFB]">
        <div className="col-span-5">Film</div>
        <div className="col-span-1 text-right">Action</div>
      </div>

      {/* rows - removed divide-y to avoid dark separators on dark backgrounds */}
      <div
        style={{ maxHeight: '340px', overflowY: 'auto' }} // ~5 items at 68px each
        className="w-full"
      >
        <ul>
          {films.map((f) => (
            <li key={f.id} className="px-4 py-4 md:grid md:grid-cols-6 md:gap-4 flex flex-col md:flex-row items-start md:items-center">
              <div className="md:col-span-5 flex items-center gap-3 w-full">
                <div className="h-10 w-10 rounded-md bg-[#F3F3F3] flex items-center justify-center text-sm font-medium text-[#6F6F6F]">
                  {f.title.split(' ').slice(0,2).map(s => s[0]).join('')}
                </div>
                <div>
                  <div className="text-sm font-medium text-[#0C0C0C]">{f.title}</div>
                  <div className="text-xs text-[#6F6F6F] md:hidden">Year: {f.year}</div>
                </div>
              </div>

              <div className="md:col-span-1 mt-3 md:mt-0 flex items-center justify-end gap-3 w-full">
                <button
                  onClick={() => window.location.href = `/films/add?editId=${encodeURIComponent(f.id)}`}
                  className="rounded border border-[#2F623F] text-[#2F623F] px-3 py-1 text-sm"
                  aria-label={`Edit ${f.title}`}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleAiMatch(f.id, f.title)}
                  className="rounded bg-[#00441B] text-white px-3 py-1 text-sm"
                  aria-label={`AI matching for ${f.title}`}
                  disabled={aiLoadingId === f.id}
                >
                  {aiLoadingId === f.id ? 'Running AI...' : 'AI matching'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Optionally, show a loading overlay */}
      {aiLoadingId && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-8 w-8 text-[#00441B]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(0,68,27,0.15)" strokeWidth="4" />
              <path d="M22 12a10 10 0 00-10-10" stroke="#00441B" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="text-sm text-[#00441B]">AI matching in progress (mock)...</div>
          </div>
        </div>
      )}
    </section>
  );
}