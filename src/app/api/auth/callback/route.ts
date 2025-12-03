import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  if (code) {
    const cookieStore = await cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            cookieStore.set({ name, value, ...options })
          },
          remove(name: string, options: any) {
            cookieStore.delete({ name, ...options })
          },
        },
      }
    )
    
    // Exchange the code for session to check user data, but don't keep the session for recovery
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      return NextResponse.redirect(`${requestUrl.origin}/auth?error=${encodeURIComponent(error.message)}`)
    }
    
    // Check if this is a password recovery session
    if (data.session?.user) {
      const user = data.session.user
      const recoveryTime = user.recovery_sent_at
      
      if (recoveryTime) {
        const recoveryDate = new Date(recoveryTime)
        const now = new Date()
        const timeDiff = now.getTime() - recoveryDate.getTime()
        const minutesDiff = timeDiff / (1000 * 60)
        
        // If recovery was sent within last 30 minutes, treat as recovery session
        if (minutesDiff <= 30) {
          // Sign out the user so they must complete password reset to be authenticated
          await supabase.auth.signOut()
          // Pass the code to reset password page so it can handle the session when password is updated
          return NextResponse.redirect(`${requestUrl.origin}/auth/reset-password?code=${code}`)
        }
      }
    }
  }

  // URL to redirect to after sign in process completes
  return NextResponse.redirect(`${requestUrl.origin}/dashboard`)
}