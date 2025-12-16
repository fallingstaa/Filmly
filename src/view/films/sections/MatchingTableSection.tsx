'use client';

import React, { useEffect, useState } from 'react';

type Film = {
  id: string | number;
  title: string;
  year?: string;
  language?: string;
  theme?: string;
  description?: string;
};

async function fetchFilmsFromBackend(): Promise<Film[]> {
  if (typeof window === 'undefined') return [];
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      console.log('No access token found, using localStorage films');
      return getStoredFilms();
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'https://filmly-backend.vercel.app';
    const response = await fetch(`${baseUrl}/api/films`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      console.warn('Failed to fetch films from backend, using localStorage');
      return getStoredFilms();
    }

    const data = await response.json();
    const films = data.films || [];
    return films.map((film: any) => ({
      id: film.id,
      title: film.title,
      year: film.createdAt ? new Date(film.createdAt).getFullYear().toString() : undefined,
      language: film.language,
      theme: film.description || film.theme,
      description: film.description,
    }));
  } catch (error) {
    console.error('Error fetching films:', error);
    return getStoredFilms();
  }
}

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFilms();
  }, []);

  async function loadFilms() {
    setLoading(true);
    const fetchedFilms = await fetchFilmsFromBackend();
    setFilms(fetchedFilms);
    setLoading(false);
  }

  async function handleAiMatch(id: string | number, film: Film) {
    if (!film.theme && !film.description) {
      alert('Film needs a theme or description for AI matching. Please edit the film and add one.');
      return;
    }
    if (!film.language) {
      alert('Film needs a language for AI matching. Please edit the film and add one.');
      return;
    }

    setAiLoadingId(String(id));

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const theme = film.theme || film.description || '';
      const language = film.language || 'English';

      const url = `${baseUrl}/api/ai/match-festivals?theme=${encodeURIComponent(theme)}&language=${encodeURIComponent(language)}`;

      console.log('Calling AI matching API:', url);

      const response = await fetch(url);

      console.log('AI API response status:', response.status, response.statusText);
      console.log('AI API response headers:', {
        'access-control-allow-origin': response.headers.get('access-control-allow-origin'),
        'content-type': response.headers.get('content-type'),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error response:', errorText);
        throw new Error('Failed to fetch AI matching results');
      }

      const responseText = await response.text();
      console.log('AI API raw response:', responseText);

      let data;
      try {
        data = JSON.parse(responseText);
        console.log('AI matching results (parsed):', data);
      } catch (parseError) {
        console.error('Failed to parse AI API response as JSON:', parseError);
        throw new Error('Invalid response from AI API - not valid JSON');
      }

      // Check if backend returned an error in the response
      if (data.error) {
        throw new Error(data.error);
      }

      // Check if we got any matches
      if (!data.matches || data.matches.length === 0) {
        console.warn('No matches returned from AI API');
        alert(`AI matching completed but found no matching festivals.\n\nPossible reasons:\n- No festivals in database with open deadlines\n- Your theme/language doesn't match any festivals\n\nTry browsing festivals manually.`);
      }

      // Clear old results first
      sessionStorage.removeItem('ai_matching_results');

      // Store results in sessionStorage for the results page
      const resultsToStore = {
        filmId: id,
        filmTitle: film.title,
        results: data.matches || [],
        userInput: data.userInput || { theme, language },
        totalFestivals: data.totalFestivals || 0,
        compatibleMatches: data.compatibleMatches || 0,
        timestamp: Date.now(), // Add timestamp to force reload
      };

      console.log('Storing AI matching results in sessionStorage:', resultsToStore);
      sessionStorage.setItem('ai_matching_results', JSON.stringify(resultsToStore));

      // Verify storage
      const stored = sessionStorage.getItem('ai_matching_results');
      console.log('Verified stored data:', stored ? JSON.parse(stored) : 'null');

      // Navigate to matching page with results - use replace to force full page reload
      console.log('Navigating to matching page...');
      window.location.replace(`/films/matching?filmId=${id}&title=${encodeURIComponent(film.title)}&t=${Date.now()}`);
    } catch (error) {
      console.error('AI matching error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      alert(`Failed to perform AI matching.\n\nError: ${errorMessage}\n\nCheck the browser console for more details.`);
    } finally {
      setAiLoadingId(null);
    }
  }

  if (loading) {
    return (
      <section className="rounded-xl border border-[#EDEDED] bg-white shadow-sm w-full overflow-hidden p-8">
        <div className="flex items-center justify-center">
          <svg className="animate-spin h-8 w-8 text-[#00441B]" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="rgba(0,68,27,0.15)" strokeWidth="4" />
            <path d="M22 12a10 10 0 00-10-10" stroke="#00441B" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
      </section>
    );
  }

  if (films.length === 0) {
    return (
      <section className="rounded-xl border border-[#EDEDED] bg-white shadow-sm w-full overflow-hidden p-8">
        <div className="text-center text-[#6F6F6F]">
          <p className="text-sm">No films found. Add your first film to get started with AI matching.</p>
          <button
            onClick={() => window.location.href = '/films/add'}
            className="mt-4 rounded-md bg-[#00441B] px-4 py-2 text-sm font-medium text-white"
          >
            Add Film
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border border-[#EDEDED] bg-white shadow-sm w-full overflow-hidden relative">
      {/* header */}
      <div className="px-4 py-3 hidden md:grid grid-cols-6 text-sm font-semibold text-[#6F6F6F] bg-[#FBFBFB]">
        <div className="col-span-5">Film</div>
        <div className="col-span-1 text-right">Action</div>
      </div>

      {/* rows - removed divide-y to avoid dark separators on dark backgrounds */}
      <div
        style={{ maxHeight: '340px', overflowY: 'auto' }}
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
                  onClick={() => window.location.href = `/films/edit/${encodeURIComponent(f.id)}`}
                  className="rounded border border-[#2F623F] text-[#2F623F] px-3 py-1 text-sm"
                  aria-label={`Edit ${f.title}`}
                >
                  Edit
                </button>

                <button
                  onClick={() => handleAiMatch(f.id, f)}
                  className="rounded bg-[#00441B] text-white px-3 py-1 text-sm disabled:bg-gray-400 disabled:cursor-not-allowed"
                  aria-label={`AI matching for ${f.title}`}
                  disabled={aiLoadingId === String(f.id)}
                >
                  {aiLoadingId === String(f.id) ? 'Running AI...' : 'AI matching'}
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* loading overlay */}
      {aiLoadingId && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-2">
            <svg className="animate-spin h-8 w-8 text-[#00441B]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(0,68,27,0.15)" strokeWidth="4" />
              <path d="M22 12a10 10 0 00-10-10" stroke="#00441B" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="text-sm text-[#00441B]">AI matching in progress...</div>
          </div>
        </div>
      )}
    </section>
  );
}