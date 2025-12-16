'use client';

import React, { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type Match = {
  id?: string;
  festival?: string;
  score?: number;
  type?: string;
  country?: string;
  deadline?: string;
  matchReasons?: string[];
  daysUntilDeadline?: number;
  eventId?: number;
};

type Props = {
  matches: Match[];         // already paged items to render
  boxWidth: string;
  boxHeight: string;
  columns: number;
  gapPx: number;
};

export default function MatchingResultsGridSection({
  matches = [],
  boxWidth = '220px',
  boxHeight = '220px',
  columns = 3,
  gapPx = 16,
}: Props) {
  const router = useRouter();

  const TOTAL_PAGES = 5;
  const PAGE_SIZE = 10; // 2 rows * 5 columns = 10 items per page
  const ROWS = 2;
  const [page, setPage] = useState(1);

  const totalItems = matches.length;
  const effectiveTotalPages = Math.max(
    1,
    Math.min(TOTAL_PAGES, Math.ceil(totalItems / PAGE_SIZE) || TOTAL_PAGES)
  );

  const pageItems = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return matches.slice(start, start + PAGE_SIZE);
  }, [matches, page]);

  const displayColumns = 5; // exactly 5 columns per row
  const slotsPerPage = displayColumns * ROWS;

  function openFestivalDetail(match: Match) {
    const festivalId = match.eventId || match.id;
    if (festivalId) {
      router.push(`/films/festival/${festivalId}`);
    }
  }

  function goPrev() {
    setPage((p) => Math.max(1, p - 1));
  }

  function goNext() {
    setPage((p) => Math.min(effectiveTotalPages, p + 1));
  }

  function handleAddFilm() {
    router.push('/films/add');
  }

  return (
    <div className="w-full">
      {/* Centered Prev / Next pagination above the grid */}
      <div className="w-full flex justify-center mb-6">
        <nav className="inline-flex items-center space-x-3" aria-label="Pagination">
          <button
            onClick={goPrev}
            disabled={page === 1}
            className={`px-3 py-1 rounded-md text-sm ${page === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            aria-label="Previous page"
          >
            Prev
          </button>

          {/* numeric indicators (optional) */}
          <div className="inline-flex items-center space-x-2">
            {Array.from({ length: effectiveTotalPages }).map((_, i) => {
              const p = i + 1;
              const active = p === page;
              return (
                <button
                  key={p}
                  onClick={() => setPage(p)}
                  className={`px-3 py-1 rounded-md text-sm ${active ? 'bg-[#0C4A2A] text-white' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
                  aria-current={active ? 'page' : undefined}
                >
                  {p}
                </button>
              );
            })}
          </div>

          <button
            onClick={goNext}
            disabled={page === effectiveTotalPages}
            className={`px-3 py-1 rounded-md text-sm ${page === effectiveTotalPages ? 'bg-gray-100 text-gray-400' : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            aria-label="Next page"
          >
            Next
          </button>
        </nav>
      </div>

      {/* grid: 2 rows × 5 columns */}
      <div
        className="grid"
        style={{
          gridTemplateColumns: `repeat(${displayColumns}, ${boxWidth})`,
          gap: `${gapPx}px`,
        }}
      >
        {(pageItems || []).map((m) => (
          <div
            key={m.id}
            className="rounded-lg border bg-white shadow-sm flex flex-col justify-between p-4"
            style={{ height: boxHeight }}
          >
            <div>
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 bg-gray-100 rounded-md flex items-center justify-center text-xl">🎬</div>

                <div className="flex-1">
                  <div className="text-sm font-semibold leading-snug text-[#065F46]">{m.festival}</div>
                  <div className="text-xs text-gray-500 mt-1">{m.type}</div>
                </div>

                <div className="ml-2">
                  <div className="bg-[#0C4A2A] text-white rounded-md px-3 py-2 text-center">
                    <div className="text-sm font-bold">{m.score}%</div>
                    <div className="text-xs">Match</div>
                  </div>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="text-[#065F46]">📍</span>
                  <span className="truncate">{m.country || 'N/A'}</span>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-[#065F46]">📅</span>
                  <span className="truncate">
                    {m.daysUntilDeadline !== undefined
                      ? `${m.daysUntilDeadline} days left`
                      : `Deadline: ${m.deadline || 'TBD'}`}
                  </span>
                </div>

                {m.matchReasons && m.matchReasons.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <div className="text-xs text-[#065F46] font-medium">Match Reasons:</div>
                    <ul className="mt-1 space-y-1">
                      {m.matchReasons.slice(0, 2).map((reason, idx) => (
                        <li key={idx} className="text-xs text-gray-600 flex items-start gap-1">
                          <span className="text-[#065F46] mt-0.5">•</span>
                          <span className="line-clamp-2">{reason}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>

            <div className="mt-4">
              <button
                onClick={() => openFestivalDetail(m)}
                className="w-full bg-[#0C4A2A] text-white py-2 rounded-md text-sm font-medium hover:opacity-95"
                aria-label={`View ${m.festival || 'festival'} details`}
              >
                View Details
              </button>
            </div>
          </div>
        ))}

        {/* fill empty slots to keep layout stable */}
        {pageItems.length < slotsPerPage &&
          Array.from({ length: Math.max(0, slotsPerPage - pageItems.length) }).map((_, idx) => (
            <div
              key={`empty-${idx}`}
              className="rounded-lg border bg-transparent"
              style={{ height: boxHeight }}
            />
          ))}
      </div>
    </div>
  );
}