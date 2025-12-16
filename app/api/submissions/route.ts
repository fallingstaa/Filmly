// POST /api/submissions
export async function POST(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || request.headers.get('Authorization');
  if (!authHeader) {
    console.error('Missing Authorization header');
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
  }
  try {
    const body = await request.json();
    console.log('Submitting to festival:', body);
    // Proxy to backend API (replace with your backend URL)
    const BACKEND_URL = 'https://filmly-backend.vercel.app/api/submissions';
    const backendRes = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authHeader,
      },
      body: JSON.stringify(body),
    });
    let data;
    const contentType = backendRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await backendRes.json();
    } else {
      data = await backendRes.text();
    }
    console.log('Backend response status:', backendRes.status);
    console.log('Backend response data:', data);
    return NextResponse.json(data, { status: backendRes.status });
  } catch (e: any) {
    console.error('Error submitting to festival:', e);
    return NextResponse.json({ error: e.message || 'Failed to submit film to festival' }, { status: 500 });
  }
}
// route.ts

import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;


// GET /api/submissions
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  let userUid = null;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    userUid = getUidFromAuthHeader(authHeader);
  }

  let userId = null;
  if (userUid && token) {
    try {
        const userProfileRes = await fetch(
            `${SUPABASE_URL}/rest/v1/user_profile?select=id&uuid=eq.${userUid}`,
            {
                headers: {
                    apikey: SUPABASE_ANON_KEY,
                    // Use the user's token for RLS
                    authorization: `Bearer ${token}`, 
                },
            }
        );

        if (!userProfileRes.ok) {
            console.error('Failed to fetch user profile:', userProfileRes.status, await userProfileRes.text());
        } else {
            const userProfiles = await userProfileRes.json();
            if (Array.isArray(userProfiles) && userProfiles.length > 0) {
                userId = userProfiles[0].id;
            }
        }
    } catch (e) {
        console.error('Exception fetching user profile:', e);
    }
  }

  // Base query: select all submission data and join film/event details
  let query = `${SUPABASE_URL}/rest/v1/event_film_submission?select=*,film(*),event(*)`;
  
  // Conditionally filter submissions by the user's ID
  if (userId) {
    // ASSUMPTION: 'film' table has a column named 'uid' which stores the user's custom ID.
    query += `&film.uid=eq.${userId}`;
  } else {
    // If no user ID is found (e.g., bad token or profile not found), 
    // we should prevent unauthorized access based on RLS. 
    // If RLS is set up correctly, the query below will return [] if not authenticated.
    // If you need to return submissions for *all* users when not logged in, 
    // remove this 'else' block and ensure RLS permits public read access.
  }

  const subsRes = await fetch(query, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      // Use the user's token for RLS enforcement on the main query
      ...(token ? { authorization: `Bearer ${token}` } : {}), 
    },
  });
  
  if (!subsRes.ok) {
    console.error('Failed to fetch submissions from Supabase:', subsRes.status, await subsRes.text());
    return NextResponse.json({ error: 'Failed to fetch submissions' }, { status: subsRes.status });
  }
  
  const submissions = await subsRes.json();
  
  console.log('Raw submissions:', submissions);
  
  // Returning the data in the structure that SubmissionsTableSection.tsx now expects:
  return NextResponse.json({ submissions });
}

// Helper to extract the UUID from the Bearer token (JWT)
function getUidFromAuthHeader(authHeader: string): string | null {
  // Format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  // Decode JWT to get the 'sub' (uuid) claim
  try {
    // The payload is the second part of the JWT
    const base64Payload = token.split('.')[1];
    if (!base64Payload) return null;
    
    // JWT payload is base64url encoded, need to convert to standard base64 for Buffer
    let payloadString = base64Payload.replace(/-/g, '+').replace(/_/g, '/');
    while (payloadString.length % 4) {
        payloadString += '=';
    }

    const payload = JSON.parse(Buffer.from(payloadString, 'base64').toString('utf-8'));
    return payload.sub || null;
  } catch {
    return null;
  }
}