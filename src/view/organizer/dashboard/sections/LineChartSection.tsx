'use client';

import { Line } from 'react-chartjs-2';
import { Chart, LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend } from 'chart.js';

Chart.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

const data = {
  labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov'],
  datasets: [
    {
      label: 'Acceptance Rate',
      data: [45, 42, 48, 50, 46, 52],
      borderColor: '#14532D',
      backgroundColor: '#14532D',
      pointBackgroundColor: '#fff',
      pointBorderColor: '#14532D',
      pointRadius: 5,
      pointHoverRadius: 7,
      fill: false,
      tension: 0.4,
    },
  ],
};

const options = {
  plugins: {
    legend: { display: false },
  },
  scales: {
    x: {
      grid: { color: '#E5E7EB' },
      ticks: { color: '#14532D' },
    },
    y: {
      beginAtZero: true,
      grid: { color: '#E5E7EB' },
      ticks: { color: '#14532D' },
      max: 65,
    },
  },
  responsive: true,
  maintainAspectRatio: false,
};

export default function LineChartSection() {
  return (
    <section className="mb-6 bg-white rounded-xl shadow p-6">
      <h2 className="text-green-900 font-semibold text-lg mb-2">Acceptance Rate Trend</h2>
      <div className="w-full h-64">
        <Line data={data} options={options} />
      </div>
    </section>
  );
}
