'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../shared/store/authStore';

export default function RoleSelectForm() {
  const [role, setRole] = useState<'filmmaker' | 'organizer' | null>(null);
  const router = useRouter();
  const email = useAuthStore((s) => s.userEmail);
  const activeRole = useAuthStore((s) => s.activeRole);

  // Remove auto-redirect on mount to allow explicit navigation only after user chooses


  const handleChoose = () => {
    if (!role || !email) return;
    // Add the role to the user's roles if not present, and set as active
    const { roles = [] } = useAuthStore.getState();
    const newRoles = roles.includes(role) ? roles : [...roles, role];
    useAuthStore.getState().setUser(email, newRoles, role);
    localStorage.setItem('selected_role', role);
    // Always redirect to the correct dashboard
    if (role === 'filmmaker') {
      router.replace('/films');
    } else if (role === 'organizer') {
      router.replace('/organizer');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded shadow p-8 flex flex-col items-center">
      <div className="mb-4">
        <span className="text-4xl text-green-900">🎬</span>
      </div>
      <h2 className="text-xl font-bold mb-2">Filmly</h2>
      <h3 className="text-lg font-semibold mb-2">Choose Your Role</h3>
      <p className="mb-6 text-gray-600 text-center">Select how you want to use Filmly.</p>
      <div className="flex gap-4 mb-6">
        <button
          type="button"
          className={`px-6 py-2 rounded border ${role === 'filmmaker' ? 'bg-green-100 border-green-700' : 'bg-white border-gray-300'}`}
          onClick={() => setRole('filmmaker')}
        >
          Filmmaker
        </button>
        <button
          type="button"
          className={`px-6 py-2 rounded border ${role === 'organizer' ? 'bg-green-100 border-green-700' : 'bg-white border-gray-300'}`}
          onClick={() => setRole('organizer')}
        >
          Organizer
        </button>
      </div>
      <button
        className="w-full bg-green-900 text-white font-bold py-2 rounded disabled:opacity-50"
        disabled={!role}
        onClick={handleChoose}
      >
        Continue
      </button>
    </div>
  );
}