// import { NextRequest, NextResponse } from 'next/server';

// const BACKEND_URL = 'https://filmly-backend.vercel.app/api/filmmaker/dashboard';

// export async function GET(req: NextRequest) {
//   const authHeader = req.headers.get('authorization') || req.headers.get('Authorization');
//   if (!authHeader) {
//     return NextResponse.json({ error: 'Missing Authorization header' }, { status: 401 });
//   }
//   try {
//     const backendRes = await fetch(BACKEND_URL, {
//       headers: {
//         Authorization: authHeader,
//       },
//     });
//     const contentType = backendRes.headers.get('content-type');
//     if (!contentType || !contentType.includes('application/json')) {
//       const text = await backendRes.text();
//       return NextResponse.json({ error: 'Backend did not return JSON', details: text }, { status: 500 });
//     }
//     const data = await backendRes.json();
//     return NextResponse.json(data, { status: backendRes.status });
//   } catch (e: any) {
//     return NextResponse.json({ error: e.message || 'Failed to fetch analytics' }, { status: 500 });
//   }
// }
