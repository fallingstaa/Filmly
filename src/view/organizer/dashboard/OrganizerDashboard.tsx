'use client';


import React, { useEffect } from 'react';
import { useAuthStore } from '../../../shared/store/authStore';
import { useRouter, usePathname } from 'next/navigation';


export default function OrganizerDashboard() {
  const router = useRouter();
  const pathname = usePathname();
  const roles = useAuthStore((s) => s.roles);
  const email = useAuthStore((s) => s.userEmail);
  const activeRole = useAuthStore((s) => s.activeRole);

  // Redirect to /organizer/dashboard if on /organizer
  useEffect(() => {
    if (pathname === '/organizer') {
      router.replace('/organizer/dashboard');
    }
  }, [pathname, router]);

  function handleRoleChange() {
    if (activeRole === 'organizer') {
      router.push('/films');
    } else {
      router.push('/organizer/dashboard');
    }
  }

  return (
    <div className="p-6">
      <h1 className="text-xl font-semibold text-[#00441B]">Dashboard</h1>
      <p className="mt-2 text-sm text-[#4D4D4D]">
        {roles.includes('organizer') ? (
          <>Welcome Organizer{email ? ` (${email})` : ''}.</>
        ) : (
          <>You reached Dashboard, but you are {roles.length > 0 ? roles.join(', ') : 'not signed in'}.</>
        )}
      </p>
      <div className="mt-4 flex gap-2">
        {roles.includes('filmmaker') && (
          <button
            className="px-4 py-2 bg-green-900 text-white rounded"
            onClick={handleRoleChange}
          >
            {activeRole === 'organizer' ? 'Go to Filmmaker' : 'Go to Organizer'}
          </button>
        )}
      </div>
    </div>
  );
}

useAuthStore.getState().setUser('user@email.com', ['organizer', 'filmmaker']);