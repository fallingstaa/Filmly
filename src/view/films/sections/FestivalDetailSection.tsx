'use client';

import React from 'react';
import { formatDate } from './utils/formatDate';
import { useRouter } from 'next/navigation';

// optional helper — safe require so file still works if festivals.data isn't present
function tryGetFestival(id: string) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require('./festivals.data');
    if (mod && typeof mod.getFestivalById === 'function') return mod.getFestivalById(id);
  } catch {
    /* ignore */
  }
  return null;
}

export default function FestivalDetailSection({ id }: { id: string }) {
  const festival = tryGetFestival(id) ?? {
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

  const router = useRouter();

  return (
    // outer wrapper: full width and small horizontal padding so content sits just next to sidebar
    <div className="w-full px-6 py-6">
      {/* vertical spacing between major sections */}
      <div className="space-y-10">
        {/* Connected card: header band + about/poster inside one rounded card */}
        <article className="bg-white rounded-lg border border-[#E6E6E6] shadow-sm overflow-hidden">
          {/* header band (rounded top corners) */}
          <header className="bg-gradient-to-b from-[#0D4A2B] to-[#165B36] text-white text-center py-12 rounded-t-lg">
            <h2 className="text-lg font-medium">{festival.name}</h2>
            <p className="mt-3 text-sm opacity-90">{festival.aboutShort}</p>
          </header>

          {/* about + poster inside same card */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
              <div>
                <h3 className="text-[#0D4A2B] font-semibold mb-4">About</h3>
                <p className="text-sm text-[#374151] leading-relaxed">{festival.about}</p>

                <div className="mt-6">
                  <a
                    href={`mailto:${festival.contact}`}
                    className="inline-block rounded-md bg-[#0C4A2A] px-4 py-2 text-sm font-medium text-white"
                  >
                    {festival.contact}
                  </a>
                </div>
              </div>

              <div className="flex items-center justify-end">
                <div className="w-44 h-44 bg-[#F3F4F6] rounded-md flex items-center justify-center overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={festival.image} alt={`${festival.name} poster`} className="object-cover w-full h-full" />
                </div>
              </div>
            </div>
          </div>
        </article>

        {/* Theme card (separate card with breathing room) */}
        <section className="bg-white rounded-lg border border-[#E6E6E6] shadow-sm p-8 min-h-[10rem]">
          <div className="bg-gradient-to-b from-[#0D4A2B] to-[#165B36] text-white text-center py-6 rounded-md mb-6">
            <div className="text-sm opacity-90">Theme</div>
            <div className="mt-2 font-medium">{festival.theme}</div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <h4 className="text-[#0D4A2B] font-semibold mb-3">About</h4>
              <p className="text-sm text-[#374151] leading-relaxed">{festival.about}</p>

              <div className="mt-6">
                <button
                  className="rounded-md bg-[#0C4A2A] text-white px-4 py-2 text-sm"
                  onClick={() => router.push(`/films/add?festivalId=${festival.id}`)}
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
                    <div>{festival.location}</div>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <div className="text-[#065F46] text-lg">📅</div>
                  <div>
                    <div className="font-medium text-[#0D4A2B]">Festival Dates</div>
                    <div>{festival.dates}</div>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <div className="text-[#065F46] text-lg">🌐</div>
                  <div>
                    <div className="font-medium text-[#0D4A2B]">Language</div>
                    <div className="text-[#065F46]">{festival.language}</div>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <div className="text-[#065F46] text-lg">⏱️</div>
                  <div>
                    <div className="font-medium text-[#0D4A2B]">Duration</div>
                    <div className="text-[#065F46]">{festival.duration}</div>
                  </div>
                </li>

                <li className="flex gap-3 items-start">
                  <div className="text-[#065F46] text-lg">🏷️</div>
                  <div>
                    <div className="font-medium text-[#0D4A2B]">Deadline</div>
                    <div>{formatDate(festival.deadline)}</div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* Deadlines card */}
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

        {/* Past winners */}
        <section className="bg-white rounded-lg border border-[#E6E6E6] shadow-sm p-8 min-h-[10rem]">
          <h4 className="text-[#0D4A2B] font-semibold mb-6">Past Winners & Laureates</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {(festival.pastWinners ?? []).map((w: any, i: number) => (
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