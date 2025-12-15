import { FiFilm, FiUsers, FiAward } from 'react-icons/fi';

function DashboardHeader() {
	return (
		<div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
			<div>
				<h1 className="text-2xl font-bold text-green-900 mb-1">
					Festival Analytics
				</h1>
				<p className="text-gray-500 text-base">
					Comprehensive insights into your festival performance
				</p>
			</div>
			<div className="mt-4 md:mt-0">
				<select className="border rounded-lg px-4 py-2 bg-white text-gray-800 min-w-[180px] shadow-sm">
					<option>All Festivals</option>
				</select>
			</div>
		</div>
	);
}

export default function StatsSection({ analytics }: { analytics: any }) {
	const stats = [
		{
			label: 'Total Submissions',
			value: analytics?.totalSubmissions || 0,
			icon: <FiFilm size={24} className="text-green-900" />,
			sub: 'All festivals combined',
		},
		{
			label: 'Total Nominee',
			value: analytics?.totalNominees || 0,
			icon: <FiUsers size={24} className="text-green-900" />,
			sub: 'Reviewed submissions',
		},
		{
			label: 'Awards Given',
			value: analytics?.totalAwardsGiven || 0,
			icon: <FiAward size={24} className="text-green-900" />,
			sub: 'Across all festivals',
		},
	];

	return (
		<>
			<DashboardHeader />
			<section className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
				{stats.map((s) => (
					<div
						key={s.label}
						className="bg-white rounded-xl shadow p-6 flex flex-col gap-2 min-w-[220px]"
					>
						<div className="flex items-center justify-between">
							<span className="text-gray-700 font-medium text-base">
								{s.label}
							</span>
							<span className="bg-gray-100 rounded p-1">{s.icon}</span>
						</div>
						<div className="text-green-900 text-2xl font-bold">{s.value}</div>
						<div className="text-gray-400 text-sm">{s.sub}</div>
					</div>
				))}
			</section>
		</>
	);
}
