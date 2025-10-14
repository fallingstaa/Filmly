'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'

export default function AuthCallback() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      const { data, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Error during auth callback:', error.message)
        router.push('/auth?error=' + encodeURIComponent(error.message))
        return
      }

      if (data.session) {
        // User is authenticated, redirect to dashboard
        router.push('/dashboard')
      } else {
        // No session found, redirect back to auth
        router.push('/auth')
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Processing authentication...</p>
      </div>
    </div>
  )
}