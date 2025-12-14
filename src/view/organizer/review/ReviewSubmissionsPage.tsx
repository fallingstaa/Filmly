'use client';

import { useState } from 'react';
import { FiFilm, FiAward, FiX } from 'react-icons/fi';

const festivals = [
  'New York Independent Film Festival',
  'LA Short Film Showcase',
  'Miami Documentary Festival',
  'Chicago Student Film Awards',
];

const statusColors = {
  'Under Review': 'bg-blue-500 text-white',
  'Shortlisted': 'bg-yellow-400 text-white',
  'Submitted': 'bg-gray-500 text-white',
  'Nominee': 'bg-indigo-400 text-white',
  'Accepted': 'bg-green-500 text-white',
  'Rejected': 'bg-red-500 text-white',
};

const themes = [
  'A journey of self-discovery',
  'Overcoming adversity',
  'The power of friendship',
  'Secrets beneath the surface',
  'A race against time',
  'Love and loss',
  'Finding hope in darkness',
  'The cost of ambition',
  'Family ties',
  'Dreams vs. reality',
];

// Generate 100 fake submissions for pagination demo
const submissions = Array.from({ length: 100 }, (_, i) => ({
  id: i + 1,
  theme: themes[i % themes.length],
  film: `Film ${i + 1}`,
  filmmaker: `Filmmaker ${i + 1}`,
  genre: ['Drama', 'Comedy', 'Action', 'Thriller', 'Horror', 'Documentary'][i % 6],
  duration: `${80 + (i % 30)} min`,
  status: Object.keys(statusColors)[i % Object.keys(statusColors).length],
  jury: i % 3 === 0 ? `${(8 + (i % 3) + Math.random()).toFixed(1)}/10` : '',
  actions: i % 5 === 1 ? ['View', 'Award'] : ['View'],
  date: `Nov ${10 + (i % 20)}, 2025`,
  judgeComment: 'Excellent cinematography and strong narrative structure.',
}));

const statusOptions = [
  'All Status',
  'Under Review',
  'Shortlisted',
  'Submitted',
  'Nominee',
  'Accepted',
  'Rejected',
];

const PAGE_SIZE = 10;
const TOTAL_PAGES = Math.ceil(submissions.length / PAGE_SIZE);

const statusButtons = [
  { label: 'Under Review', color: 'bg-blue-500 text-white' },
  { label: 'Shortlist', color: 'bg-yellow-400 text-white' },
  { label: 'Accept', color: 'bg-green-500 text-white' },
  { label: 'Reject', color: 'bg-red-500 text-white' },
  { label: 'Nominee', color: 'bg-indigo-400 text-white' },
];

const mainAwards = [
  'None',
  'Best Overall Film',
  'Second Place',
  'Third Place',
];
const genreAwards = [
  'None',
  'Best Comedy',
  'Best Romance',
  'Best Drama',
  'Best Educational',
  'Best Documentary',
  'Best War',
  'Best Fantasy',
  'Best Action',
  'Best Traditional',
  'Best Western',
  'Best Horror',
  'Best Animation',
  'Best Thriller',
  'Best Adventure',
  'Best Sci-Fi',
];
const technicalAwards = [
  'None',
  'Best Cinematography',
  'Best Editing',
  'Best Sound & Music',
  'Best Screenplay',
  'Best Director',
  'Best Actor',
  'Best Actress',
  'Best Youth Film',
  'Audience Choice Award',
];

export default function ReviewSubmissionsPage() {
  const [page, setPage] = useState(1);
  const [modal, setModal] = useState(null as null | typeof submissions[0]);
  const [status, setStatus] = useState('Under Review');
  const [juryScore, setJuryScore] = useState('');
  const [judgeComment, setJudgeComment] = useState('');
  const [awardModal, setAwardModal] = useState<null | typeof submissions[0]>(null);
  const [mainAward, setMainAward] = useState('');
  const [genreAward, setGenreAward] = useState('');
  const [techAward, setTechAward] = useState('');
  const paged = submissions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-900 mb-1">Review Submissions</h1>
          <p className="text-gray-500 text-base">Evaluate films and assign awards</p>
        </div>
        <div className="flex gap-3">
          <select className="border rounded-lg px-4 py-2 bg-white text-gray-800 min-w-[220px] shadow-sm">
            {festivals.map(f => <option key={f}>{f}</option>)}
          </select>
          <select className="border rounded-lg px-4 py-2 bg-white text-gray-800 min-w-[150px] shadow-sm">
            {statusOptions.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
      </div>
      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <table className="min-w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th className="px-4 py-2 font-semibold">Theme</th>
              <th className="px-4 py-2 font-semibold">Film</th>
              <th className="px-4 py-2 font-semibold">Filmmaker</th>
              <th className="px-4 py-2 font-semibold">Genre</th>
              <th className="px-4 py-2 font-semibold">Duration</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Jury Score</th>
              <th className="px-4 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((s) => (
              <tr key={s.id} className="bg-white border-b last:border-b-0">
                <td className="px-4 py-2 text-gray-900 whitespace-nowrap">{s.theme}</td>
                <td className="px-4 py-2 text-gray-900 whitespace-nowrap flex items-center gap-2">
                  <span className="inline-flex items-center justify-center bg-green-100 rounded p-1"><FiFilm className="text-green-900 text-lg" /></span>
                  <span>{s.film}</span>
                </td>
                <td className="px-4 py-2 text-gray-900 whitespace-nowrap">{s.filmmaker}</td>
                <td className="px-4 py-2 text-gray-900 whitespace-nowrap">{s.genre}</td>
                <td className="px-4 py-2 text-gray-900 whitespace-nowrap">{s.duration}</td>
                <td className="px-4 py-2">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${statusColors[s.status]}`}
                    onClick={() => { setModal(s); setStatus(s.status); setJuryScore(s.jury.replace('/10', '')); }}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="px-4 py-2 text-gray-900 whitespace-nowrap">{s.jury || '-'}</td>
                <td className="px-4 py-2 flex gap-2">
                  {s.actions.includes('Award') && (
                    <button
                      className="border border-green-900 text-green-900 font-bold px-4 py-1 rounded flex items-center gap-1 hover:bg-green-50"
                      onClick={() => {
                        setAwardModal(s);
                        setMainAward('');
                        setGenreAward('');
                        setTechAward('');
                      }}
                    >
                      <FiAward className="text-green-900" /> Award
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* Pagination Footer */}
      <div className="flex justify-center mt-6 gap-2">
        <button
          className={`px-4 py-2 rounded border font-semibold ${page === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-green-900 border-gray-300'}`}
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </button>
        <span className="px-4 py-2 text-gray-700">Page {page} of {TOTAL_PAGES}</span>
        <button
          className={`px-4 py-2 rounded border font-semibold ${page === TOTAL_PAGES ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-green-900 border-gray-300'}`}
          onClick={() => setPage(p => Math.min(TOTAL_PAGES, p + 1))}
          disabled={page === TOTAL_PAGES}
        >
          Next
        </button>
      </div>
      {/* Modal for status update */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setModal(null)}><FiX size={20} /></button>
            <h2 className="text-xl font-bold text-green-900 mb-1">{modal.film}</h2>
            <p className="text-gray-500 mb-4">Review details and submission information</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="text-xs text-gray-500">Filmmaker</div>
                <div className="font-medium text-gray-900">{modal.filmmaker}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Genre</div>
                <div className="font-medium text-gray-900">{modal.genre}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Duration</div>
                <div className="font-medium text-gray-900">{modal.duration}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Date Submitted</div>
                <div className="font-medium text-gray-900">{modal.date}</div>
              </div>
            </div>
            <div className="mb-2">
              <div className="text-xs text-gray-500 mb-1">Current Status</div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${statusColors[status]}`}>{status}</span>
            </div>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Judge Comments</div>
              <textarea
                className="bg-gray-100 rounded px-3 py-2 text-gray-700 text-sm w-full min-h-[48px]"
                value={judgeComment}
                placeholder="Add or update judge comments..."
                onChange={e => setJudgeComment(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <div className="text-xs text-gray-500 mb-1">Change Status</div>
              <div className="flex gap-2 mt-1">
                {statusButtons.map(btn => (
                  <button
                    key={btn.label}
                    type="button"
                    className={`px-3 py-1 rounded font-semibold text-xs focus:outline-none ${btn.color} ${status === btn.label ? 'ring-2 ring-green-900' : ''}`}
                    onClick={() => setStatus(btn.label)}
                  >
                    {btn.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-1">Add Jury Score</div>
              <input
                type="number"
                min={0}
                max={10}
                step={0.1}
                placeholder="0-10"
                className="w-full border rounded px-3 py-2 bg-gray-50"
                value={juryScore}
                onChange={e => setJuryScore(e.target.value)}
              />
            </div>
            <button className="bg-green-900 text-white font-bold px-6 py-2 rounded hover:bg-green-800 w-full" onClick={() => setModal(null)}>
              Update Status
            </button>
          </div>
        </div>
      )}
      {/* Assign Award Modal */}
      {awardModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-lg relative animate-fade-in">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setAwardModal(null)}><FiX size={20} /></button>
            <h2 className="text-xl font-bold text-green-900 mb-1">Assign Award</h2>
            <p className="text-gray-500 mb-6">Assign an award to <span className="font-semibold text-gray-900">{awardModal.film}</span></p>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Main Awards (Top 1-3)</label>
              <select
                className="w-full border rounded px-3 py-2 bg-gray-50"
                value={mainAward}
                onChange={e => setMainAward(e.target.value)}
              >
                <option value="">Select main award</option>
                {mainAwards.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre-Specific Award</label>
              <select
                className="w-full border rounded px-3 py-2 bg-gray-50"
                value={genreAward}
                onChange={e => setGenreAward(e.target.value)}
              >
                <option value="">Select genre award</option>
                {genreAwards.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1">Technical/Skill Awards</label>
              <select
                className="w-full border rounded px-3 py-2 bg-gray-50"
                value={techAward}
                onChange={e => setTechAward(e.target.value)}
              >
                <option value="">Select technical award</option>
                {technicalAwards.map(a => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                className="border border-gray-300 rounded px-6 py-2 text-gray-700 bg-white"
                onClick={() => setAwardModal(null)}
              >
                Cancel
              </button>
              <button
                className="bg-green-900 text-white font-bold px-6 py-2 rounded hover:bg-green-800"
                onClick={() => setAwardModal(null)}
              >
                Assign Award
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
