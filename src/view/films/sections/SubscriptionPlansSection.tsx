'use client';
import React from 'react';
import { useRouter } from 'next/navigation';

const FEATURES = [
  'Up to 3 film submissions',
  'Basic AI recommendations',
  'Submission tracking',
  'Festival database access',
  'Email support',
  'Advanced analytics',
  'Priority support',
  'Custom submission strategies',
  'Awards portfolio management',
];

export default function SubscriptionPlansSection({ billing }: { billing: 'monthly' | 'yearly' }) {
  console.log("subscription active");
  const router = useRouter();

  return (
    <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="rounded-lg border p-6 bg-white shadow-sm">
        <h3 className="text-lg text-[#065F46] font-medium">Free</h3>
        <div className="mt-2 text-sm text-gray-600">$0 /month</div>
        <p className="mt-4 text-sm text-gray-600">Perfect for getting started</p>
        

        <ul className="mt-6 space-y-2">
          {FEATURES.slice(0, 5).map((f) => (
            <li key={f} className="text-sm text-gray-700 flex items-start gap-3">
              <span className="text-green-600">✓</span>
              <span>{f}</span>
            </li>
          ))}
          {FEATURES.slice(5).map((f) => (
            <li key={f} className="text-sm text-gray-400 flex items-start gap-3">
              <span className="opacity-40">✕</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <button className="w-full rounded-md border border-gray-200 py-2 text-sm text-gray-500">Current Plan</button>
        </div>
      </div>

      <div className="rounded-lg border p-6 bg-white shadow-sm relative">
        <div className="absolute -top-3 right-6 bg-green-600 text-white text-xs px-3 py-1 rounded-full">Most Popular</div>
        <h3 className="text-lg text-[#065F46] font-medium">Pro</h3>
        <div className="mt-2 text-sm text-gray-600">
          {billing === 'monthly' ? '$9.99 /month' : '$96 /year'}
        </div>
        <p className="mt-4 text-sm text-gray-600">For serious filmmakers</p>

        <ul className="mt-6 space-y-2 text-sm text-gray-700">
          {FEATURES.map((f) => (
            <li key={f} className="flex items-start gap-3">
              <span className="text-green-600">✓</span>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <button
            onClick={() => router.push('/organizer/subscription/select-payment')}
            className="w-full rounded-md bg-[#0C4A2A] py-2 text-sm text-white"
          >
            Upgrade to Pro
          </button>
        </div>
      </div>
    </section>
  );
}