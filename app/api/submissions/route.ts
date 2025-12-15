import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(request: NextRequest) {
  // 1. Get the user's JWT from the Authorization header
  const authHeader = request.headers.get('authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'No authorization header' }, { status: 401 });
  }

  // 2. Get the user's UUID from the JWT (Supabase RLS uses this)
  // We'll use the JWT to authorize the Supabase REST requests
  const userUuid = await getUidFromAuthHeader(authHeader);
  if (!userUuid) {
    return NextResponse.json({ error: 'Invalid JWT' }, { status: 401 });
  }

  // 3. Get the user's integer id from user_profile using their UUID
  const userProfileRes = await fetch(
    `${SUPABASE_URL}/rest/v1/user_profile?select=id&uuid=eq.${userUuid}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        authorization: authHeader,
      },
    }
  );
  const userProfiles = await userProfileRes.json();
  if (!userProfiles.length) {
    return NextResponse.json({ submissions: [] });
  }
  const userId = userProfiles[0].id;

  // 4. Get all film ids for this user
  const filmsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/film?uid=eq.${userId}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        authorization: authHeader,
      },
    }
  );
  const films = await filmsRes.json();
  const filmIds = films.map((f: any) => f.id);

  console.log('User films:', filmIds);

  if (!filmIds.length) {
    return NextResponse.json({ submissions: [] });
  }

  // 5. Get all submissions for these films
  const idsList = filmIds.join(',');
  const subsRes = await fetch(
    `${SUPABASE_URL}/rest/v1/event_film_submission?film_id=in.(${idsList})&select=*,film(*),event(*)`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
        authorization: authHeader,
      },
    }
  );
  const submissions = await subsRes.json();

  console.log('Fetched submissions:', submissions);

  return NextResponse.json({ submissions });
}

// Helper to extract the UUID from the Bearer token (JWT)
function getUidFromAuthHeader(authHeader: string): string | null {
  // Format: "Bearer <token>"
  const token = authHeader.split(' ')[1];
  if (!token) return null;
  // Decode JWT to get the 'sub' (uuid) claim
  try {
    const payload = JSON.parse(Buffer.from(token.split('.')[1], 'base64').toString('utf-8'));
    return payload.sub || null;
  } catch {
    return null;
  }
}
