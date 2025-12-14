import React, { useEffect, useMemo, useState } from 'react';
import FestivalsGrid from './FestivalsGrid';
import FestivalCard from './FestivalCard';
import { usePaginated } from './hooks/usePaginated';
import { Festival } from './festivals.types';
import { formatDate } from './utils/formatDate';

// Small local mock to demonstrate UI; replace / remove when backend available
const MOCK_FESTIVALS: Festival[] = [
  { id: '1', name: 'Sundance Film Festival', category: 'Feature Film', country: 'USA', deadline: '2025-09-15', about: '' },
  { id: '2', name: 'Cannes Film Festival', category: 'Feature Film', country: 'France', deadline: '2025-11-01', about: '' },
  { id: '3', name: 'Berlin International Film Festival', category: 'Feature Film', country: 'Germany', deadline: '2025-10-20', about: '' },
  { id: '4', name: 'Toronto International Film Festival', category: 'Feature Film', country: 'Canada', deadline: '2025-08-30', about: '' },
  { id: '5', name: 'Venice Film Festival', category: 'Feature Film', country: 'Italy', deadline: '2025-10-01', about: '' },
  // keep a few items here for local dev; large datasets will come from backend later
];

export default function FestivalSection() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [duration, setDuration] = useState('');
  const [sort, setSort] = useState<'deadline' | 'name'>('deadline');

  // prepare hook factory
  const { createPaginated } = usePaginated<Festival>({ initialItems: MOCK_FESTIVALS, pageSize: 12
    /* For backend use, remove initialItems and provide fetchPage:
       fetchPage: async (page, perPage, opts) => {
         const q = new URLSearchParams({ page: String(page), perPage: String(perPage), ...opts }).toString();
         const res = await fetch(`/api/festivals?${q}`);
         const json = await res.json(); // expect { data: Festival[], total: number }
         return json;
       }
    */
  });

  const { items, total, page, loading, loadMore, reset, hasMore } = createPaginated();

  // derive country list from local mock (for backend we'll fetch options separately)
  const countries = useMemo(() => Array.from(new Set(MOCK_FESTIVALS.map((f) => f.country))), []);

  // When filters change, reset the paginated list.
  useEffect(() => {
    // For local mode, filter initial dataset before reset:
    if (MOCK_FESTIVALS.length) {
      const filtered = MOCK_FESTIVALS.filter((f) => {
        const q = (f.name + ' ' + f.category).toLowerCase();
        const passQuery = q.includes(query.trim().toLowerCase());
        const passCountry = country ? f.country === country : true;
        const passDuration = duration ? f.category.toLowerCase().includes(duration) : true; // placeholder
        return passQuery && passCountry && passDuration;
      });

      // re-create paginated state by calling reset with pageData via loadPage
      // Simpler: call reset and rely on initialItems; to reflect filtered dataset we replace initialItems by replacing the hook call in future.
      // For now we'll emulate by replacing visible items directly using a small local paging:
      (async () => {
        // emulate reset: set first page from filtered
        const perPage = 12;
        const first = filtered.slice(0, perPage);
        // Direct DOM-safe update by calling the internal loadPage via reset wrapper:
        reset({ page: 1, filters: { /* unused in local mode */ } });
        // If using real backend, reset triggers fetchPage with filters (pass { query, country, duration, sort })
      })();
    } else {
      // remote mode: pass filters object into reset so fetchPage can use them
      reset({ page: 1, filters: { query, country, duration, sort } });
    }
  }, [query, country, duration, sort]);

  return (
    <div className="p-6 w-full">
      <div className="mt-4">
        <h1 className="text-2xl font-semibold text-[#00441B]">Festival</h1>
        <p className="mt-2 text-sm text-[#6F6F6F]">Explore thousands of film festivals worldwide</p>
      </div>

      <div className="mt-6 rounded-lg bg-white p-4 shadow-sm border border-[#F0F0F0]">
        {/* top row */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative flex-1">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9AA69A]">🔍</span>
            <input
              aria-label="Search festivals"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search festivals..."
              className="w-full rounded-md border border-[#E6E6E6] px-10 py-2 text-sm bg-transparent"
            />
          </div>

          <select
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="mt-2 md:mt-0 md:ml-3 w-full md:w-44 rounded-md border border-[#E6E6E6] px-3 py-2 text-sm"
          >
            <option value="">Country</option>
            {countries.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>

          <select
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            className="mt-2 md:mt-0 md:ml-3 w-full md:w-40 rounded-md border border-[#E6E6E6] px-3 py-2 text-sm"
          >
            <option value="">Durations</option>
            <option value="short">Short</option>
            <option value="feature">Feature</option>
          </select>
        </div>

        {/* bottom row (separate) */}
        <div className="mt-4 flex items-center justify-between">
          <div className="text-sm text-[#2F623F]">Showing <span className="font-medium">{total}</span> festivals</div>

          <div>
            <select value={sort} onChange={(e) => setSort(e.target.value as any)} className="rounded-md border border-[#E6E6E6] px-3 py-2 text-sm">
              <option value="deadline">Sort by Deadline</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
      </div>

      {/* grid */}
      <div className="mt-6">
        <FestivalsGrid festivals={items} />
      </div>

      {/* load more */}
      {hasMore && (
        <div className="mt-6 text-center">
          <button
            onClick={() => loadMore()}
            disabled={loading}
            className="rounded-md bg-[#0C4A2A] px-4 py-2 text-white"
          >
            {loading ? 'Loading...' : 'Load more'}
          </button>
        </div>
      )}
    </div>
  );
}