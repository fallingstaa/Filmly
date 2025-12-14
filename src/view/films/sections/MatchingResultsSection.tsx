'use client';

import React, { useEffect, useState } from 'react';
import MatchingResultsHeaderSection from './MatchingResultsHeaderSection';
import MatchingResultsGridSection from './MatchingResultsGridSection';

type Film = { id: string; title: string };
type Match = { id: string; festival: string; score: number; type: string; country: string; deadline: string; };

const SAMPLE_FILMS: Film[] = [
  { id: 'f1', title: 'Midnight Dreams' },
  { id: 'f2', title: 'Urban Echoes' },
  { id: 'f3', title: 'Silent Waves' },
];

const MATCHES: Record<string, Match[]> = {
  f1: Array.from({ length: 40 }).map((_, i) => ({
    id: `m${i + 1}`,
    festival: `Festival ${i + 1}`,
    score: 95 - (i % 20),
    type: i % 3 === 0 ? 'Feature Film' : 'Short Film',
    country: ['USA', 'UK', 'France', 'Italy', 'Spain'][i % 5],
    deadline: `Oct ${10 + (i % 20)}, 2025`,
  })),
  f2: Array.from({ length: 12 }).map((_, i) => ({
    id: `n${i + 1}`,
    festival: `TIFF ${i + 1}`,
    score: 88 - i,
    type: 'Feature Film',
    country: 'Canada',
    deadline: `Aug ${10 + i}, 2025`,
  })),
  f3: Array.from({ length: 10 }).map((_, i) => ({
    id: `p${i + 1}`,
    festival: `ShortFest ${i + 1}`,
    score: 80 - i,
    type: 'Short Film',
    country: 'USA',
    deadline: `Sep ${5 + i}, 2025`,
  })),
};

export default function MatchingResultsSection() {
  const [selectedFilmId, setSelectedFilmId] = useState<string>(SAMPLE_FILMS[0].id);
  const [selectedFilmTitle, setSelectedFilmTitle] = useState<string>(SAMPLE_FILMS[0].title);
  const [matches, setMatches] = useState<Match[]>(MATCHES[SAMPLE_FILMS[0].id] || []);

  // keep layout values for grid
  const COLUMNS = 4;
  const BOX_W = '294.22px';
  const BOX_H = '338.33px';
  const GAP_PX = 16;

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const qId = params.get('filmId');
    const qTitle = params.get('title');
    if (qId && SAMPLE_FILMS.find((f) => f.id === qId)) {
      const film = SAMPLE_FILMS.find((f) => f.id === qId)!;
      setSelectedFilmId(film.id);
      setSelectedFilmTitle(film.title);
      setMatches(MATCHES[film.id] ?? []);
      return;
    }
    if (qTitle) {
      const film = SAMPLE_FILMS.find((f) => f.title === qTitle);
      if (film) {
        setSelectedFilmId(film.id);
        setSelectedFilmTitle(film.title);
        setMatches(MATCHES[film.id] ?? []);
      }
    }
  }, []);

  function onSelectChange(id: string) {
    const film = SAMPLE_FILMS.find((f) => f.id === id)!;
    setSelectedFilmId(film.id);
    setSelectedFilmTitle(film.title);
    setMatches(MATCHES[film.id] ?? []);
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      params.set('filmId', film.id);
      params.set('title', film.title);
      window.history.replaceState({}, '', `${window.location.pathname}?${params.toString()}`);
    }
  }

  return (
    <div className="rounded-xl border border-[#EDEDED] bg-white p-4 shadow-sm w-full">
      <MatchingResultsHeaderSection
        films={SAMPLE_FILMS}
        matchesCount={matches.length}
        selectedFilmId={selectedFilmId}
        selectedFilmTitle={selectedFilmTitle}
        onSelectChange={onSelectChange}
        boxHeight={BOX_H}
      />

      {/* Removed duplicate pagination here — MatchingResultsGridSection now shows centered Prev/Next above grid */}
      <MatchingResultsGridSection
        matches={matches}          // pass full list; grid will paginate (2 rows x 5 cols)
        boxWidth={BOX_W}
        boxHeight={BOX_H}
        columns={COLUMNS}
        gapPx={GAP_PX}
      />
    </div>
  );
}