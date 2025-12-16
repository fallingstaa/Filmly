'use client';

import React from 'react';
import MatchingHeaderSection from '../../../../src/view/films/sections/MatchingHeaderSection';
import MatchingTableSection from '../../../../src/view/films/sections/MatchingTableSection';
import MatchingResultsSection from '../../../../src/view/films/sections/MatchingResultsSection';

export default function MatchingPage() {
  return (
    <div className="p-6 w-full space-y-6">
      <MatchingHeaderSection />

      <div>
        <h3 className="text-base font-semibold text-[#00441B] mb-2">Your Projects</h3>
        <p className="text-sm text-[#6F6F6F] mb-4">
          Select a film and click "AI matching" to find festivals that match your project's theme, language, and other criteria.
        </p>
        <MatchingTableSection />
      </div>

      <div>
        <MatchingResultsSection />
      </div>
    </div>
  );
}