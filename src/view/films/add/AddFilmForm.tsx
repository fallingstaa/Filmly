'use client';

import React, { useState, useEffect } from 'react';

const GENRES = [
  'Comedy',
  'Romance',
  'Drama',
  'Educational',
  'Documentary',
  'War',
  'Fantasy',
  'Action',
  'Traditional',
  'Western',
  'Horror',
  'Animation',
  'Thriller',
  'Adventure',
  'Science Fiction',
  'Musical',
];

// Accept festivalId as prop to distinguish submission type
export default function AddFilmForm({ festivalId, editId }: { festivalId?: string; editId?: string }) {
  // State for all fields
  const [title, setTitle] = useState('');
  const [country, setCountry] = useState('');
  const [duration, setDuration] = useState<number | ''>('');
  const [genre, setGenre] = useState('');
  const [language, setLanguage] = useState('');
  const [theme, setTheme] = useState('');
  const [synopsis, setSynopsis] = useState('');
  const [filmFile, setFilmFile] = useState<File | null>(null);
  const [subFile, setSubFile] = useState<File | null>(null);
  const [pressFile, setPressFile] = useState<File | null>(null);
  const [gmail, setGmail] = useState('');
  const [loading, setLoading] = useState(false);

  // Load draft if editId is provided
  useEffect(() => {
    if (editId) {
      try {
        const films = JSON.parse(localStorage.getItem('mock_films') || '[]');
        const draft = films.find((f: any) => f.id === editId);
        if (draft) {
          setTitle(draft.title || '');
          setCountry(draft.country || '');
          setDuration(draft.duration || '');
          setGenre(draft.genre || '');
          setLanguage(draft.language || '');
          setTheme(draft.theme || '');
          setSynopsis(draft.synopsis || '');
          setGmail(draft.gmail || '');
          // File fields can't be restored from localStorage, so leave them empty
        }
      } catch {}
    }
  }, [editId]);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>, setter: (f: File | null) => void) {
    setter(e.target.files?.[0] ?? null);
  }

  function saveDraft() {
    const draft = {
      id: editId || `film_${Date.now()}`,
      title,
      country,
      duration,
      genre,
      language,
      theme,
      synopsis,
      gmail,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    let films = [];
    try {
      films = JSON.parse(localStorage.getItem('mock_films') || '[]');
    } catch {}
    const idx = films.findIndex((f: any) => f.id === draft.id);
    if (idx >= 0) {
      films[idx] = draft;
    } else {
      films.push(draft);
    }
    localStorage.setItem('mock_films', JSON.stringify(films));
    alert('Draft saved locally!');
  }

  // --- AI Matching Submission Logic ---
  function submitToAi() {
    /**
     * AI Matching Submission:
     * - Triggered ONLY from "Add Film" in Project and AI Matching tab.
     * - When integrating with backend:
     *   - POST film data to backend for AI matching.
     *   - Backend returns matching festivals/projects.
     *   - Redirect user to matching results page.
     */
    const hasAny =
      Boolean(title) ||
      Boolean(country) ||
      duration !== '' ||
      Boolean(genre) ||
      Boolean(language) ||
      Boolean(theme) ||
      Boolean(synopsis);

    if (!hasAny) {
      alert('Please enter at least one field (title, theme, file, etc.) before submitting to AI.');
      return;
    }

    if (loading) return;
    setLoading(true);

    const delay = 2000 + Math.floor(Math.random() * 3000); // 2-5s
    setTimeout(() => {
      // create temporary film id and store film data in localStorage
      const id = `tmp-${Date.now()}`;
      const film = {
        id,
        title: title || `Untitled ${id}`,
        country,
        duration,
        genre,
        language,
        theme,
        synopsis,
        createdAt: new Date().toISOString(),
      };

      const stored = JSON.parse(localStorage.getItem('mock_films') || '[]');
      stored.push(film);
      localStorage.setItem('mock_films', JSON.stringify(stored));

      // create simple mock matches for the new film
      const mockMatches = Array.from({ length: 8 }).map((_, i) => ({
        id: `${id}-m${i + 1}`,
        festival: `Mock Festival ${i + 1}`,
        score: Math.max(60, Math.floor(90 - i * 3 + Math.random() * 10)),
        type: i % 2 === 0 ? 'Feature Film' : 'Short Film',
        country: ['USA', 'UK', 'France', 'Italy'][i % 4],
        deadline: `Dec ${10 + i}, 2025`,
      }));
      localStorage.setItem(`mock_matches_${id}`, JSON.stringify(mockMatches));

      setLoading(false);

      // navigate to the AI matching results screen with filmId/title in query
      const params = new URLSearchParams();
      params.set('filmId', id);
      params.set('title', film.title);
      window.location.href = `/films/matching?${params.toString()}`;
    }, delay);
  }

  // --- Festival Submission Logic ---
  function submitToFestival() {
    /**
     * For testing: No validation, just allow submit.
     * When integrating with backend, add validation and POST logic here.
     */
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      alert('Film submitted to festival! (test mode, no validation)');
      window.location.href = `/films/submissions`;
    }, 1200);
  }

  function cancel() {
    if (confirm('Discard changes?')) {
      if (typeof window !== 'undefined') window.history.back();
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 relative">
      {/* Gmail field above Title field */}
      <section className="rounded-lg border border-[#E6E6E6] bg-white p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-medium text-[#0B5A2E] mb-4">Film Details</h2>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Gmail</label>
          <input
            name="gmail"
            type="email"
            value={gmail}
            onChange={(e) => setGmail(e.target.value)}
            className="w-full border rounded px-3 py-2"
            placeholder="yourname@gmail.com"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-sm">Title</label>
          <input
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        {/* Country, Duration, Genre, Language row */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
          <div>
            <label className="block mb-1 text-sm">Production Country *</label>
            <select
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              className="mt-2 w-full rounded-md border px-3 py-2 text-sm bg-[#FBFBFB]"
            >
              <option value="">Select Country</option>
              <option>Thailand</option>
              <option>USA</option>
              <option>France</option>
              <option>India</option>
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Duration (minutes) *</label>
            <input
              type="number"
              value={duration}
              onChange={(e) => setDuration(e.target.value === '' ? '' : Number(e.target.value))}
              className="mt-2 w-full rounded-md border px-3 py-2 text-sm bg-[#FBFBFB]"
              placeholder="90"
            />
          </div>

          <div>
            <label className="block mb-1 text-sm">Genre *</label>
            <select
              value={genre}
              onChange={(e) => setGenre(e.target.value)}
              className="mt-2 w-full rounded-md border px-3 py-2 text-sm bg-[#FBFBFB]"
            >
              <option value="">Select genre</option>
              {GENRES.map((g) => (
                <option key={g} value={g}>
                  {g}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block mb-1 text-sm">Language *</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="mt-2 w-full rounded-md border px-3 py-2 text-sm bg-[#FBFBFB']"
            >
              <option value="">Select language</option>
              <option>English</option>
              <option>Thai</option>
              <option>French</option>
              <option>Spanish</option>
            </select>
          </div>
        </div>

        {/* Theme larger input */}
        <div className="mb-4">
          <label className="text-sm text-[#333]">Theme</label>
          <textarea
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            rows={4}
            placeholder="Brief description of your film... (2–3 sentences)"
            className="mt-2 w-full rounded-md border px-3 py-3 text-sm bg-[#FBFBFB] resize-y min-h-[110px]"
          />
        </div>

        {/* Synopsis full width */}
        <div>
          <label className="text-sm text-[#333]">Synopsis</label>
          <textarea
            value={synopsis}
            onChange={(e) => setSynopsis(e.target.value)}
            rows={6}
            placeholder="Brief description of your film... (eg: Lina, a shy 16-year-old girl who loves dancing...)"
            className="mt-2 w-full rounded-md border px-3 py-3 text-sm bg-[#FBFBFB] resize-y min-h-[160px]"
          />
        </div>
      </section>

      {/* Upload Files card */}
      <section className="rounded-lg border border-[#E6E6E6] bg-white p-6 mb-6 shadow-sm">
        <h2 className="text-lg font-medium text-[#0B5A2E] mb-4">Upload Files</h2>

        <div className="space-y-6">
          <div>
            <label className="text-sm text-[#333]">Film File (MP4, MOV, AVI) *</label>
            <label
              className="mt-2 flex items-center justify-center rounded-md border-2 border-dashed border-[#D6D6D6] bg-[#FBFBFB] cursor-pointer text-center p-6"
              style={{ minHeight: 120 }}
            >
              <input type="file" accept="video/*" onChange={(e) => handleFileChange(e, setFilmFile)} className="hidden" />
              <div>
                <div className="text-[#6F6F6F]">Click to upload film file</div>
                <div className="text-xs text-[#9AA0A6] mt-1">Maximum file size: 5GB</div>
                {filmFile && <div className="text-sm text-[#0B5A2E] mt-2">Selected: {filmFile.name}</div>}
              </div>
            </label>
          </div>

          <div>
            <label className="text-sm text-[#333]">Subtitles (SRT) - Optional</label>
            <label className="mt-2 flex items-center justify-center rounded-md border-2 border-dashed border-[#D6D6D6] bg-[#FBFBFB] cursor-pointer p-4" style={{ minHeight: 56 }}>
              <input type="file" accept=".srt" onChange={(e) => handleFileChange(e, setSubFile)} className="hidden" />
              <div className="text-[#6F6F6F]">Click to upload subtitles</div>
              {subFile && <div className="text-sm text-[#0B5A2E] ml-3">Selected: {subFile.name}</div>}
            </label>
          </div>

          <div>
            <label className="text-sm text-[#333]">Press Kit / Director Statement (PDF) - Optional</label>
            <label className="mt-2 flex items-center justify-center rounded-md border-2 border-dashed border-[#D6D6D6] bg-[#FBFBFB] cursor-pointer p-4" style={{ minHeight: 56 }}>
              <input type="file" accept="application/pdf" onChange={(e) => handleFileChange(e, setPressFile)} className="hidden" />
              <div className="text-[#6F6F6F]">Click to upload press kit</div>
              {pressFile && <div className="text-sm text-[#0B5A2E] ml-3">Selected: {pressFile.name}</div>}
            </label>
          </div>
        </div>
      </section>

      <div className="flex items-center justify-end gap-3 mb-8">
        <button onClick={cancel} className="rounded border px-4 py-2 text-sm bg-white">Cancel</button>
        <button onClick={saveDraft} className="rounded border px-4 py-2 text-sm bg-white">Save Draft</button>
        {festivalId ? (
          // Only show "Submit" for real festival submission
          <button
            onClick={submitToFestival}
            disabled={loading}
            className={`rounded px-4 py-2 text-sm ${loading ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-[#0B5A2E] text-white'}`}
          >
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        ) : (
          // Show "Submit to Ai" for AI matching
          <button
            onClick={submitToAi}
            disabled={loading}
            className={`rounded px-4 py-2 text-sm ${loading ? 'bg-gray-300 text-gray-700 cursor-not-allowed' : 'bg-[#0B5A2E] text-white'}`}
          >
            {loading ? 'Running AI...' : 'Submit to Ai'}
          </button>
        )}
      </div>

      {/* loading overlay */}
      {loading && (
        <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
            <svg className="animate-spin h-10 w-10 text-[#0B5A2E]" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="10" stroke="rgba(11,90,46,0.15)" strokeWidth="4" />
              <path d="M22 12a10 10 0 00-10-10" stroke="#0B5A2E" strokeWidth="4" strokeLinecap="round" />
            </svg>
            <div className="text-sm text-[#0B5A2E]">
              {festivalId ? 'Submitting to festival — this is a mockup' : 'Running AI matching — this is a mockup'}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}