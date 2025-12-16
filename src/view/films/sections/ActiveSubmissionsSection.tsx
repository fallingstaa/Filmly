

// --- Table design and logic copied from SubmissionsTableSection, with comments column ---
'use client';
import React, { useEffect, useState } from 'react';

type Submission = {
  id: string;
  film: string;
  festival: string;
  submissionStatus: 'Accepted' | 'Rejected' | 'None';
  judgingStatus?: 'Under Review' | 'Shortlist' | 'Nominee' | '';
  comments?: string;
};

async function fetchActiveSubmissions(): Promise<Submission[]> {
  try {
    const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
    if (!token) return [];
    const res = await fetch('/api/submissions', {
      headers: { Authorization: `Bearer ${token}` },
      cache: 'no-store',
    });
    if (!res.ok) return [];
    const data = await res.json();
    // Map backend fields to Submission type (snake_case from API)
    const mapSubmission = (item: any): Submission => {
      let submissionStatus: 'Accepted' | 'Rejected' | 'None' = 'None';
      let judgingStatus: 'Under Review' | 'Shortlist' | 'Nominee' | '' = '';
      if (item.submission_status === 'accept') {
        submissionStatus = 'Accepted';
      } else if (item.submission_status === 'reject') {
        submissionStatus = 'Rejected';
      } else if (item.submission_status === 'under_review') {
        submissionStatus = 'None';
        judgingStatus = 'Under Review';
      } else if (item.submission_status === 'shortlist') {
        submissionStatus = 'None';
        judgingStatus = 'Shortlist';
      } else if (item.submission_status === 'nominee') {
        submissionStatus = 'None';
        judgingStatus = 'Nominee';
      }
      return {
        id: item.id?.toString() ?? '',
        film: item.film?.title ?? '-',
        festival: item.event?.title ?? '-',
        submissionStatus,
        judgingStatus,
        comments: item.comments || '',
      };
    };
    const allSubs = Array.isArray(data.submissions)
      ? data.submissions.map(mapSubmission)
      : [];
    // Only show active (not accepted/rejected) submissions
    return allSubs.filter((s) => s.submissionStatus === 'None');
  } catch (e) {
    console.error('Error fetching active submissions:', e);
    return [];
  }
}

export default function ActiveSubmissionsSection() {
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveSubmissions().then((data) => {
      setSubmissions(data);
      setLoading(false);
    });
  }, []);

  return (
    <section className="rounded-xl border border-[#EDEDED] bg-white shadow-sm w-full">
      <h3 className="text-sm font-semibold text-[#00441B] px-6 pt-6">Active Submissions</h3>
      <div className="max-h-[340px] overflow-auto mt-2">
        <table className="min-w-full table-fixed text-sm">
          <thead>
            <tr className="bg-[#F4F7F6]">
              <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Film</th>
              <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Festival</th>
              <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Judging Status</th>
              <th className="px-6 py-3 text-left text-[#3B3B3B] font-semibold sticky top-0 z-10 bg-[#F4F7F6]">Comments</th>
            </tr>
          </thead>
          <tbody className="bg-white">
            {loading ? (
              <tr><td colSpan={4} className="text-center py-8 text-[#8A8A8A]">Loading...</td></tr>
            ) : submissions.length === 0 ? (
              <tr><td colSpan={4} className="text-center py-8 text-[#8A8A8A]">No active submissions found.</td></tr>
            ) : (
              submissions.map((row, idx) => (
                <tr
                  key={row.id}
                  className={`${idx < submissions.length - 1 ? 'border-b border-[#E7E7E7]' : ''}`}
                >
                  <td className="px-6 py-4 align-top max-w-[260px] break-words">{row.film}</td>
                  <td className="px-6 py-4 align-top text-[#4D4D4D] max-w-[240px] break-words">{row.festival}</td>
                  <td className="px-6 py-4 align-top">
                    {row.judgingStatus && row.judgingStatus !== ''
                      ? <JudgingBadge status={row.judgingStatus} />
                      : <span className="text-[#8A8A8A]">None</span>}
                  </td>
                  <td className="px-6 py-4 align-top text-sm text-[#616161] max-w-[380px] break-words">{row.comments || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function JudgingBadge({ status }: { status: Submission['judgingStatus'] }) {
  if (!status) return null;
  if (status === 'Under Review') return <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#4285F4] text-white">Under Review</span>;
  if (status === 'Shortlist') return <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#FBC02D] text-white">Shortlist</span>;
  if (status === 'Nominee') return <span className="inline-flex items-center px-3 py-1 rounded text-xs font-medium bg-[#7E57C2] text-white">Nominee</span>;
  return null;
}