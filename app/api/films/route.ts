// Increase body size limit for file uploads
export const config = {
  api: {
    bodyParser: false, // Required for FormData
    sizeLimit: '20mb',
  },
};
export async function POST(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
  }
  try {
    // Correctly parse FormData from the request
    const formData = await req.formData();
    // Proxy the FormData to the backend
    const backendRes = await fetch(BACKEND_URL, {
      method: 'POST',
      headers: {
        Authorization: authHeader,
        // Do NOT set content-type for FormData
      },
      body: formData,
    });
    // Try to parse JSON, fallback to text if not JSON
    let data;
    const contentType = backendRes.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      data = await backendRes.json();
    } else {
      data = await backendRes.text();
    }
    return NextResponse.json(data, { status: backendRes.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to create film' }, { status: 500 });
  }
}
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://filmly-backend.vercel.app/api/films';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
  if (!authHeader) {
    return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
  }
  try {
    const backendRes = await fetch(BACKEND_URL, {
      headers: {
        Authorization: authHeader,
      },
    });
    const data = await backendRes.json();
    return NextResponse.json(data, { status: backendRes.status });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || 'Failed to fetch films' }, { status: 500 });
  }
}
