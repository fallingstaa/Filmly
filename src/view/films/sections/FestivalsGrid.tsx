import React from 'react';
import { Festival } from './festivals.types';
import FestivalCard from './FestivalCard';

export default function FestivalsGrid({ festivals }: { festivals: Festival[] }) {
  if (festivals.length === 0) {
    return <div className="text-sm text-[#6F6F6F]">No festivals found.</div>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {festivals.map((f) => (
        <FestivalCard key={f.id} festival={f} />
      ))}
    </div>
  );
}