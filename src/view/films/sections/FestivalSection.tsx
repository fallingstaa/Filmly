import React, { useEffect, useMemo, useState } from 'react';
import FestivalsGrid from './FestivalsGrid';
import FestivalCard from './FestivalCard';
import { usePaginated } from './hooks/usePaginated';
import { Festival } from './festivals.types';
import { formatDate } from './utils/formatDate';


type Event = {
  id: string;
  name: string;
  category?: string;
  country?: string;
  deadline?: string;
};


export default function FestivalSection() {
  const [query, setQuery] = useState('');
  const [country, setCountry] = useState('');
  const [duration, setDuration] = useState('');
  const [sort, setSort] = useState<'deadline' | 'name'>('deadline');
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvents() {
      setLoading(true);
      try {
        const res = await fetch('/api/events');
        if (!res.ok) throw new Error('Failed to fetch events');
        const data = await res.json();
        // Map backend fields to frontend Event type
        const mappedEvents = Array.isArray(data.events)
          ? data.events.map((e: any) => ({
              id: e.id,
              name: e.title, // backend 'title' -> frontend 'name'
              category: Array.isArray(e.genre) ? e.genre.join(', ') : e.genre, // genre array to string
              country: e.location, // backend 'location' -> frontend 'country'
              deadline: e.deadline,
              // add other fields if needed
            }))
          : [];
        setEvents(mappedEvents);
      } catch {
        setEvents([]);
      }
      setLoading(false);
    }
    fetchEvents();
  }, []);

  // Filter and sort events for display
  const filtered = useMemo(() => {
    let filtered = events;
    if (query.trim()) {
      filtered = filtered.filter(f => (f.name + ' ' + (f.category || '')).toLowerCase().includes(query.trim().toLowerCase()));
    }
    if (country) {
      filtered = filtered.filter(f => f.country === country);
    }
    if (duration) {
      filtered = filtered.filter(f => (f.category || '').toLowerCase().includes(duration));
    }
    if (sort === 'deadline') {
      filtered = [...filtered].sort((a, b) => (a.deadline || '').localeCompare(b.deadline || ''));
    } else if (sort === 'name') {
      filtered = [...filtered].sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }
    return filtered;
  }, [events, query, country, duration, sort]);

  const countries = useMemo(() => Array.from(new Set(events.map((f) => f.country).filter(Boolean))), [events]);

  return (

    <div className="p-6 w-full">
      <section className="rounded-xl border border-[#EDEDED] bg-white px-4 py-4 shadow-sm md:px-6 md:py-5 w-full mb-4 mt-4">
        <h1 className="text-2xl font-semibold text-[#00441B]">Festival</h1>
        <p className="mt-2 text-sm text-[#6F6F6F]">Explore thousands of film festivals worldwide</p>
      </section>

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
          <div className="text-sm text-[#2F623F]">Showing <span className="font-medium">{filtered.length}</span> festivals</div>

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
        {loading ? (
          <div className="text-center text-[#6F6F6F] py-12">Loading events...</div>
        ) : (
          <FestivalsGrid festivals={filtered as any} />
        )}
      </div>
    </div>
  );
}