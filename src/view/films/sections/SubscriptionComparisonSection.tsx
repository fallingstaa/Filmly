'use client';
import React from 'react';

export default function SubscriptionComparisonSection() {
  return (
    <section className="relative p-6">
      {/* soft blurred outline behind the card */}
      <div
        aria-hidden
        className="absolute -inset-1 rounded-lg pointer-events-none blur-[8px] opacity-30"
        style={{ background:
          'linear-gradient(90deg, rgba(12,74,42,0.06), rgba(2,6,23,0.02))' }}
      />

      {/* actual card content sits above the blur */}
      <div className="relative bg-white rounded-lg border p-6 shadow-sm">
        <h4 className="text-[#065F46] font-medium mb-4">Detailed Feature Comparison</h4>

        <div className="overflow-x-auto">
          <table className="w-full table-fixed text-sm">
            <thead>
              <tr className="text-left text-gray-600">
                <th className="w-1/2 py-3">Feature</th>
                <th className="w-1/4 py-3">Free</th>
                <th className="w-1/4 py-3">Pro</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t">
                <td className="py-4">Film Submissions</td>
                <td className="py-4">3</td>
                <td className="py-4">Unlimited</td>
              </tr>
              <tr className="border-t">
                <td className="py-4">AI Match Accuracy</td>
                <td className="py-4">Basic</td>
                <td className="py-4">95%+</td>
              </tr>
              <tr className="border-t">
                <td className="py-4">Analytics Dashboard</td>
                <td className="py-4 text-gray-400">✕</td>
                <td className="py-4 text-green-600">✓</td>
              </tr>
              <tr className="border-t">
                <td className="py-4">Priority Support</td>
                <td className="py-4 text-gray-400">✕</td>
                <td className="py-4 text-green-600">✓</td>
              </tr>
              <tr className="border-t">
                <td className="py-4">Custom Strategies</td>
                <td className="py-4 text-gray-400">✕</td>
                <td className="py-4 text-green-600">✓</td>
              </tr>
              <tr className="border-t">
                <td className="py-4">Awards Portfolio</td>
                <td className="py-4 text-gray-400">✕</td>
                <td className="py-4 text-green-600">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}