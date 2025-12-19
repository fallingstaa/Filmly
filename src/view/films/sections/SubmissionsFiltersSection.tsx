'use client';
import React from 'react';

type FiltersProps = {
  statusFilter: string;
  judgingFilter: string;
  onStatusChange: (value: string) => void;
  onJudgingChange: (value: string) => void;
  total: number;
};

export default function SubmissionsFiltersSection({
  statusFilter,
  judgingFilter,
  onStatusChange,
  onJudgingChange,
  total
}: FiltersProps) {
  return (
    <section className="rounded-xl border border-[#EDEDED] bg-white px-4 py-4 shadow-sm md:px-6 md:py-5 w-full">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm bg-white min-w-[180px]"
            aria-label="Submission Status"
          >
            <option value="All">Submission Status</option>
            <option value="Accepted">Accept</option>
            <option value="Rejected">Reject</option>
          </select>

          <select
            value={judgingFilter}
            onChange={(e) => onJudgingChange(e.target.value)}
            className="rounded-md border px-3 py-2 text-sm bg-white min-w-[180px]"
            aria-label="Judging Status"
          >
            <option value="All">Judging Status</option>
            <option value="Under Review">Under Review</option>
            <option value="Shortlist">Shortlist</option>
            <option value="Nominee">Nominee</option>
            <option value="-">-</option>
          </select>
        </div>
        <div className="mt-2 md:mt-0 md:ml-auto text-sm text-[#6F6F6F]">
          Total: {total}
        </div>
      </div>
    </section>
  );
}