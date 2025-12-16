"use client";
import React, { useEffect, useState } from 'react';

type Film = {
  id: number;
  uid?: number;
  genre?: any[];
  title: string;
  s3_link?: string | null;
  duration?: number | null;
  language?: string;
  description?: string | null;
  subtitle_file?: string | null;
};

type Event = {
  id: number;
  uid?: number;
  genre?: any[];
  title: string;
  deadline?: string;
  duration?: number;
  language?: string;
  location?: string;
  created_at?: string;
  updated_at?: string;
  description?: string;
  previous_deadline?: string | null;
};

type Submission = {
  id: number;
  event_id: number;
  film_id: number;
  submission_status?: string;
  status?: string;
  judgingStatus?: string;
  judging_status?: string;
  score?: number | null;
  awards?: string;
  film?: Film;
  event?: Event;
  title?: string;
  filmId?: number;
};

function countAwards(submissions: Submission[]) {
  let count = 0;
  if (!Array.isArray(submissions)) return 0;
  submissions.forEach((s) => {
    if (s.awards && s.awards !== '-' && s.awards !== '') count++;
  });
  return count;
}

export default function StatsSection() {
  const [films, setFilms] = useState<Film[]>([]);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchStats() {
      setLoading(true);
      setError('');
      try {
        const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
        // Fetch films
        const filmsRes = await fetch('/api/films', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        let filmsData: Film[] = [];
        if (filmsRes.ok) {
          const data = await filmsRes.json();
          filmsData = Array.isArray(data.films) ? data.films : [];
        }
        setFilms(filmsData);

        // Fetch analytics for submissions (active and past)
        const analyticsRes = await fetch('/api/films/analytics', {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        let submissionsData: Submission[] = [];
        if (analyticsRes.ok) {
          const data = await analyticsRes.json();
          // Merge active and past submissions if both exist
          submissionsData = [
            ...(Array.isArray(data.activeSubmissions) ? data.activeSubmissions : []),
            ...(Array.isArray(data.pastSubmissions) ? data.pastSubmissions : []),
          ];
        }
        setSubmissions(submissionsData);
      } catch (e) {
        if (e instanceof Error) {
          setError(e.message || 'Error fetching stats');
        } else {
          setError('Error fetching stats');
        }
      }
      setLoading(false);
    }
    fetchStats();
  }, []);

  const totalFilms = films.length;
  // Count unique films with submission_status 'under_review' or judgingStatus/judging_status 'Under Review'
  const underReviewFilmIds = new Set(
    submissions
      .filter((s) =>
        s.submission_status === 'under_review' ||
        s.judgingStatus === 'Under Review' ||
        s.judging_status === 'Under Review'
      )
      .map((s) => (s.film && (s.film.id || s.film.title)) || s.film_id || s.title)
      .filter(Boolean)
  );
  const activeSubmissions = underReviewFilmIds.size;
  // Count unique films with a real award
  const awardFilmIds = new Set(
    submissions
      .filter((s) => s.awards && s.awards !== '-' && s.awards !== '' && s.film && s.film.id != null)
      .map((s) => s.film ? s.film.id : undefined)
      .filter((id): id is number => id !== undefined)
  );
  const awardsWon = awardFilmIds.size;

  const cards = [
    { title: 'Total Films', value: totalFilms, subtitle: 'Films in portfolio', Icon: FilmIcon },
    { title: 'Active Submissions', value: activeSubmissions, subtitle: 'Currently under review', Icon: TrendUpIcon },
    {
      title: 'Awards Won',
      value: awardsWon,
      subtitle: 'Across all festivals',
      Icon: RibbonIcon,
    },
  ];

  return (
    <section className="mt-6">
      {loading ? (
        <div className="text-sm text-gray-400">Loading…</div>
      ) : error ? (
        <div className="text-sm text-red-500">{error}</div>
      ) : (
        <div className="flex flex-wrap gap-5">
          {cards.map(({ title, value, subtitle, Icon }) => (
            <div
              key={title}
              className="w-[214.67px] h-[192.33px] rounded-2xl border border-[#EDEDED] bg-white shadow-sm"
            >
              <div className="h-full px-4 py-4 flex flex-col">
                <div className="flex items-start justify-between">
                  <div className="text-[13px] leading-5 text-[#4D4D4D]">{title}</div>
                  <div className="rounded-md bg-[#F4F7F5] p-2">
                    <Icon className="h-5 w-5 text-[#00441B]" />
                  </div>
                </div>

                <div className="mt-2 text-[22px] font-semibold leading-6 text-[#0F5B2A]">
                  {value}
                </div>

                <div className="mt-auto text-[13px] leading-5 text-[#6F6F6F]">
                  {subtitle}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

function FilmIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="7" cy="9" r="1.25" fill="currentColor" />
      <circle cx="7" cy="13" r="1.25" fill="currentColor" />
      <circle cx="17" cy="9" r="1.25" fill="currentColor" />
      <circle cx="17" cy="13" r="1.25" fill="currentColor" />
      <rect x="9.5" y="9" width="5" height="4" rx="0.8" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function TrendUpIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M4 16l6-6 4 4 6-7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M18 6h3v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function RibbonIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path d="M10 12l-3 8 5-3 5 3-3-8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}