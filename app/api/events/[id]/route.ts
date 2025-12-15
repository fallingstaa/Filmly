import { NextRequest, NextResponse } from 'next/server';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  if (!id) {
    return NextResponse.json({ error: 'Missing event id' }, { status: 400 });
  }

  // Fetch single event from Supabase REST API
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/event?id=eq.${encodeURIComponent(id)}`,
    {
      headers: {
        apikey: SUPABASE_ANON_KEY,
      },
    }
  );

  if (!res.ok) {
    return NextResponse.json({ error: 'Failed to fetch event' }, { status: res.status });
  }
  const data = await res.json();
  // Supabase returns an array, get the first item
  const event = Array.isArray(data) ? data[0] : null;
  if (!event) {
    return NextResponse.json({ error: 'Event not found' }, { status: 404 });
  }
  return NextResponse.json({ event });
}
