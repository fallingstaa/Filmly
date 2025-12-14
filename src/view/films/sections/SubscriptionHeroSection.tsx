'use client';
import React from 'react';

export default function SubscriptionHeroSection({
  billing,
  setBilling,
}: {
  billing: 'monthly' | 'yearly';
  setBilling: (b: 'monthly' | 'yearly') => void;
}) {
  return (
    <section className="pt-6 pb-8">
      <div className="max-w-3xl mx-auto text-center">
        <h2 className="text-[#065F46] font-semibold text-lg">Choose Your Plan</h2>
        <p className="text-sm text-gray-600 mt-2">Select the plan that best fits your filmmaking journey</p>

        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center rounded-full bg-gray-100 p-1 ring-1 ring-gray-200 shadow-sm">
            <button
              onClick={() => setBilling('monthly')}
              aria-pressed={billing === 'monthly'}
              className={`px-4 py-2 rounded-full text-sm transition ${
                billing === 'monthly'
                  ? 'bg-white shadow text-[#065F46] font-medium ring-1 ring-gray-200'
                  : 'text-gray-600'
              }`}
            >
              Monthly
            </button>

            <button
              onClick={() => setBilling('yearly')}
              aria-pressed={billing === 'yearly'}
              className={`px-4 py-2 rounded-full text-sm transition ${
                billing === 'yearly'
                  ? 'bg-white shadow text-[#065F46] font-medium ring-1 ring-gray-200'
                  : 'text-gray-600'
              }`}
            >
              Yearly <span className="text-green-600 ml-2 text-xs">Save 20%</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}