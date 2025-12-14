'use client';

import React, { useEffect, useState } from 'react';

const GENRES = [
  'Comedy', 'Romance', 'Drama', 'Educational', 'Documentary', 'War', 'Fantasy', 'Action',
  'Traditional', 'Western', 'Horror', 'Animation', 'Thriller', 'Adventure', 'Science Fiction', 'Musical',
];

export default function EditFilmPage({ params }: { params: { id: string } }) {
  const [film, setFilm] = useState<any>(null);

  useEffect(() => {
    const films = JSON.parse(localStorage.getItem('mock_films') || '[]');
    const found = films.find((f: any) => f.id === params.id);
    setFilm(found || {
      id: params.id,
      title: '',
      country: '',
      duration: '',
      genre: '',
      language: '',
      theme: '',
      synopsis: '',
      year: '',
    });
  }, [params.id]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFilm({ ...film, [e.target.name]: e.target.value });
  }

  function saveEdit() {
    const films = JSON.parse(localStorage.getItem('mock_films') || '[]');
    const idx = films.findIndex((f: any) => f.id === film.id);
    if (idx >= 0) {
      films[idx] = film;
    } else {
      films.push(film);
    }
    localStorage.setItem('mock_films', JSON.stringify(films));
    alert('Film updated!');
    window.location.href = '/films/matching';
  }

  if (!film) return <div className="p-8">Loading...</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Edit Film</h1>
      <div className="mb-4">
        <label className="block mb-1 text-sm">Title</label>
        <input
          name="title"
          value={film.title}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm">Year</label>
        <input
          name="year"
          value={film.year || ''}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm">Country</label>
        <input
          name="country"
          value={film.country}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm">Duration</label>
        <input
          name="duration"
          value={film.duration}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm">Genre</label>
        <select
          name="genre"
          value={film.genre}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        >
          <option value="">Select genre</option>
          {GENRES.map((g) => (
            <option key={g} value={g}>{g}</option>
          ))}
        </select>
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm">Language</label>
        <input
          name="language"
          value={film.language}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm">Theme</label>
        <input
          name="theme"
          value={film.theme}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <div className="mb-4">
        <label className="block mb-1 text-sm">Synopsis</label>
        <textarea
          name="synopsis"
          value={film.synopsis}
          onChange={handleChange}
          className="w-full border rounded px-3 py-2"
        />
      </div>
      <button
        onClick={saveEdit}
        className="bg-[#0C4A2A] text-white px-4 py-2 rounded"
      >
        Save Changes
      </button>
    </div>
  );
}