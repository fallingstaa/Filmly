'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    // Navigate to /auth on first client render
    router.push('/auth');
  }, [router]);

  // Optionally render nothing or a small loading indicator
  return null;
}
