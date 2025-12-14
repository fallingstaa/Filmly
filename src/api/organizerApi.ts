// src/api/organizerApi.ts
// Handles organizer-specific API calls for Filmly backend

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// ============================================================================
// EVENT MANAGEMENT
// ============================================================================

/**
 * Create a new event (Premium users only)
 */
export async function createEvent(eventData: {
  title: string;
  genre: string[];
  description?: string;
  duration?: number;
  location?: string;
  language: string;
  deadline: string;
  previousDeadline?: string;
}, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const res = await fetch(`${API_URL}/api/events`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(eventData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to create event');
  return data;
}

/**
 * Get all events owned by the authenticated user
 */
export async function getMyEvents(accessToken?: string, limit?: number, offset?: number) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const params = new URLSearchParams({ my: 'true' });
  if (limit !== undefined) params.append('limit', limit.toString());
  if (offset !== undefined) params.append('offset', offset.toString());

  const res = await fetch(`${API_URL}/api/events?${params.toString()}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch events');
  return data;
}

/**
 * Get all public events
 */
export async function getAllEvents(limit?: number, offset?: number) {
  const params = new URLSearchParams();
  if (limit !== undefined) params.append('limit', limit.toString());
  if (offset !== undefined) params.append('offset', offset.toString());

  const res = await fetch(`${API_URL}/api/events?${params.toString()}`, {
    method: 'GET',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch events');
  return data;
}

/**
 * Get a specific event by ID
 */
export async function getEventById(eventId: number, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: 'GET',
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch event');
  return data;
}

/**
 * Update an event (owner only)
 */
export async function updateEvent(eventId: number, updates: {
  title?: string;
  genre?: string[];
  description?: string;
  duration?: number;
  location?: string;
  language?: string;
  deadline?: string;
  previousDeadline?: string;
}, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const res = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(updates),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to update event');
  return data;
}

/**
 * Delete an event (owner only)
 */
export async function deleteEvent(eventId: number, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const res = await fetch(`${API_URL}/api/events/${eventId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to delete event');
  return data;
}

// ============================================================================
// ANALYTICS
// ============================================================================

/**
 * Get analytics data for the authenticated organizer
 */
export async function getOrganizerAnalytics(accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const res = await fetch(`${API_URL}/api/analytics/organizer`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch analytics');
  return data;
}

// ============================================================================
// SUBMISSION MANAGEMENT
// ============================================================================

/**
 * Get all submissions for a specific event
 */
export async function getEventSubmissions(eventId: number, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/events/${eventId}/submissions`, {
    method: 'GET',
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch submissions');
  return data;
}

/**
 * Update submission status (not directly exposed in current API, but keeping for future use)
 * Note: Current backend doesn't have a PATCH endpoint for submissions,
 * but we can add this when needed
 */
export async function updateSubmissionStatus(
  submissionId: number,
  status: 'submitted' | 'under_review' | 'reviewed',
  accessToken?: string
) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const res = await fetch(`${API_URL}/api/submissions/${submissionId}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ submissionStatus: status }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to update submission status');
  return data;
}

// ============================================================================
// WINNER MANAGEMENT
// ============================================================================

/**
 * Get all winners for a specific event
 */
export async function getEventWinners(eventId: number, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  const headers: Record<string, string> = {};
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_URL}/api/events/${eventId}/winners`, {
    method: 'GET',
    headers,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch winners');
  return data;
}

/**
 * Assign a winner to an event
 */
export async function assignWinner(eventId: number, winnerData: {
  eventFilmSubmissionId: number;
  category: string;
  filmCrewId?: number;
}, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const res = await fetch(`${API_URL}/api/events/${eventId}/winners`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify(winnerData),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to assign winner');
  return data;
}

/**
 * Delete a winner
 */
export async function deleteWinner(eventId: number, winnerId: number, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const res = await fetch(`${API_URL}/api/events/${eventId}/winners/${winnerId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to delete winner');
  return data;
}

// ============================================================================
// IMAGE MANAGEMENT
// ============================================================================

/**
 * Upload an image for an event
 */
export async function uploadEventImage(eventId: number, imageFile: File, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const formData = new FormData();
  formData.append('image', imageFile);

  const res = await fetch(`${API_URL}/api/events/${eventId}/images`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to upload image');
  return data;
}

/**
 * Get all images for an event
 */
export async function getEventImages(eventId: number) {
  const res = await fetch(`${API_URL}/api/events/${eventId}/images`, {
    method: 'GET',
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to fetch images');
  return data;
}

/**
 * Delete a specific image
 */
export async function deleteEventImage(eventId: number, imageId: number, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const res = await fetch(`${API_URL}/api/events/${eventId}/images/${imageId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to delete image');
  return data;
}

/**
 * Delete all images for an event
 */
export async function deleteAllEventImages(eventId: number, accessToken?: string) {
  const token = accessToken || (typeof window !== 'undefined' ? localStorage.getItem('access_token') : null);

  if (!token) {
    throw new Error('No access token available');
  }

  const res = await fetch(`${API_URL}/api/events/${eventId}/images`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${token}`,
    },
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.error || data.message || 'Failed to delete images');
  return data;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Check if user is authenticated
 */
export function isAuthenticated(): boolean {
  return typeof window !== 'undefined' && !!localStorage.getItem('access_token');
}

/**
 * Get access token
 */
export function getAccessToken(): string | null {
  return typeof window !== 'undefined' ? localStorage.getItem('access_token') : null;
}
