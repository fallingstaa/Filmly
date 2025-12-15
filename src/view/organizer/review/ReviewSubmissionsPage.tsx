'use client';

import { useState, useEffect } from 'react';
import { FiFilm, FiAward, FiX } from 'react-icons/fi';
import { getMyEvents, getEventSubmissions, updateSubmissionStatus, assignWinner } from '@/api/organizerApi';

const statusColors = {
  'under_review': 'bg-blue-500 text-white',
  'shortlist': 'bg-yellow-500 text-white',
  'accept': 'bg-green-500 text-white',
  'reject': 'bg-red-500 text-white',
  'nominee': 'bg-purple-500 text-white',
};

const statusOptions = [
  'All Status',
  'under_review',
  'shortlist',
  'accept',
  'reject',
  'nominee',
];

const PAGE_SIZE = 10;

const statusButtons = [
  { label: 'under_review', value: 'under_review', color: 'bg-blue-500 text-white' },
  { label: 'shortlist', value: 'shortlist', color: 'bg-yellow-500 text-white' },
  { label: 'accept', value: 'accept', color: 'bg-green-500 text-white' },
  { label: 'reject', value: 'reject', color: 'bg-red-500 text-white' },
  { label: 'nominee', value: 'nominee', color: 'bg-purple-500 text-white' },
];

const mainAwards = [
  '1st',
  '2nd',
  '3rd',
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
  const [modal, setModal] = useState(null as any);
  const [status, setStatus] = useState('submitted');
  const [juryScore, setJuryScore] = useState('');
  const [judgeComment, setJudgeComment] = useState('');
  const [awardModal, setAwardModal] = useState<any>(null);
  const [mainAward, setMainAward] = useState('');
  const [genreAward, setGenreAward] = useState('');
  const [techAward, setTechAward] = useState('');

  // State for API data
  const [festivals, setFestivals] = useState<any[]>([]);
  const [selectedFestival, setSelectedFestival] = useState<string>('');
  const [selectedStatusFilter, setSelectedStatusFilter] = useState<string>('All Status');
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch festivals on mount
  useEffect(() => {
    fetchFestivals();
  }, []);

  // Fetch submissions when festival changes
  useEffect(() => {
    if (selectedFestival && selectedFestival !== 'Select Festival') {
      fetchSubmissions();
    }
  }, [selectedFestival]);

  const fetchFestivals = async () => {
    try {
      const response = await getMyEvents();
      setFestivals(response.events || []);
      if (response.events && response.events.length > 0) {
        setSelectedFestival(response.events[0].id.toString());
      }
    } catch (err: any) {
      console.error('Error fetching festivals:', err);
      setError(err.message || 'Failed to load festivals');
    }
  };

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const eventId = parseInt(selectedFestival);
      const response = await getEventSubmissions(eventId);
      setSubmissions(response.submissions || []);
    } catch (err: any) {
      console.error('Error fetching submissions:', err);
      setError(err.message || 'Failed to load submissions');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!modal) return;

    try {
      await updateSubmissionStatus(modal.id, status as any);
      // Refresh submissions
      fetchSubmissions();
      setModal(null);
    } catch (err: any) {
      alert('Failed to update status: ' + err.message);
    }
  };

  const handleAssignAward = async () => {
    if (!awardModal || !selectedFestival) return;

    const category = mainAward || genreAward || techAward;
    if (!category) {
      alert('Please select at least one award');
      return;
    }

    try {
      await assignWinner(parseInt(selectedFestival), {
        eventFilmSubmissionId: awardModal.id,
        category: category,
      });
      // Refresh submissions
      fetchSubmissions();
      setAwardModal(null);
      setMainAward('');
      setGenreAward('');
      setTechAward('');
    } catch (err: any) {
      alert('Failed to assign award: ' + err.message);
    }
  };

  // Filter and paginate submissions
  const filteredSubmissions = selectedStatusFilter === 'All Status'
    ? submissions
    : submissions.filter((s) => s.submissionStatus === selectedStatusFilter);

  const totalPages = Math.ceil(filteredSubmissions.length / PAGE_SIZE);
  const paged = filteredSubmissions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="p-6">
      {/* Header and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-green-900 mb-1">Review Submissions</h1>
          <p className="text-gray-500 text-base">Evaluate films and assign awards</p>
        </div>
        <div className="flex gap-3">
          <select
            className="border rounded-lg px-4 py-2 bg-white text-gray-800 min-w-[220px] shadow-sm"
            value={selectedFestival}
            onChange={(e) => setSelectedFestival(e.target.value)}
          >
            <option value="">Select Festival</option>
            {festivals.map((f) => (
              <option key={f.id} value={f.id}>
                {f.title}
              </option>
            ))}
          </select>
          <select
            className="border rounded-lg px-4 py-2 bg-white text-gray-800 min-w-[150px] shadow-sm"
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
          >
            {statusOptions.map((s) => (
              <option key={s} value={s}>
                {s.replace('_', ' ')}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Loading state */}
      {loading && (
        <div className="flex items-center justify-center p-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900"></div>
        </div>
      )}

      {/* Error state */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 mb-4">
          <p>{error}</p>
        </div>
      )}
      {/* Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <table className="min-w-full text-left border-separate border-spacing-y-2">
          <thead>
            <tr className="text-gray-500 text-sm">
              <th className="px-4 py-2 font-semibold">Film</th>
              <th className="px-4 py-2 font-semibold">Filmmaker</th>
              <th className="px-4 py-2 font-semibold">Genre</th>
              <th className="px-4 py-2 font-semibold">Duration</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {!loading && paged.length > 0 ? (
              paged.map((s) => (
                <tr key={s.id} className="bg-white border-b last:border-b-0">
                  <td className="px-4 py-2 text-gray-900 whitespace-nowrap flex items-center gap-2">
                    <span className="inline-flex items-center justify-center bg-green-100 rounded p-1">
                      <FiFilm className="text-green-900 text-lg" />
                    </span>
                    <span>{s.film?.title || 'Untitled'}</span>
                  </td>
                  <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                    {s.filmOwner?.username || 'Unknown'}
                  </td>
                  <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                    {s.film?.genre?.join(', ') || 'N/A'}
                  </td>
                  <td className="px-4 py-2 text-gray-900 whitespace-nowrap">
                    {s.film?.duration ? `${s.film.duration} min` : 'N/A'}
                  </td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                        statusColors[s.submissionStatus] || 'bg-gray-400 text-white'
                      }`}
                      onClick={() => {
                        setModal(s);
                        setStatus(s.submissionStatus);
                      }}
                    >
                      {s.submissionStatus.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-4 py-2 flex gap-2">
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
                  </td>
                </tr>
              ))
            ) : !loading ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                  {selectedFestival ? 'No submissions yet for this festival' : 'Please select a festival'}
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
      {/* Pagination Footer */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            className={`px-4 py-2 rounded border font-semibold ${
              page === 1
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-green-900 border-gray-300'
            }`}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span className="px-4 py-2 text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            className={`px-4 py-2 rounded border font-semibold ${
              page === totalPages
                ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                : 'bg-white text-green-900 border-gray-300'
            }`}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
          </button>
        </div>
      )}
      {/* Modal for status update */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent backdrop-blur-md">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md relative animate-fade-in">
            <button className="absolute top-4 right-4 text-gray-400 hover:text-gray-700" onClick={() => setModal(null)}><FiX size={20} /></button>
            <h2 className="text-xl font-bold text-green-900 mb-1">{modal.film?.title || 'Untitled'}</h2>
            <p className="text-gray-500 mb-4">Review details and submission information</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div>
                <div className="text-xs text-gray-500">Filmmaker</div>
                <div className="font-medium text-gray-900">{modal.filmOwner?.username || 'Unknown'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Genre</div>
                <div className="font-medium text-gray-900">{modal.film?.genre?.join(', ') || 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Duration</div>
                <div className="font-medium text-gray-900">{modal.film?.duration ? `${modal.film.duration} min` : 'N/A'}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Submission ID</div>
                <div className="font-medium text-gray-900">#{modal.id}</div>
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
            <div className="mb-6">
              <div className="text-xs text-gray-500 mb-1">Change Status</div>
              <div className="flex gap-2 mt-1">
                {statusButtons.map((btn) => (
                  <button
                    key={btn.value}
                    type="button"
                    className={`px-3 py-1 rounded font-semibold text-xs focus:outline-none ${btn.color} ${
                      status === btn.value ? 'ring-2 ring-green-900' : ''
                    }`}
                    onClick={() => setStatus(btn.value)}
                  >
                    {btn.label.replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>
            <button
              className="bg-green-900 text-white font-bold px-6 py-2 rounded hover:bg-green-800 w-full"
              onClick={handleStatusUpdate}
            >
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
            <p className="text-gray-500 mb-6">Assign an award to <span className="font-semibold text-gray-900">{awardModal.film?.title || 'this film'}</span></p>
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
                onClick={handleAssignAward}
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
