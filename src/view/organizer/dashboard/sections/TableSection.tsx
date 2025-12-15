'use client';

export default function TableSection({ analytics }: { analytics: any }) {
	const topEvents = analytics?.topEvents || [];
	const totalSubmissions = analytics?.totalSubmissions || 0;
	const totalAwards = analytics?.totalAwardsGiven || 0;
	const acceptanceRate = analytics?.acceptanceRate || 0;

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
							<th className="px-4 py-2 font-semibold">Deadline</th>
						</tr>
					</thead>
					<tbody>
						{topEvents.length > 0 ? (
							topEvents.map((event: any) => (
								<tr
									key={event.id}
									className="bg-white border-b last:border-b-0"
								>
									<td className="px-4 py-2 text-gray-900 whitespace-nowrap">
										{event.title}
									</td>
									<td className="px-4 py-2 text-gray-900">
										{event.submissionCount}
									</td>
									<td className="px-4 py-2 text-gray-900">
										{event.deadline ? new Date(event.deadline).toLocaleDateString() : 'N/A'}
									</td>
								</tr>
							))
						) : (
							<tr>
								<td colSpan={3} className="px-4 py-8 text-center text-gray-500">
									No events yet. Create your first festival to see analytics!
								</td>
							</tr>
						)}
						{topEvents.length > 0 && (
							<tr className="bg-gray-50 border-t font-semibold">
								<td className="px-4 py-2 text-green-900">Total</td>
								<td className="px-4 py-2 text-green-900">{totalSubmissions}</td>
								<td className="px-4 py-2 text-green-900">
									{acceptanceRate}% accepted
								</td>
							</tr>
						)}
					</tbody>
				</table>
			</div>
		</section>
	);
}
