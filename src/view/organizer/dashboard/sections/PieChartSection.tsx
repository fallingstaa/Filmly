'use client';

import { Pie } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Bar } from 'react-chartjs-2';

Chart.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

const pieData = {
  labels: ['Short Film', 'Documentary', 'Animation', 'Feature'],
  datasets: [
    {
      data: [40, 30, 20, 10],
      backgroundColor: [
        '#14532D', // dark green
        '#166534',
        '#22C55E',
        '#A7F3D0',
      ],
      borderWidth: 0,
    },
  ],
};

const barData = {
  labels: [
    'United States',
    'United Kingdom',
    'Canada',
    'France',
    'Germany',
    'Australia',
    'India',
    'Japan',
  ],
  datasets: [
    {
      label: 'Submissions',
      data: [98, 45, 32, 25, 20, 18, 12, 7],
      backgroundColor: '#14532D',
      borderRadius: 4,
      barPercentage: 0.7,
      categoryPercentage: 0.7,
    },
  ],
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

export default function PieChartSection() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <div className="bg-white rounded-xl shadow p-6 min-h-[280px] flex flex-col">
        <h2 className="text-green-900 font-semibold text-lg mb-2">Submissions by Category</h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-40 h-40 md:w-56 md:h-56">
            <Pie data={pieData} options={{ plugins: { legend: { display: false } } }} />
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl shadow p-6 min-h-[280px] flex flex-col">
        <h2 className="text-green-900 font-semibold text-lg mb-2">Geographic Distribution</h2>
        <div className="flex-1 flex items-center justify-center">
          <div className="w-full h-48">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}
