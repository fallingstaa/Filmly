'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

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
  async function submitToAi() {
    /**
     * AI Matching Submission:
     * - Triggered ONLY from "Add Film" in Project and AI Matching tab.
     * - Calls backend AI matching API with film theme and language.
     * - Backend returns matching festivals/projects.
     * - Redirect user to matching results page.
     */

    // Validate required fields for AI matching
    if (!theme && !synopsis) {
      alert('Please enter a theme or synopsis for AI matching.');
      return;
    }
    if (!language) {
      alert('Please select a language for AI matching.');
      return;
    }
    if (!title) {
      alert('Please enter a film title.');
      return;
    }

    if (loading) return;
    setLoading(true);

    try {
      // Create temporary film id and store film data in localStorage
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
        description: synopsis || theme,
        createdAt: new Date().toISOString(),
      };

      const stored = JSON.parse(localStorage.getItem('mock_films') || '[]');
      stored.push(film);
      localStorage.setItem('mock_films', JSON.stringify(stored));

      // Call the real AI matching API
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
      const filmTheme = theme || synopsis || '';
      const filmLanguage = language || 'English';

      const url = `${baseUrl}/api/ai/match-festivals?theme=${encodeURIComponent(filmTheme)}&language=${encodeURIComponent(filmLanguage)}`;

      console.log('Calling AI matching API:', url);

      const response = await fetch(url);

      console.log('AI API response status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('AI API error response:', errorText);
        throw new Error(`AI matching failed: ${response.statusText}`);
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
        alert(`AI matching completed but found no matching festivals. This might mean:\n- No festivals in database with open deadlines\n- Your theme/language doesn't match any festivals\n\nTry browsing festivals manually at /films/festival`);
      }

      // Store results in sessionStorage for the results page
      sessionStorage.setItem('ai_matching_results', JSON.stringify({
        filmId: id,
        filmTitle: film.title,
        results: data.matches || [],
        userInput: data.userInput || { theme: filmTheme, language: filmLanguage },
        totalFestivals: data.totalFestivals || 0,
        compatibleMatches: data.compatibleMatches || 0,
      }));

      setLoading(false);

      // Navigate to the AI matching results screen with filmId/title in query
      const params = new URLSearchParams();
      params.set('filmId', id);
      params.set('title', film.title);
      window.location.href = `/films/matching?${params.toString()}`;
    } catch (error) {
      console.error('AI matching error:', error);
      setLoading(false);
      alert(`Failed to perform AI matching: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // --- Festival Submission Logic ---
  async function submitToFestival() {
    if (!festivalId) return;
    if (!title || !country || !duration || !genre || !language) {
      alert('Please fill in all required fields.');
      return;
    }
    setLoading(true);
    try {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) throw new Error('Not authenticated');

      // 1. Upload video to Supabase Storage
      let s3_link = '';
      if (filmFile) {
        // Use a unique path: e.g., films/{gmail or user}/{title}/{timestamp}_{filename}
        const userFolder = gmail?.split('@')[0] || 'user';
        const fileExt = filmFile.name.split('.').pop();
        const filePath = `film-videos/${userFolder}/${title}/${Date.now()}_${title.replace(/\s+/g, '_')}.${fileExt}`;
        const { data, error } = await supabase.storage.from('film-videos').upload(filePath, filmFile, {
          cacheControl: '3600',
          upsert: false,
        });
        if (error) throw new Error('Failed to upload video: ' + error.message);
        // Get public URL
        const { data: publicUrlData } = supabase.storage.from('film-videos').getPublicUrl(filePath);
        s3_link = publicUrlData?.publicUrl || '';
        if (!s3_link) throw new Error('Failed to get public video URL');
      }

      // 2. Upload subtitle file if present
      let subtitle_file = '';
      if (subFile) {
        const userFolder = gmail?.split('@')[0] || 'user';
        const fileExt = subFile.name.split('.').pop();
        const filePath = `subtitles/${userFolder}/${title}/${Date.now()}_${title.replace(/\s+/g, '_')}.${fileExt}`;
        const { data, error } = await supabase.storage.from('film-videos').upload(filePath, subFile, {
          cacheControl: '3600',
          upsert: false,
        });
        if (error) throw new Error('Failed to upload subtitle: ' + error.message);
        const { data: publicUrlData } = supabase.storage.from('film-videos').getPublicUrl(filePath);
        subtitle_file = publicUrlData?.publicUrl || '';
      }


      // 3. Create film (send s3_link and subtitle_file as URLs via FormData)
      const formData = new FormData();
      formData.append('title', title);
      formData.append('country', country);
      formData.append('duration', String(duration));
      formData.append('genre', JSON.stringify([genre]));
      formData.append('language', language);
      formData.append('theme', theme);
      formData.append('description', synopsis);
      formData.append('gmail', gmail);
      formData.append('s3_link', s3_link);
      formData.append('subtitle_file', subtitle_file);

      const filmRes = await fetch('/api/films', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      const filmData = await filmRes.json();
      if (!filmRes.ok) throw new Error(filmData.message || 'Failed to create film');
      const filmId = filmData.film?.id || filmData.filmId || filmData.id;
      if (!filmId) throw new Error('Film ID not returned');

      // 4. Submit film to festival
      const subRes = await fetch('/api/submissions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ eventId: festivalId, filmId }),
      });
      const subData = await subRes.json();
      if (!subRes.ok) throw new Error(subData.message || 'Failed to submit film to festival');

      setLoading(false);
      alert('Film submitted to festival successfully!');
      window.location.href = `/films/submissions`;
    } catch (err: any) {
      setLoading(false);
      alert(err.message || 'Submission failed');
    }
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