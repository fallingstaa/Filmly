'use client';

import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const generateColors = (count: number) => {
  const baseColors = ['#14532D', '#166534', '#15803D', '#16A34A', '#22C55E', '#4ADE80', '#86EFAC', '#BBF7D0', '#DCFCE7'];
  return Array.from({ length: count }, (_, i) => baseColors[i % baseColors.length]);
};

const barOptions = {
  indexAxis: 'y' as const,
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      beginAtZero: true,
      grid: { color: '#E5E7EB' },
      ticks: { color: '#14532D' },
    },
    y: {
      grid: { color: '#E5E7EB' },
      ticks: { color: '#14532D' },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default function PieChartSection({ analytics }: { analytics: any }) {
  const submissionsByGenre = analytics?.submissionsByGenre || {};
  const submissionsByStatus = analytics?.submissionsByStatus || {};

  const genreLabels = Object.keys(submissionsByGenre);
  const genreData = Object.values(submissionsByGenre) as number[];

  const statusLabels = Object.keys(submissionsByStatus).map((key) => {
    return key.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  });
  const statusData = Object.values(submissionsByStatus) as number[];

  const pieData = {
    labels: genreLabels.length > 0 ? genreLabels : ['No Data'],
    datasets: [
      {
        data: genreData.length > 0 ? genreData : [1],
        backgroundColor: genreLabels.length > 0 ? generateColors(genreLabels.length) : ['#E5E7EB'],
        borderWidth: 0,
      },
    ],
  };

  const barData = {
    labels: statusLabels.length > 0 ? statusLabels : ['No Data'],
    datasets: [
      {
        label: 'Submissions',
        data: statusData.length > 0 ? statusData : [0],
        backgroundColor: '#14532D',
        borderRadius: 4,
        barPercentage: 0.7,
        categoryPercentage: 0.7,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-xl shadow p-6 min-h-[280px] flex flex-col">
        <h2 className="text-green-900 font-semibold text-lg mb-2">Submissions by Genre</h2>
        <div className="flex-1 flex items-center justify-center">
          {genreLabels.length > 0 ? (
            <div className="w-40 h-40 md:w-56 md:h-56">
              <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No submissions yet</p>
          )}
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 min-h-[280px] flex flex-col">
        <h2 className="text-green-900 font-semibold text-lg mb-2">Submissions by Status</h2>
        <div className="flex-1 flex items-center justify-center">
          {statusLabels.length > 0 ? (
            <div className="w-full h-48">
              <Bar data={barData} options={barOptions} />
            </div>
          ) : (
            <p className="text-gray-400 text-sm">No submissions yet</p>
          )}
        </div>
      </div>
    </div>
  );
}
