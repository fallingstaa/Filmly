'use client';

import React, { useEffect, useState } from 'react';
import MatchingResultsHeaderSection from './MatchingResultsHeaderSection';
import MatchingResultsGridSection from './MatchingResultsGridSection';

type Film = { id: string; title: string };
type Match = {
  id?: string;
  eventId?: number;
  eventTitle?: string;
  eventDescription?: string | null;
  eventLanguage?: string;
  eventLocation?: string | null;
  eventDeadline?: Date | string;
  daysUntilDeadline?: number;
  matchScore?: number;
  themeScore?: number;
  languageSupported?: boolean;
  deadlineScore?: number;
  matchReasons?: string[];
  // Legacy fields for backward compatibility
  festival?: string;
  score?: number;
  type?: string;
  country?: string;
  deadline?: string;
};

type AIMatchingResults = {
  filmId: string | number;
  filmTitle: string;
  results: any[];
  userInput?: {
    theme: string;
    language: string;
  };
  totalFestivals?: number;
  compatibleMatches?: number;
};

export default function MatchingResultsSection() {
  const [selectedFilmId, setSelectedFilmId] = useState<string>('');
  const [selectedFilmTitle, setSelectedFilmTitle] = useState<string>('');
  const [matches, setMatches] = useState<Match[]>([]);
  const [hasResults, setHasResults] = useState(false);

  // keep layout values for grid
  const COLUMNS = 4;
  const BOX_W = '294.22px';
  const BOX_H = '338.33px';
  const GAP_PX = 16;

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Get timestamp from URL to trigger reload on new navigation
    const urlParams = new URLSearchParams(window.location.search);
    const timestamp = urlParams.get('t');
    console.log('MatchingResultsSection: URL timestamp:', timestamp);

    // Try to get results from sessionStorage first
    const storedResults = sessionStorage.getItem('ai_matching_results');
    console.log('MatchingResultsSection: Loading from sessionStorage:', storedResults);

    if (storedResults) {
      try {
        const parsed: AIMatchingResults = JSON.parse(storedResults);
        console.log('MatchingResultsSection: Parsed results:', parsed);
        setSelectedFilmId(String(parsed.filmId));
        setSelectedFilmTitle(parsed.filmTitle);

        // Transform backend results to match format
        const transformedMatches: Match[] = parsed.results.map((result: any, index: number) => ({
          id: result.eventId ? `${result.eventId}` : `match-${index}`,
          eventId: result.eventId,
          eventTitle: result.eventTitle,
          eventDescription: result.eventDescription,
          eventLanguage: result.eventLanguage,
          eventLocation: result.eventLocation,
          eventDeadline: result.eventDeadline,
          daysUntilDeadline: result.daysUntilDeadline,
          matchScore: result.matchScore,
          themeScore: result.themeScore,
          languageSupported: result.languageSupported,
          deadlineScore: result.deadlineScore,
          matchReasons: result.matchReasons,
          // Legacy format for display
          festival: result.eventTitle || result.festivalTitle || 'Unknown Festival',
          score: result.matchScore || 0,
          type: 'Festival',
          country: result.eventLocation || result.festivalLocation || 'Unknown',
          deadline: result.eventDeadline
            ? new Date(result.eventDeadline).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
            : 'TBD',
        }));

        console.log('MatchingResultsSection: Transformed matches:', transformedMatches);
        setMatches(transformedMatches);
        setHasResults(true);
        return;
      } catch (error) {
        console.error('Error parsing stored results:', error);
      }
    }

    // Check URL parameters
    const params = new URLSearchParams(window.location.search);
    const qId = params.get('filmId');
    const qTitle = params.get('title');

    if (qId && qTitle) {
      setSelectedFilmId(qId);
      setSelectedFilmTitle(qTitle);
      // If we have URL params but no stored results, show empty state
      setHasResults(false);
    }
  }, []);

  function onSelectChange(id: string) {
    // This functionality is not currently used since we load from sessionStorage
    // Could be implemented to allow switching between different film results
  }

  if (!hasResults && matches.length === 0) {
    return (
      <div className="rounded-xl border border-[#EDEDED] bg-white p-8 shadow-sm w-full">
        <div className="text-center text-[#6F6F6F]">
          <p className="text-sm">No matching results yet. Click "AI matching" on a film to see festival matches.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[#EDEDED] bg-white p-4 shadow-sm w-full">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-[#00441B]">
          {selectedFilmTitle ? `Matches for "${selectedFilmTitle}"` : 'AI Matching Results'}
        </h3>
        <p className="text-sm text-[#6F6F6F] mt-1">
          Found {matches.length} matching {matches.length === 1 ? 'festival' : 'festivals'}
        </p>
      </div>

      {matches.length > 0 && (
        <MatchingResultsGridSection
          matches={matches}
          boxWidth={BOX_W}
          boxHeight={BOX_H}
          columns={COLUMNS}
          gapPx={GAP_PX}
        />
      )}
    </div>
  );
}