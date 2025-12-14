'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';
import AddFilmForm from '../../../../src/view/films/add/AddFilmForm';

export default function Page() {
  const searchParams = useSearchParams();
  const festivalId = searchParams.get('festivalId');

  /**
   * Submission logic:
   * 
   * There are two types of submission:
   * 
   * 1. **AI Matching Submission** (for finding matching festivals):
   *    - Triggered ONLY by clicking "Add Film" in the "Project and AI Matching" tab.
   *    - No festivalId in the URL.
   *    - The form is for uploading a film and getting AI-powered festival recommendations.
   *    - When integrating with backend:
   *      - POST film data to backend for AI matching.
   *      - Backend returns matching festivals/projects.
   *      - Show matching results to user.
   * 
   * 2. **Festival Submission** (submit to a real festival):
   *    - Triggered ONLY by clicking "Submit Your Film" in a festival detail screen.
   *    - festivalId is present in the URL.
   *    - The form is for submitting a film directly to the selected festival.
   *    - When integrating with backend:
   *      - POST film data + festivalId to backend as a festival submission.
   *      - Show confirmation for festival submission.
   * 
   * NOTE: The AddFilmForm component should handle both cases based on festivalId.
   */

  return <AddFilmForm festivalId={festivalId} />;
}