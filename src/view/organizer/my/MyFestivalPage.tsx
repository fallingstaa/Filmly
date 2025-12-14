'use client';
import { useState, useEffect } from 'react';
import FestivalDetailCard from './FestivalDetailCard';
import { getMyEvents, deleteEvent } from '@/api/organizerApi';
import { useRouter } from 'next/navigation';

const PAGE_SIZE = 10;

export default function MyFestivalPage() {
  const router = useRouter();
  const [selected, setSelected] = useState('All Festivals');
  const [page, setPage] = useState(1);
  const [selectedFestival, setSelectedFestival] = useState(null as any);
  const [festivals, setFestivals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    fetchFestivals();
  }, [page]);

  const fetchFestivals = async () => {
    try {
      setLoading(true);
      const offset = (page - 1) * PAGE_SIZE;
      const response = await getMyEvents(undefined, PAGE_SIZE, offset);
      setFestivals(response.events || []);
      setTotalCount(response.count || 0);
    } catch (err: any) {
      console.error('Error fetching festivals:', err);
      setError(err.message || 'Failed to load festivals');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (eventId: number) => {
    if (!confirm('Are you sure you want to delete this festival?')) {
      return;
    }

    try {
      await deleteEvent(eventId);
      // Refresh the list
      fetchFestivals();
      setSelectedFestival(null);
    } catch (err: any) {
      alert('Failed to delete festival: ' + err.message);
    }
  };

  const totalPages = Math.ceil(totalCount / PAGE_SIZE) || 1;

  if (selectedFestival) {
    return (
      <FestivalDetailCard
        festival={selectedFestival}
        onClose={() => setSelectedFestival(null)}
        onDelete={handleDelete}
      />
    );
  }

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading festivals...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error loading festivals</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
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
        <h2 className="text-green-900 font-semibold text-base mb-4">All Your Festivals</h2>
        {festivals.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
            {festivals.map((fest) => (
              <div
                key={fest.id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col aspect-square overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedFestival(fest)}
              >
                <div className="bg-gray-100 flex items-center justify-center w-full h-1/2 min-h-[80px]">
                  <span className="text-2xl text-gray-400">🎬</span>
                </div>
                <div className="px-4 py-3 flex-1 flex flex-col justify-end">
                  <div className="font-medium text-gray-900 mb-1 truncate" title={fest.title}>
                    {fest.title}
                  </div>
                  <div className="text-gray-500 text-sm">
                    Deadline: {fest.deadline ? new Date(fest.deadline).toLocaleDateString() : 'N/A'}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 mb-4">No festivals created yet</p>
            <button
              onClick={() => router.push('/organizer/create')}
              className="bg-green-900 text-white px-6 py-2 rounded hover:bg-green-800"
            >
              Create Your First Festival
            </button>
          </div>
        )}</div>
        {/* Pagination Footer */}
        {festivals.length > 0 && totalPages > 1 && (
          <div className="flex justify-center mt-8 gap-2 items-center">
            <button
              className={`px-4 py-2 rounded-lg border font-semibold transition ${page === 1 ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-green-900 border-gray-300 hover:bg-green-50'}`}
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              Previous
            </button>
            <span className="px-4 py-2 text-gray-700">
              Page {page} of {totalPages}
            </span>
            <button
              className={`px-4 py-2 rounded-lg border font-semibold transition ${page === totalPages ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' : 'bg-white text-green-900 border-gray-300 hover:bg-green-50'}`}
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
