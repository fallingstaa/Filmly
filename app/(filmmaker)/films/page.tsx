"use client";

// Welcome Header
// (This will be rendered inside the component below)
import HeaderSection from '../../../src/view/films/sections/HeaderSection';
import StatsSection from '../../../src/view/films/sections/StatsSection';
import AnalyticsSection from '../../../src/view/films/sections/AnalyticsSection';
import ActiveSubmissionsSection from '../../../src/view/films/sections/ActiveSubmissionsSection';
import PastSubmissionsSection from '../../../src/view/films/sections/PastSubmissionsSection';

export default function FilmmakerDashboardPage() {
  return (
    <div className="p-6 space-y-8">
      {/* Welcome Header */}
      <section className="rounded-xl border border-[#EDEDED] bg-white px-4 py-4 shadow-sm md:px-6 md:py-5 w-full mb-2">
        <div className="text-xl font-bold text-[#00441B]">Welcome back,</div>
        <div className="text-sm text-[#6F6F6F]">This is your filmmaker dashboard.</div>
      </section>

      {/* Section 2: Stats */}
      <section>
        <h2 className="text-lg font-semibold text-[#00441B] mb-2">Overview</h2>
        <StatsSection />
      </section>

      {/* Section 3: Analytics */}
      <section>
        <h2 className="text-lg font-semibold text-[#00441B] mb-2">Quick Analytics</h2>
        <AnalyticsSection />
      </section>

      {/* Section 4: Submissions */}
      <section>
        <h2 className="text-lg font-semibold text-[#00441B] mb-2">Submissions</h2>
        <div className="flex flex-col gap-6">
          <ActiveSubmissionsSection />
          <PastSubmissionsSection />
        </div>
      </section>
    </div>
  );
}