import { NextResponse } from 'next/server';

// You may want to use environment variables for these
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET() {
  // Fetch events from Supabase REST API
  const res = await fetch(`${SUPABASE_URL}/rest/v1/event`, {
    headers: {
      apikey: SUPABASE_ANON_KEY,
      // Remove Authorization header for anon access
    },
  });
  if (!res.ok) {
    return NextResponse.json({ events: [] }, { status: res.status });
  }
  const data = await res.json();
  // Optionally map/transform data here
  return NextResponse.json({ events: data });
}
