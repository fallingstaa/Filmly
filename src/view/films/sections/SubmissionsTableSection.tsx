// SubmissionsTableSection.tsx

'use client';

import React, { useEffect, useRef, useState } from 'react';

type Submission = {
  id: string;
  film: string;
  festival: string;
  eventDate?: string;
  submissionStatus: 'Accepted' | 'Rejected';
  judgingStatus?: 'Under Review' | 'Shortlist' | 'Nominee' | '';
  comments?: string;
  image?: string;
};

async function fetchSubmissions(): Promise<Submission[]> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return [];
    const res = await fetch('/api/submissions', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Map backend fields to Submission type (snake_case from API)
    const mapSubmission = (item: any): Submission => {
      let submissionStatus: 'Accepted' | 'Rejected' = 'Rejected';
      let judgingStatus: 'Under Review' | 'Shortlist' | 'Nominee' | '' = '';
      // Only 'accept' and 'reject' are Submission Status
      if (item.submission_status === 'accept') {
        submissionStatus = 'Accepted';
      } else if (item.submission_status === 'reject') {
        submissionStatus = 'Rejected';
      } else if (item.submission_status === 'under_review') {
        submissionStatus = 'Accepted';
        judgingStatus = 'Under Review';
      } else if (item.submission_status === 'shortlist') {
        submissionStatus = 'Accepted';
        judgingStatus = 'Shortlist';
      } else if (item.submission_status === 'nominee') {
        submissionStatus = 'Accepted';
        judgingStatus = 'Nominee';
      }
      return {
        id: item.id?.toString() ?? '',
        film: item.film?.title ?? '-',
        festival: item.event?.title ?? '-',
        eventDate: item.event?.deadline ?? '-',
        submissionStatus,
        judgingStatus,
        comments: item.comments || '',
        image: item.film?.filmPosterUrl || '/image/10.svg',
      };
    };
    const allSubs = Array.isArray(data.submissions)
      ? data.submissions.map(mapSubmission)
      : [];
    return allSubs;
  } catch (e) {
    console.error('Error fetching submissions:', e);
    return [];
  }
}

export default function SubmissionsTableSection() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Submission | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<Element | null>(null);

  useEffect(() => {
    fetchSubmissions().then((data) => {
      setSubmissions(data);
      setLoading(false);
    });
  }, []);

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
      <section className="rounded-xl border border-[#EDEDED] bg-white shadow-sm w-full">
        <div className="max-h-[340px] overflow-auto">
          <table className="min-w-full table-fixed text-sm">
            <thead>
              <tr className="bg-[#F4F7F6]">
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Film</th>
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Festival</th>
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Submission Status</th>
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Judging Status</th>
                <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Comments</th>
              </tr>
            </thead>

            <tbody className="bg-white">
              {loading ? (
                <tr><td colSpan={5} className="text-center py-8 text-[#8A8A8A]">Loading...</td></tr>
              ) : submissions.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-[#8A8A8A]">No submissions found.</td></tr>
              ) : (
                submissions.map((row, idx) => (
                  <tr
                    key={row.id}
                    className={`${idx < submissions.length - 1 ? 'border-b border-[#E7E7E7]' : ''} hover:bg-[#FBFEFB] cursor-pointer`}
                    role="button"
                    tabIndex={0}
                    aria-label={`View submission details for ${row.film}`}
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
                      {row.submissionStatus === 'Accepted' && row.judgingStatus && row.judgingStatus !== ''
                        ? <JudgingBadge status={row.judgingStatus} />
                        : <span className="text-[#8A8A8A]">-</span>}
                    </td>
                    <td className="px-6 py-4 align-top text-sm text-[#616161] max-w-[380px] break-words">{row.comments}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* Modal centered in middle of screen */}
      {selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="submission-detail-title"
        >
          <div className="absolute inset-0 bg-black/40" onClick={() => setSelected(null)} aria-hidden="true" />

          <div className="relative z-10 max-w-[1100px] w-full">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* left: details — scrollable if content grows */}
                <div className="flex-1 p-6 overflow-auto max-h-[70vh]">
                  <div className="flex items-start justify-between">
                    <h3 id="submission-detail-title" className="text-lg font-semibold text-[#0B3F20]">Submission Detail</h3>
                    <button
                      ref={closeButtonRef}
                      onClick={() => setSelected(null)}
                      aria-label="Close submission detail"
                      className="ml-4 rounded-md px-3 py-1 text-sm text-[#4B4B4B] hover:bg-[#F4F4F4]"
                    >
                      ×
                    </button>
                  </div>

                  <div className="mt-4 rounded-md border border-[#EDEDED] bg-white p-4 shadow-sm">
                    <table className="w-full text-sm">
                      <thead className="text-left sticky top-0 bg-white">
                        <tr className="text-[#6B6B6B]">
                          <th className="py-2">Film</th>
                          <th className="py-2">Festival</th>
                          <th className="py-2">Event Date</th>
                          <th className="py-2">Judging Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="py-4 w-1/4">{selected.film}</td>
                          <td className="py-4 w-1/4 text-[#4D4D4D]">{selected.festival}</td>
                          <td className="py-4 w-1/6">{selected.eventDate ?? '-'}</td>
                          <td className="py-4 w-1/4">
                            {selected.judgingStatus && selected.judgingStatus !== '-' ? <JudgingBadge status={selected.judgingStatus} /> : <span className="text-[#8A8A8A]">-</span>}
                          </td>
                        </tr>
                      </tbody>
                    </table>

                    <div className="mt-4 text-sm text-[#616161]">
                      <strong>Comments:</strong>
                      <p className="mt-1 whitespace-pre-wrap">{selected.comments}</p>
                    </div>
                  </div>
                </div>

                {/* right: poster/image */}
                <div className="w-full md:w-[300px] p-6 border-t md:border-t-0 md:border-l border-[#F0F0F0] flex items-center justify-center bg-white">
                  <img src={selected.image ?? '/image/10.svg'} alt={`${selected.film} poster`} className="max-h-[60vh] object-contain" />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


function SubmissionBadge({ status }: { status: 'Accepted' | 'Rejected' }) {
  if (status === 'Accepted') return <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#43B26C] text-white">Accept</span>;
  return <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#E14C4C] text-white">Reject</span>;
}

function JudgingBadge({ status }: { status: Submission['judgingStatus'] }) {
  if (!status) return null;
  if (status === 'Under Review') return <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#4285F4] text-white">Under Review</span>;
  if (status === 'Shortlist') return <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#FBC02D] text-white">Shortlist</span>;
  if (status === 'Nominee') return <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#7E57C2] text-white">Nominee</span>;
  return null;
}