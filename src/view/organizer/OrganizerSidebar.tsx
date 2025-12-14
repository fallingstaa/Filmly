'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FiBarChart2, FiCalendar, FiAward, FiCreditCard, FiLogOut, FiMenu } from 'react-icons/fi';
import { useAuthStore } from '../../shared/store/authStore';

const nav = [
	{ href: '/organizer/dashboard', label: 'Dashboard (Analysis)', icon: <FiBarChart2 size={18} /> },
	{ href: '/organizer/create', label: 'Create Festival', icon: <FiCalendar size={18} /> },
	{ href: '/organizer/review', label: 'Review Submissions', icon: <FiAward size={18} /> },
	{ href: '/organizer/my', label: 'My Festival', icon: <FiBarChart2 size={18} /> },
	{ href: '/organizer/subscription', label: 'Subscription', icon: <FiCreditCard size={18} /> },
];

export default function OrganizerSidebar() {
	const pathname = usePathname() ?? '';
	const router = useRouter();
	const email = useAuthStore((s) => s.userEmail);
	const activeRole = useAuthStore((s) => s.activeRole);
	const [collapsed, setCollapsed] = useState(false);

	const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

	const logout = () => {
		useAuthStore.getState().signOut();
		router.push('/login');
	};

	return (
		<aside
			className={`sticky top-0 h-screen border-r border-[#EDEDED] flex flex-col overflow-y-auto transition-[width] duration-200${collapsed ? ' w-20' : ' w-64'}`}
		>
			{/* Header/Logo/Toggle */}
			<div className="flex items-center justify-between px-4 py-3">
				<div className="flex items-center gap-2">
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
					{!collapsed && <span className="text-lg font-semibold text-green-900">Filmly</span>}
				</div>
				<button
					aria-label="Toggle sidebar"
					className="rounded-md p-2 hover:bg-[#F6F6F6]"
					onClick={() => setCollapsed((c) => !c)}
				>
					<FiMenu className="h-4 w-4 text-[#1A1A1A]" />
				</button>
			</div>

			{/* Nav items */}
			<nav className="mt-1 flex-1">
				{nav.map((n) => (
					<Link
						key={n.href}
						href={n.href}
						className={`flex items-center gap-3 rounded-md px-3 py-2 transition-colors text-sm ${
							isActive(n.href)
								? 'bg-[#00441B] text-white'
								: 'text-[#1A1A1A] hover:bg-[#F4F7F5]'
						} ${collapsed ? 'justify-center' : ''}`}
					>
						{React.cloneElement(n.icon, { className: `h-5 w-5 ${isActive(n.href) ? 'text-white' : 'text-[#2F623F]'}` })}
						{!collapsed && <span className="font-medium">{n.label}</span>}
					</Link>
				))}
			</nav>

			{/* Sidebar profile (at the bottom of nav) */}
			<div className="mt-auto px-3 py-4 border-t border-[#EDEDED]">
				<div
					className={`flex items-center cursor-pointer ${collapsed ? 'justify-center' : 'gap-3'}`}
					onClick={() => router.push('/organizer/profile')}
					title="View Profile"
				>
					<div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#00441B] text-white text-xs font-semibold">
						{email ? email.substring(0, 2).toUpperCase() : 'OR'}
					</div>
					{!collapsed && (
						<div className="leading-tight">
							<div className="text-sm font-semibold text-[#0C0C0C]">
								{email || 'Organizer'}
							</div>
							<div className="text-xs text-[#6F6F6F]">
								{activeRole || 'Organizer'}
							</div>
						</div>
					)}
				</div>
				{!collapsed && (
					<div className="mt-3 flex flex-col gap-2 w-full">
						<button
							onClick={() => {
								// Switch to filmmaker role and redirect
								const { userEmail, roles = [] } = useAuthStore.getState();
								const newRoles = roles.includes('filmmaker') ? roles : [...roles, 'filmmaker'];
								useAuthStore.getState().setUser(userEmail, newRoles, 'filmmaker');
								router.push('/films');
							}}
							className="flex items-center gap-2 rounded-md border border-[#EDEDED] px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F6F6F6] w-full"
						>
							<FiAward className="h-4 w-4 text-[#2F623F]" />
							Filmmaker
						</button>
						<button
							onClick={logout}
							className="flex items-center gap-2 rounded-md border border-[#EDEDED] px-3 py-2 text-sm text-[#1A1A1A] hover:bg-[#F6F6F6] w-full"
						>
							<FiLogOut className="h-4 w-4 text-[#2F623F]" />
							Logout
						</button>
					</div>
				)}
			</div>
		</aside>
	);
}