'use client';

import React, { useEffect, useRef, useState } from 'react';
// We import the type from the parent to fix the build errors
import { Submission } from './SubmissionsPageWithFilters';

type SubmissionsTableSectionProps = {
  submissions: Submission[];
  loading: boolean;
  onAwardsMapChange?: (awardsMap: Record<string, string[]>) => void;
};

export default function SubmissionsTableSection({ 
  submissions, 
  loading, 
  onAwardsMapChange 
}: SubmissionsTableSectionProps) {
  const [selected, setSelected] = useState<Submission | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<Element | null>(null);
  const [awardsMap, setAwardsMap] = useState<Record<string, string[]>>({});

  // Fetch awards for all unique eventIds in submissions
  useEffect(() => {
    if (submissions && submissions.length > 0) {
      console.log('Submissions eventId/filmId mapping:');
      submissions.forEach((s) => {
        console.log(`Submission id=${s.id}, eventId=${s.eventId}, filmId=${s.filmId}`);
      });
    }

    async function fetchAwards() {
      const eventFilmPairs = submissions
        .filter(s => s.eventId && s.filmId)
        .map(s => ({ eventId: s.eventId, filmId: s.filmId, submissionId: s.id }));
      
      const uniqueEvents = Array.from(new Set(eventFilmPairs.map(p => p.eventId)));
      const newAwardsMap: Record<string, string[]> = {};

      for (const eventId of uniqueEvents) {
        try {
          const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
          if (!token) {
            console.warn('[SubmissionsTableSection] No token, skipping event', eventId);
            continue;
          }

          const url = `https://filmly-backend.vercel.app/api/events/${eventId}/winners`;
          console.log('[SubmissionsTableSection] Fetching awards for eventId:', eventId, 'URL:', url);
          
          const res = await fetch(url, {
            headers: { Authorization: `Bearer ${token}` },
            cache: 'no-store',
          });

          console.log(`[SubmissionsTableSection] Response status for eventId ${eventId}:`, res.status);
          
          if (res.status === 404) {
            eventFilmPairs.filter(p => p.eventId === eventId).forEach(pair => {
              newAwardsMap[pair.submissionId] = [];
            });
            continue;
          }

          if (!res.ok) continue;

          const data = await res.json();
          console.log(`[SubmissionsTableSection] Fetched winners for eventId=${eventId}:`, data.winners);
          
          for (const pair of eventFilmPairs.filter(p => p.eventId === eventId)) {
            const awards = Array.isArray(data.winners)
              ? data.winners
                  .filter((w: any) => {
                    const isUserFilm = String(w.filmId) === String(pair.filmId);
                    const hasCategory = typeof w.category === 'string' && w.category.trim() !== '';
                    return isUserFilm && hasCategory;
                  })
                  .map((w: any) => w.category || '-')
              : [];
            newAwardsMap[pair.submissionId] = awards.length > 0 ? awards : [];
          }
        } catch (e) {
          console.error('[SubmissionsTableSection] Error fetching winners', e);
        }
      }
      setAwardsMap(newAwardsMap);
      if (onAwardsMapChange) onAwardsMapChange(newAwardsMap);
    }

    if (submissions && submissions.length > 0) {
      fetchAwards();
    }
  }, [submissions, onAwardsMapChange]);

  // Modal accessibility / keyboard logic
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape' && selected) setSelected(null);
    }
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [selected]);

  useEffect(() => {
    if (selected) {
      previouslyFocused.current = document.activeElement;
      setTimeout(() => closeButtonRef.current?.focus(), 0);
      document.body.style.overflow = 'hidden';
    } else {
      (previouslyFocused.current as HTMLElement | null)?.focus?.();
      document.body.style.overflow = '';
    }
  }, [selected]);

  return (
    <>
      <section className="rounded-xl border border-[#EDEDED] bg-white shadow-sm w-full p-2 md:p-4">
        <div className="max-h-[340px] overflow-auto">
          <table className="min-w-full table-fixed text-sm">
            <thead>
              <tr className="bg-[#F4F7F6]">
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Film</th>
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Festival</th>
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Submission Status</th>
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Judging Status</th>
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Award</th>
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Comments</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {loading ? (
                <tr><td colSpan={6} className="text-center py-8 text-[#8A8A8A]">Loading...</td></tr>
              ) : submissions.length === 0 ? (
                <tr><td colSpan={6} className="text-center py-8 text-[#8A8A8A]">No submissions found.</td></tr>
              ) : (
                submissions.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`${idx < submissions.length - 1 ? 'border-b border-[#E7E7E7]' : ''} hover:bg-[#FBFEFB] cursor-pointer`}
                    role="button"
                    tabIndex={0}
                    onClick={() => setSelected(row)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelected(row);
                      }
                    }}
                  >
                    <td className="px-6 py-4 align-top max-w-[260px] break-words">{row.film}</td>
                    <td className="px-6 py-4 align-top text-[#4D4D4D] max-w-[240px] break-words">{row.festival}</td>
                    <td className="px-6 py-4 align-top"><SubmissionBadge status={row.submissionStatus} /></td>
                    <td className="px-6 py-4 align-top">
                      {row.submissionStatus === 'Accepted' && row.judgingStatus && row.judgingStatus !== '' && row.judgingStatus !== '-' ? (
                        <JudgingBadge status={row.judgingStatus} />
                      ) : (
                        <span className="text-[#8A8A8A]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top">
                      {awardsMap[row.id] && awardsMap[row.id].length > 0 ? (
                        <div className="flex flex-wrap gap-1">
                          {awardsMap[row.id].map((award, i) => (
                            <span key={i} className="inline-block bg-[#E9F5EE] text-[#43B26C] px-2 py-1 rounded text-xs font-medium border border-[#C7E8D7] mr-1 mb-1">
                              {award}
                            </span>
                          ))}
                        </div>
                      ) : (
                        <span className="text-[#8A8A8A]">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-[#616161] max-w-[380px] break-words">{row.comments}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal - The full details section you had before */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setSelected(null)} />
          <div className="relative z-10 w-full max-w-3xl">
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-[#EDEDED] flex flex-col md:flex-row">
              <div className="w-full md:w-1/3 bg-gradient-to-b from-[#F4F7F6] to-white flex items-center justify-center p-6 border-b md:border-b-0 md:border-r border-[#F0F0F0]">
                <img
                  src={selected.image || '/image/10.svg'}
                  alt={`${selected.film} poster`}
                  className="max-h-[320px] w-auto rounded-lg shadow-md object-contain border border-[#EDEDED] bg-white"
                />
              </div>
              <div className="flex-1 flex flex-col p-6 md:p-8 relative">
                <button
                  ref={closeButtonRef}
                  onClick={() => setSelected(null)}
                  className="absolute top-4 right-4 rounded-full w-9 h-9 flex items-center justify-center text-xl text-[#4B4B4B] hover:bg-[#F4F4F4]"
                >
                  ×
                </button>
                <h3 className="text-2xl font-bold text-[#0B3F20] mb-2">{selected.film}</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="inline-block bg-[#F4F7F6] text-[#2D6A4F] px-3 py-1 rounded-full text-xs font-semibold">{selected.festival}</span>
                  <span className="inline-block bg-[#F4F7F6] text-[#616161] px-3 py-1 rounded-full text-xs">{selected.eventDate || '-'}</span>
                  {selected.judgingStatus && selected.judgingStatus !== '-' && <JudgingBadge status={selected.judgingStatus} />}
                </div>
                <div className="mb-4">
                  <div className="text-sm font-semibold text-[#2D6A4F] mb-1">Award(s)</div>
                  <div className="flex flex-wrap gap-2 min-h-[24px]">
                    {awardsMap[selected.id] && awardsMap[selected.id].length > 0 ? (
                      awardsMap[selected.id].map((award, i) => (
                        <span key={i} className="inline-block bg-[#E9F5EE] text-[#43B26C] px-2 py-1 rounded text-xs font-medium border border-[#C7E8D7]">{award}</span>
                      ))
                    ) : <span className="text-[#8A8A8A]">-</span>}
                  </div>
                </div>
                <div>
                  <div className="text-sm font-semibold text-[#616161] mb-1">Comments</div>
                  <div className="text-base text-[#444] whitespace-pre-wrap min-h-[24px]">{selected.comments || <span className="text-[#8A8A8A]">No comments</span>}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// Badge Components
function SubmissionBadge({ status }: { status: 'Accepted' | 'Rejected' }) {
  const color = status === 'Accepted' ? 'bg-[#43B26C]' : 'bg-[#E14C4C]';
  return <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${color} text-white`}>{status === 'Accepted' ? 'Accept' : 'Reject'}</span>;
}

function JudgingBadge({ status }: { status: Submission['judgingStatus'] }) {
  if (!status || status === '' || status === '-') return null;
  const colors: Record<string, string> = {
    'Under Review': 'bg-[#4285F4]',
    'Shortlist': 'bg-[#FBC02D]',
    'Nominee': 'bg-[#7E57C2]'
  };
  return <span className={`inline-flex items-center px-3 py-1 rounded text-xs font-medium ${colors[status] || 'bg-gray-400'} text-white`}>{status}</span>;
}