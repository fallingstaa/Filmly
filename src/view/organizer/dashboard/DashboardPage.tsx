'use client';

import { useEffect, useState } from 'react';
import StatsSection from './sections/StatsSection';
import PieChartSection from './sections/PieChartSection';
import BarChartSection from './sections/BarChartSection';
import LineChartSection from './sections/LineChartSection';
import TableSection from './sections/TableSection';
import { getOrganizerAnalytics } from '@/api/organizerApi';

export default function DashboardPage() {
  const [analytics, setAnalytics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const data = await getOrganizerAnalytics();
        setAnalytics(data);
      } catch (err: any) {
        console.error('Error fetching analytics:', err);
        setError(err.message || 'Failed to load analytics');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          <p className="font-semibold">Error loading analytics</p>
          <p className="text-sm">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <StatsSection analytics={analytics} />
      <PieChartSection analytics={analytics} />
      <BarChartSection analytics={analytics} />
      <LineChartSection analytics={analytics} />
      <TableSection analytics={analytics} />
    </div>
  );
}
