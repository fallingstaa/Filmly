import React from 'react';
import Link from 'next/link';
import { Festival } from './festivals.types';
import { formatDate } from './utils/formatDate';

export default function FestivalCard({ festival }: { festival: Festival }) {
  return (
    <div className="rounded-lg border border-[#ECECEC] bg-white p-5 shadow-sm">
      <div className="flex items-start gap-4">
        <div className="h-12 w-12 flex-shrink-0 rounded-md bg-[#F4F7F5] flex items-center justify-center text-[#9AA69A]">
          🎬
        </div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-[#00441B]">{festival.name}</h3>
          <div className="text-xs text-[#6F6F6F]">{festival.category}</div>
        </div>
      </div>

      <div className="mt-4 space-y-2 text-sm text-[#6F6F6F]">
        <div className="flex items-center gap-2">
          <span className="text-xs">📍</span>
          <span>{festival.country}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs">📅</span>
          <span>Deadline: {formatDate(festival.deadline)}</span>
        </div>
      </div>

      <div className="mt-4">
        <Link
          href={`/films/festival/${festival.id}`}
          className="inline-block w-full rounded-md bg-[#0C4A2A] px-3 py-2 text-center text-sm font-medium text-white hover:opacity-95"
        >
          View Details
        </Link>
      </div>
    </div>
  );
}