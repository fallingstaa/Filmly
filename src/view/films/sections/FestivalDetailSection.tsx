'use client';

import React, { useEffect, useState } from 'react';
import { formatDate } from './utils/formatDate';
import { useRouter } from 'next/navigation';

// optional helper — safe require so file still works if festivals.data isn't present

async function fetchFestival(id: string) {
  try {
    const res = await fetch(`/api/events/${id}`);
    if (!res.ok) throw new Error('Failed to fetch event');
    const data = await res.json();
    return data.event;
  } catch {
    return null;
  }
}


export default function FestivalDetailSection({ id }: { id: string }) {
  const [festival, setFestival] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);
    fetchFestival(id)
      .then((data) => {
        if (mounted) {
          if (data) setFestival(data);
          else setError('Festival not found');
        }
      })
      .catch(() => {
        if (mounted) setError('Failed to fetch festival');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, [id]);

  // fallback mock if not found
  const fallbackFestival = {
    id,
    name: 'Sundance Film Festival',
    about:
      'The Sundance Film Festival is an annual film festival organized by the Sundance Institute. It is the largest independent film festival in the United States.',
    aboutShort: "One of the world's premier independent film festivals",
    theme: '“Unseen Truths”',
    location: 'Cambodia',
    dates: 'January 16-26, 2026',
    language: 'Khmer, English, Thai',
    duration: '5-60mn',
    deadline: '2025-12-25',
    contact: 'chatokmuk22@gmail.com.kh',
    image: '/image%202.svg',
    pastWinners: [
      { title: 'The Last Echo', place: '1st Place', director: 'Sarah Johnson', year: '2024' },
      { title: 'Urban Dreams', place: '2nd Place', director: 'Michael Chen', year: '2024' },
      { title: 'Silent Symphony', place: '3rd Place', director: 'Emma Williams', year: '2024' },
    ],
  };

  // Map Supabase event fields to UI fields
  const mappedFestival = festival
    ? {
        id: festival.id,
        name: festival.title || festival.name || 'Untitled Festival',
        about: festival.description || '',
        aboutShort: festival.aboutShort || '',
        theme: festival.theme || '',
        location: festival.location || '',
        dates: festival.dates || '',
        language: festival.language || '',
        duration: festival.duration || '',
        deadline: festival.deadline || '',
        contact: festival.contact || '',
        image: festival.image || '/image%202.svg',
        pastWinners: festival.pastWinners || [],
      }
    : fallbackFestival;

  if (loading) {
    return <div className="p-8 text-center text-[#6F6F6F]">Loading festival details...</div>;
  }
  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full px-6 py-6">
      <div className="space-y-10">
        <article className="bg-white rounded-lg border border-[#E6E6E6] shadow-sm overflow-hidden">
          <header className="bg-gradient-to-b from-[#0D4A2B] to-[#165B36] text-white text-center py-12 rounded-t-lg">
            <h2 className="text-lg font-medium">{mappedFestival.name}</h2>
            <p className="mt-3 text-sm opacity-90">{mappedFestival.aboutShort}</p>
          </header>
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-[#0D4A2B] font-semibold mb-4">About</h3>
                <p className="text-sm text-[#374151] leading-relaxed">{mappedFestival.about}</p>
                <div className="mt-6">
                  <a
                    href={`mailto:${mappedFestival.contact}`}
                    className="inline-block rounded-md bg-[#0C4A2A] px-4 py-2 text-sm font-medium text-white"
                  >
                    {mappedFestival.contact}
                  </a>
                </div>
              </div>
              <div className="flex items-center justify-end">
                <div className="w-44 h-44 bg-[#F3F4F6] rounded-md flex items-center justify-center overflow-hidden">
                  <img src={mappedFestival.image} alt={`${mappedFestival.name} poster`} className="object-cover w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </article>
        <section className="bg-white rounded-lg border border-[#E6E6E6] shadow-sm p-8 min-h-[10rem]">
          <div className="bg-gradient-to-b from-[#0D4A2B] to-[#165B36] text-white text-center py-6 rounded-md mb-6">
            <div className="text-sm opacity-90">Theme</div>
            <div className="mt-2 font-medium">{mappedFestival.theme}</div>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[#0D4A2B] font-semibold mb-3">About</h4>
              <p className="text-sm text-[#374151] leading-relaxed">{mappedFestival.about}</p>
              <div className="mt-6">
                <button
                  className="rounded-md bg-[#0C4A2A] text-white px-4 py-2 text-sm"
                  onClick={() => router.push(`/films/add?festivalId=${mappedFestival.id}`)}
                >
                  Submit Your Film
                </button>
              </div>
            </div>
            <div>
              <ul className="space-y-4 text-sm text-[#374151]">
                <li className="flex gap-3 items-start">
                  <div className="text-[#065F46] text-lg">📍</div>
                  <div>
                    <div className="font-medium text-[#0D4A2B]">Location</div>
                    <div>{mappedFestival.location}</div>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="text-[#065F46] text-lg">📅</div>
                  <div>
                    <div className="font-medium text-[#0D4A2B]">Festival Dates</div>
                    <div>{mappedFestival.dates}</div>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="text-[#065F46] text-lg">🌐</div>
                  <div>
                    <div className="font-medium text-[#0D4A2B]">Language</div>
                    <div className="text-[#065F46]">{mappedFestival.language}</div>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="text-[#065F46] text-lg">⏱️</div>
                  <div>
                    <div className="font-medium text-[#0D4A2B]">Duration</div>
                    <div className="text-[#065F46]">{mappedFestival.duration}</div>
                  </div>
                </li>
                <li className="flex gap-3 items-start">
                  <div className="text-[#065F46] text-lg">🏷️</div>
                  <div>
                    <div className="font-medium text-[#0D4A2B]">Deadline</div>
                    <div>{formatDate(mappedFestival.deadline)}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>
        <section className="bg-white rounded-lg border border-[#E6E6E6] shadow-sm p-8 min-h-[8rem]">
          <h4 className="text-[#0D4A2B] font-semibold mb-4">Submission Deadlines</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-md bg-[#F8FAFB] p-6 min-h-[7rem]">
              <div className="text-sm text-[#6B7280]">Regular Deadline</div>
              <div className="mt-2 text-sm text-[#065F46]">June 1-25, 2025</div>
              <div className="text-sm text-[#9CA3AF] mt-1">Save on submission fees</div>
            </div>
            <div className="rounded-md bg-[#F8FAFB] p-6 min-h-[7rem]">
              <div className="text-sm text-[#6B7280]">Late deadline</div>
              <div className="mt-2 text-sm text-[#065F46]">September 25-5, 2025</div>
              <div className="text-sm text-[#9CA3AF] mt-1">Standard submission</div>
            </div>
          </div>
        </section>
        <section className="bg-white rounded-lg border border-[#E6E6E6] shadow-sm p-8 min-h-[10rem]">
          <h4 className="text-[#0D4A2B] font-semibold mb-6">Past Winners & Laureates</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(mappedFestival.pastWinners ?? []).map((w: any, i: number) => (
              <div key={i} className="rounded border p-4 bg-white">
                <div className="h-36 bg-[#F3F4F6] rounded mb-3 flex items-center justify-center">🎞️</div>
                <div className="text-sm font-medium">{w.title}</div>
                <div className="mt-2 text-xs text-[#6B7280]">Director: {w.director}</div>
                <div className="mt-2 text-xs text-[#6B7280]">{w.year}</div>
                <div className="mt-3">
                  <span className="inline-block rounded-full bg-[#7C3AED] text-white text-xs px-2 py-1">{w.place}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}