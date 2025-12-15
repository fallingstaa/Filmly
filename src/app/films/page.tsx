'use client';


import React from 'react';
import { useAuthStore } from '../../stores/authStore';
import MatchingTableSection from '@/view/films/sections/MatchingTableSection';

export default function FilmsPage() {
  const role = useAuthStore((s) => s.role);
  const email = useAuthStore((s) => s.userEmail);

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-[#00441B]">Films</h1>
      <p className="mt-2 text-sm text-[#4D4D4D]">
        {role === 'admin' && <>Welcome Admin{email ? ` (${email})` : ''}.</>}
        {role === 'filmmaker' && <>Welcome Filmmaker{email ? ` (${email})` : ''}.</>}
        {!role && <>Welcome. You are not signed in.</>}
      </p>
      <div className="mt-8">
        <MatchingTableSection />
      </div>
    </div>
  );
}