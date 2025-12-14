'use client';

export default function LineChartSection({ analytics }: { analytics: any }) {
  const totalEvents = analytics?.totalEvents || 0;
  const activeEvents = analytics?.activeEvents || 0;
  const pastEvents = analytics?.pastEvents || 0;
  const acceptanceRate = analytics?.acceptanceRate || 0;
  const avgSubmissionsPerEvent = analytics?.averageSubmissionsPerEvent || 0;

  return (
    <section className="mb-6 bg-white rounded-xl shadow p-6">
      <h2 className="text-green-900 font-semibold text-lg mb-4">Event Overview</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-500 text-sm mb-1">Total Events</p>
          <p className="text-2xl font-bold text-green-900">{totalEvents}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-500 text-sm mb-1">Active Events</p>
          <p className="text-2xl font-bold text-green-900">{activeEvents}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-500 text-sm mb-1">Past Events</p>
          <p className="text-2xl font-bold text-green-900">{pastEvents}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-gray-500 text-sm mb-1">Acceptance Rate</p>
          <p className="text-2xl font-bold text-green-900">{acceptanceRate}%</p>
        </div>
      </div>
      <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
        <p className="text-sm text-green-900">
          <span className="font-semibold">Average submissions per event:</span> {avgSubmissionsPerEvent}
        </p>
      </div>
    </section>
  );
}
