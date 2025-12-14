'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiBarChart2, FiCalendar, FiAward, FiCreditCard, FiLogOut } from 'react-icons/fi';
import { useAuthStore } from '../../shared/store/authStore';

const nav = [
  { href: '/festival', label: 'Dashboard (Analysis)', icon: <FiBarChart2 size={18} /> },
  { href: '/festival/create', label: 'Create Festival', icon: <FiCalendar size={18} /> },
  { href: '/festival/review', label: 'Review Submissions', icon: <FiAward size={18} /> },
  { href: '/festival/my', label: 'My Festival', icon: <FiBarChart2 size={18} /> },
  { href: '/festival/subscription', label: 'Subscription', icon: <FiCreditCard size={18} /> },
];

export default function FestivalSidebar() {
  const pathname = usePathname() ?? '';
  const router = useRouter();

  const isActive = (href: string) =>
    pathname === href || pathname.startsWith(href + '/');

  const logout = () => {
    useAuthStore.getState().setUser(null, []);
    router.push('/choose-role');
  };

  return (
    <aside className="flex flex-col justify-between w-64 min-h-screen bg-white border-r">
      <div>
        <div className="flex items-center gap-2 px-6 py-6">
          <span className="text-2xl text-green-900">
            <svg width="28" height="28" fill="none">
              <rect width="28" height="28" rx="6" fill="#00441B" />
              <text
                x="14"
                y="20"
                textAnchor="middle"
                fill="#fff"
                fontSize="16"
                fontWeight="bold"
              >
                🎬
              </text>
            </svg>
          </span>
          <span className="text-lg font-semibold text-green-900">Filmly</span>
        </div>
        <hr />
        <nav className="mt-4 space-y-2">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`flex items-center gap-3 px-3 py-2 rounded ${
                isActive(n.href)
                  ? 'bg-[#00441B] text-white'
                  : 'text-[#2D2D2D] hover:bg-gray-100'
              }`}
            >
              {n.icon}
              {n.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="mb-4 px-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-green-900 flex items-center justify-center text-white font-bold">
            FF
          </div>
          <div>
            <div className="font-medium text-gray-900">CPP short film festival</div>
            <div className="text-xs text-gray-500">Organizer</div>
          </div>
        </div>
        <button
          className="w-full flex items-center gap-2 px-3 py-2 border rounded-lg text-gray-700 hover:bg-gray-100"
          onClick={logout}
        >
          <FiLogOut />
          Logout
        </button>
      </div>
    </aside>
  );
}