'use client';

import React from 'react';
import { useAuthStore } from '../../../stores/authStore';

export default function SubmissionsHeaderSection() {
  const email = useAuthStore((s) => s.userEmail);
  const initials =
    (email || 'John Doe')
      .split('@')[0]
      .split(' ')
      .map((p) => p[0]?.toUpperCase())
      .slice(0, 2)
      .join('') || 'JD';

  return (
    <section className="rounded-xl border border-[#EDEDED] bg-white px-4 py-4 shadow-sm md:px-6 md:py-5 w-full">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-lg font-semibold text-[#00441B]">My Submissions</h2>
          <p className="text-sm text-[#6F6F6F]">View and track your film submissions and festival progress here.</p>
        </div>

        <div>
          <button
            onClick={() => (window.location.href = '/films/festival')}
            className="rounded-md bg-[#00441B] px-4 py-2 text-sm font-medium text-white"
          >
            Browse Festival
          </button>
        </div>
      </div>
    </section>
  );
}