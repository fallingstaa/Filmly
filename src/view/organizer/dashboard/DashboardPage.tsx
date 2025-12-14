import StatsSection from './sections/StatsSection';
import PieChartSection from './sections/PieChartSection';
import BarChartSection from './sections/BarChartSection';
import LineChartSection from './sections/LineChartSection';
import TableSection from './sections/TableSection';

export default function DashboardPage() {
  return (
    <div className="p-8 space-y-6">
      <StatsSection />
      <PieChartSection />
      <BarChartSection />
      <LineChartSection />
      <TableSection />
    </div>
  );
}
