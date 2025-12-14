'use client';
import { useState } from 'react';
import FestivalDetailCard from './FestivalDetailCard';

const festivals = [
  { name: 'Tales of Tomorrow', date: '10.Oct.2025',
    theme: 'Unseen Truths',
    about: `There are things we sense but never speak, shadows hiding behind everyday smiles.\nSometimes the smallest detail reveals everything we tried to ignore.\nFollow the path of what's hidden, whispered, or half-forgotten.\nLet your film uncover what people rarely dare to face.`,
    location: 'Cambodia',
    festivalDates: 'January 16-26, 2026',
    language: 'Khmer,english,thailad,...',
    duration: '5-60m',
    deadline: '25,Dec,2025',
    stats: {
      submissions: 352,
      filmmakers: 287,
      awards: 39,
      complete: true,
    }
  },
  { name: 'Beyond Reality', date: '10.Oct.2025', theme: 'Unseen Truths', about: '', location: '', festivalDates: '', language: '', duration: '', deadline: '', stats: {submissions: 0, filmmakers: 0, awards: 0, complete: false}},
  { name: 'Moments That Matter', date: '10.Oct.2025', theme: 'Unseen Truths', about: '', location: '', festivalDates: '', language: '', duration: '', deadline: '', stats: {submissions: 0, filmmakers: 0, awards: 0, complete: false}},
  { name: 'Whispers of Change', date: '10.Oct.2025', theme: 'Unseen Truths', about: '', location: '', festivalDates: '', language: '', duration: '', deadline: '', stats: {submissions: 0, filmmakers: 0, awards: 0, complete: false}},
  { name: 'Visions of Freedom', date: '10.Oct.2025', theme: 'Unseen Truths', about: '', location: '', festivalDates: '', language: '', duration: '', deadline: '', stats: {submissions: 0, filmmakers: 0, awards: 0, complete: false}},
  { name: 'Stories Untold', date: '10.Oct.2025', theme: 'Unseen Truths', about: '', location: '', festivalDates: '', language: '', duration: '', deadline: '', stats: {submissions: 0, filmmakers: 0, awards: 0, complete: false}},
];

const PAGE_SIZE = 10;
const TOTAL_PAGES = 30;
const PAGINATION_WINDOW = 5;

function getPaginationWindow(current: number, total: number, window: number) {
  const start = Math.floor((current - 1) / window) * window + 1;
  const end = Math.min(start + window - 1, total);
  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }
  return { pages, start, end };
}

export default function MyFestivalPage() {
  const [selected, setSelected] = useState('All Festivals');
  const [page, setPage] = useState(1);
  const [selectedFestival, setSelectedFestival] = useState(null as null | typeof festivals[0]);
  // For demo, repeat festivals to fill pages
  const pagedFestivals = Array(PAGE_SIZE).fill(0).map((_, i) => festivals[(i + (page - 1) * PAGE_SIZE) % festivals.length]);
  const { pages, start, end } = getPaginationWindow(page, TOTAL_PAGES, PAGINATION_WINDOW);

  const handlePrev = () => {
    if (start > 1) {
      setPage(start - PAGINATION_WINDOW);
    }
  };
  const handleNext = () => {
    if (end < TOTAL_PAGES) {
      setPage(end + 1);
    }
  };

  if (selectedFestival) {
    return (
      <FestivalDetailCard festival={selectedFestival} onClose={() => setSelectedFestival(null)} />
    );
  }

  return (
    <div className="p-8">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-green-900 mb-1">All your Festival here!</h1>
          <p className="text-gray-500 text-base">Comprehensive insights into your festival performance</p>
        </div>
        <select
          className="border rounded-lg px-4 py-2 bg-gray-50 text-gray-800 min-w-[220px] shadow-sm"
          value={selected}
          onChange={e => setSelected(e.target.value)}
        >
          <option>All Festivals</option>
          {festivals.map(f => (
            <option key={f.name}>{f.name}</option>
          ))}
        </select>
      </div>
      {/* Recent Festivals Grid */}
      <div>
        <h2 className="text-green-900 font-semibold text-base mb-4">All the Recent Festival</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {pagedFestivals.map((fest, i) => (
            <div key={i} className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col aspect-square overflow-hidden cursor-pointer" onClick={() => setSelectedFestival(fest)}>
              <div className="bg-gray-100 flex items-center justify-center w-full h-1/2 min-h-[80px]">
                <span className="text-2xl text-gray-400">🎬</span>
              </div>
              <div className="px-4 py-3 flex-1 flex flex-col justify-end">
                <div className="font-medium text-gray-900 mb-1">{fest.name}</div>
                <div className="text-gray-500 text-sm">Event date: {fest.date}</div>
              </div>
            </div>
          ))}
        </div>
        {/* Pagination Footer */}
        <div className="flex flex-wrap justify-center mt-8 gap-1 items-center">
          <button
            className={`px-4 py-2 rounded-lg border font-semibold transition ${start === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-green-900 border-gray-300 hover:bg-green-50'}`}
            onClick={handlePrev}
            disabled={start === 1}
          >
            Previous
          </button>
          {pages.map((p) => (
            <button
              key={p}
              className={`px-3 py-2 rounded-lg border font-semibold text-sm mx-0.5 transition ${page === p ? 'bg-green-900 text-white border-green-900' : 'bg-white text-green-900 border-gray-300 hover:bg-green-50'}`}
              onClick={() => setPage(p)}
              aria-current={page === p ? 'page' : undefined}
            >
              {p}
            </button>
          ))}
          <button
            className={`px-4 py-2 rounded-lg border font-semibold transition ${end === TOTAL_PAGES ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-green-900 border-gray-300 hover:bg-green-50'}`}
            onClick={handleNext}
            disabled={end === TOTAL_PAGES}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
