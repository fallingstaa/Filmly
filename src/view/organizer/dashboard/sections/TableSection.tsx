'use client';

const data = [
	{
		festival: 'NY Independent Film Festival',
		submissions: 142,
		awards: 15,
		rate: '10.6%',
	},
	{
		festival: 'LA Short Film Showcase',
		submissions: 89,
		awards: 10,
		rate: '11.2%',
	},
	{
		festival: 'Miami Documentary Festival',
		submissions: 67,
		awards: 8,
		rate: '11.9%',
	},
	{
		festival: 'Chicago Student Film Awards',
		submissions: 54,
		awards: 6,
		rate: '11.1%',
	},
];

export default function TableSection() {
	return (
		<section className="mb-6 bg-white rounded-xl shadow p-6">
			<h2 className="text-green-900 font-semibold text-lg mb-4">
				Festival Performance Summary
			</h2>
			<div className="overflow-x-auto">
				<table className="min-w-full text-left border-separate border-spacing-y-2">
					<thead>
						<tr className="text-gray-500 text-sm">
							<th className="px-4 py-2 font-semibold">Festival</th>
							<th className="px-4 py-2 font-semibold">Total Submissions</th>
							<th className="px-4 py-2 font-semibold">Awards Given</th>
							<th className="px-4 py-2 font-semibold">Acceptance Rate</th>
						</tr>
					</thead>
					<tbody>
						{data.map((row) => (
							<tr
								key={row.festival}
								className="bg-white border-b last:border-b-0"
							>
								<td className="px-4 py-2 text-gray-900 whitespace-nowrap">
									{row.festival}
								</td>
								<td className="px-4 py-2 text-gray-900">
									{row.submissions}
								</td>
								<td className="px-4 py-2 text-gray-900">{row.awards}</td>
								<td className="px-4 py-2 text-gray-900">{row.rate}</td>
							</tr>
						))}
						<tr className="bg-gray-50 border-t font-semibold">
							<td className="px-4 py-2 text-green-900">Total</td>
							<td className="px-4 py-2 text-green-900">352</td>
							<td className="px-4 py-2 text-green-900">39</td>
							<td className="px-4 py-2 text-green-900">11.1%</td>
						</tr>
					</tbody>
				</table>
			</div>
		</section>
	);
}
