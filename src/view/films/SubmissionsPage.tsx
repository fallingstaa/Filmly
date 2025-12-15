// SubmissionsPage.tsx

'use client';

import React, { useEffect, useState } from 'react';
import SubmissionsFiltersSection from '@/view/films/sections/SubmissionsFiltersSection';
import SubmissionsTableSection from '@/view/films/sections/SubmissionsTableSection';

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');
  const [judgingFilter, setJudgingFilter] = useState('All');

  useEffect(() => {
    // Fetch submissions using the same logic as in SubmissionsTableSection
    async function fetchSubmissions() {
      const token = typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
      if (!token) return setSubmissions([]);
      const res = await fetch('/api/submissions', {
        headers: { Authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (!res.ok) return setSubmissions([]);
      const data = await res.json();
      setSubmissions(Array.isArray(data.submissions) ? data.submissions : []);
      setLoading(false);
    }
    fetchSubmissions();
  }, []);

  // Filtering logic
  const filtered = submissions.filter((item) => {
    // Map status for filtering
    let submissionStatus = 'Rejected';
    let judgingStatus = '';
    if (item.submission_status === 'accept') {
      submissionStatus = 'Accepted';
    } else if (item.submission_status === 'reject') {
      submissionStatus = 'Rejected';
    } else if (item.submission_status === 'under_review') {
      submissionStatus = 'Accepted';
      judgingStatus = 'Under Review';
    } else if (item.submission_status === 'shortlist') {
      submissionStatus = 'Accepted';
      judgingStatus = 'Shortlist';
    } else if (item.submission_status === 'nominee') {
      submissionStatus = 'Accepted';
      judgingStatus = 'Nominee';
    }
    // Filter logic
    const statusMatch = statusFilter === 'All' || submissionStatus === statusFilter;
    const judgingMatch = judgingFilter === 'All' || judgingStatus === judgingFilter;
    return statusMatch && judgingMatch;
  });

  // Map to the shape expected by SubmissionsTableSection
  const mapped = filtered.map((item) => {
    let submissionStatus = 'Rejected';
    let judgingStatus = '';
    if (item.submission_status === 'accept') {
      submissionStatus = 'Accepted';
    } else if (item.submission_status === 'reject') {
      submissionStatus = 'Rejected';
    } else if (item.submission_status === 'under_review') {
      submissionStatus = 'Accepted';
      judgingStatus = 'Under Review';
    } else if (item.submission_status === 'shortlist') {
      submissionStatus = 'Accepted';
      judgingStatus = 'Shortlist';
    } else if (item.submission_status === 'nominee') {
      submissionStatus = 'Accepted';
      judgingStatus = 'Nominee';
    }
    return {
      id: item.id?.toString() ?? '',
      film: item.film?.title ?? '-',
      festival: item.event?.title ?? '-',
      eventDate: item.event?.deadline ?? '-',
      submissionStatus,
      judgingStatus,
      comments: item.comments || '',
      image: item.film?.filmPosterUrl || '/image/10.svg',
    };
  });

  return (
    <div className="flex flex-col gap-6">
      <SubmissionsFiltersSection
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        judgingFilter={judgingFilter}
        setJudgingFilter={setJudgingFilter}
        total={mapped.length}
      />
      <SubmissionsTableSection submissions={mapped} loading={loading} />
    </div>
  );
}
