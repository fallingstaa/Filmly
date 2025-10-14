'use client'

import { supabase } from '@/lib/supabase'
import { Auth } from '@supabase/auth-ui-react'
import { ThemeSupa } from '@supabase/auth-ui-shared'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function AuthPage() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)

  useEffect(() => {
    // Check if user is already signed in
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (session) {
        router.push('/dashboard') // Redirect to dashboard if already authenticated
      }
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (session) {
        router.push('/dashboard') // Redirect on successful auth
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  if (session) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Already Authenticated</h1>
          <p className="text-gray-600">Redirecting to dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Filmly</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>
        
        <Auth
          supabaseClient={supabase}
          appearance={{ 
            theme: ThemeSupa,
            variables: {
              default: {
                colors: {
                  brand: '#000000',
                  brandAccent: '#333333',
                }
              }
            }
          }}
          providers={['google']}
          redirectTo={typeof window !== 'undefined' ? `${window.location.origin}/api/auth/callback` : '/api/auth/callback'}
        />
        
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            By signing in, you agree to our{' '}
            <a href="/terms" className="text-blue-600 hover:underline">
              Terms of Service
            </a>{' '}
            and{' '}
            <a href="/privacy" className="text-blue-600 hover:underline">
              Privacy Policy
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}