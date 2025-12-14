'use client';

import { useState } from 'react';
import { FiUploadCloud } from 'react-icons/fi';

const genres = [
  'Drama', 'Comedy', 'Action', 'Thriller', 'Horror', 'Documentary',
  'Animation', 'Sci-Fi', 'Romance', 'Fantasy', 'Mystery', 'Adventure',
  'Crime', 'War', 'Musical',
];

const countries = [
  'USA', 'UK', 'France', 'Germany', 'India', 'China', 'Japan', 'South Korea', 'Thailand', 'Vietnam',
  'Malaysia', 'Singapore', 'Indonesia', 'Philippines', 'Cambodia', 'Laos', 'Myanmar', 'Nepal', 'Bangladesh', 'Pakistan',
  'Sri Lanka', 'Mongolia', 'Bhutan', 'Brunei', 'East Timor', 'Afghanistan', 'Uzbekistan', 'Kazakhstan', 'Kyrgyzstan', 'Tajikistan',
  'Turkmenistan', 'Russia', 'Turkey', 'Iran', 'Iraq', 'Israel', 'Saudi Arabia', 'UAE', 'Qatar', 'Kuwait',
  'Oman', 'Yemen', 'Jordan', 'Lebanon', 'Syria', 'Palestine', 'Azerbaijan', 'Armenia', 'Georgia', 'Maldives',
  'Australia', 'Canada', 'Brazil', 'Mexico', 'Italy', 'Spain', 'Sweden', 'Norway', 'Finland', 'Denmark',
  'Switzerland', 'Netherlands', 'Belgium', 'Poland', 'Czech Republic', 'Hungary', 'Austria', 'Greece', 'Portugal', 'South Africa',
];

const languages = [
  'English', 'French', 'German', 'Hindi', 'Mandarin', 'Cantonese', 'Japanese', 'Korean', 'Thai', 'Vietnamese',
  'Malay', 'Indonesian', 'Filipino', 'Khmer', 'Lao', 'Burmese', 'Nepali', 'Bengali', 'Urdu', 'Sinhala',
  'Dzongkha', 'Tetum', 'Pashto', 'Uzbek', 'Kazakh', 'Kyrgyz', 'Tajik', 'Turkmen', 'Russian', 'Turkish',
  'Persian', 'Arabic', 'Hebrew', 'Malayalam', 'Tamil', 'Telugu', 'Kannada', 'Marathi', 'Gujarati', 'Punjabi',
  'Ukrainian', 'Romanian', 'Dutch', 'Italian', 'Spanish', 'Portuguese', 'Greek', 'Polish', 'Czech', 'Hungarian',
  'Swedish', 'Norwegian', 'Finnish', 'Danish', 'Swahili', 'Zulu',
];

export default function CreateFestivalPage() {
  const [form, setForm] = useState({
    name: '',
    eventDate: '',
    country: '',
    languages: '',
    durationFrom: '',
    durationTo: '',
    synopsis: '',
    logo: null as File | null,
    genres: genres,
    regularStart: '',
    regularEnd: '',
    lateStart: '',
    lateEnd: '',
  });

  return (
    <div className="p-6">
      {/* Top Section */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-green-900 mb-1">Create New Festival</h1>
        <p className="text-gray-500 text-base">Set up your festival and start accepting submissions</p>
      </div>
      {/* Form Section */}
      <form className="space-y-8">
        {/* Basic Info */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-green-900 font-semibold text-lg mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Festival Name *</label>
              <input type="text" placeholder="e.g., New York Independent Film Festival" className="w-full border rounded px-3 py-2 bg-gray-50" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Event Date</label>
              <input type="text" placeholder="DD/MM/YY" className="w-full border rounded px-3 py-2 bg-gray-50" value={form.eventDate} onChange={e => setForm(f => ({ ...f, eventDate: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
              <select className="w-full border rounded px-3 py-2 bg-gray-50" value={form.country} onChange={e => setForm(f => ({ ...f, country: e.target.value }))}>
                <option value="">Select country</option>
                {countries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
              <select className="w-full border rounded px-3 py-2 bg-gray-50" value={form.languages} onChange={e => setForm(f => ({ ...f, languages: e.target.value }))}>
                <option value="">Select language</option>
                {languages.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          {/* Duration Range */}
          <div className="mb-4 border rounded p-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">Duration*</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From*</label>
                <input type="text" className="w-full border rounded px-3 py-2 bg-gray-50" value={form.durationFrom} onChange={e => setForm(f => ({ ...f, durationFrom: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To*</label>
                <input type="text" className="w-full border rounded px-3 py-2 bg-gray-50" value={form.durationTo} onChange={e => setForm(f => ({ ...f, durationTo: e.target.value }))} />
              </div>
            </div>
          </div>
          {/* Synopsis/Theme */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
            <textarea placeholder="Brief description of your film... (eg: Lina, a shy 16-year-old girl who loves dancing, secretly practices every night..........etc)" className="w-full border rounded px-3 py-2 min-h-[60px] bg-gray-50" value={form.synopsis} onChange={e => setForm(f => ({ ...f, synopsis: e.target.value }))} />
          </div>
          {/* Logo Upload */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Festival Logo</label>
            <label className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-32 cursor-pointer bg-gray-50">
              <FiUploadCloud className="text-3xl text-gray-400 mb-2" />
              <span className="text-gray-500 text-sm">Click to upload festival logo<br />PNG, JPG up to 5MB</span>
              <input type="file" className="hidden" accept="image/*" onChange={e => setForm(f => ({ ...f, logo: e.target.files?.[0] || null }))} />
            </label>
          </div>
        </div>
        {/* Genres */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-green-900 font-semibold text-lg mb-2">Accepted Genres</h2>
          <p className="text-gray-500 text-sm mb-4">All genres below must be accepted. You cannot exclude any genre. This ensures that filmmakers from all categories can submit to your festival</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {genres.map((g) => (
              <button key={g} type="button" className="border rounded px-3 py-2 bg-gray-50 text-gray-700 cursor-not-allowed" disabled>{g}</button>
            ))}
          </div>
        </div>
        {/* Regular Deadline */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-green-900 font-semibold text-base mb-2">Festival Regular Deadline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="date" className="w-full border rounded px-3 py-2 bg-gray-50" value={form.regularStart} onChange={e => setForm(f => ({ ...f, regularStart: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input type="date" className="w-full border rounded px-3 py-2 bg-gray-50" value={form.regularEnd} onChange={e => setForm(f => ({ ...f, regularEnd: e.target.value }))} />
            </div>
          </div>
        </div>
        {/* Late Deadline */}
        <div className="bg-white rounded-xl shadow p-6">
          <h2 className="text-green-900 font-semibold text-base mb-2">Festival late Deadline</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
              <input type="date" className="w-full border rounded px-3 py-2 bg-gray-50" value={form.lateStart} onChange={e => setForm(f => ({ ...f, lateStart: e.target.value }))} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
              <input type="date" className="w-full border rounded px-3 py-2 bg-gray-50" value={form.lateEnd} onChange={e => setForm(f => ({ ...f, lateEnd: e.target.value }))} />
            </div>
          </div>
        </div>
        {/* Actions */}
        <div className="flex justify-end gap-2">
          <button type="button" className="border border-gray-300 rounded px-6 py-2 text-gray-700 bg-white">Cancel</button>
          <button type="submit" className="bg-green-900 text-white font-bold px-6 py-2 rounded hover:bg-green-800">Publish Festival</button>
        </div>
      </form>
    </div>
  );
}
