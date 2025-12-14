'use client';

import { useRouter } from 'next/navigation';
import React from 'react';
import { useAuthStore } from '../../../shared/store/authStore';

export default function HeaderSection() {
  const router = useRouter();
  const email = useAuthStore((s) => s.userEmail);
  const initials =
    (email || 'John Doe')
      .split('@')[0]
      .split(' ')
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join('') || 'JD';

  function handleAddFilm() {
    router.push('/films/add');
  }

  return (
    <div className="flex items-center justify-between mb-6">
      <div>
        <h1 className="text-2xl font-bold text-[#0C0C0C]">My Films</h1>
        <p className="text-sm text-gray-500 mt-1">Manage your submitted films and add new ones.</p>
      </div>
      {/* Removed Add Film button from dashboard */}
    </div>
  );
}

function PlusIcon({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className}>
      <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}