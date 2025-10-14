'use client'

import { supabase } from '@/lib/supabase'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        setUser(session.user)
      } else {
        router.push('/auth')
      }
      setLoading(false)
    }

    getUser()
  }, [router])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return null // Will redirect to auth
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">Filmly Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-700">Welcome, {user.email}</span>
              <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                User Information
              </h3>
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Email</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.email}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">User ID</dt>
                  <dd className="mt-1 text-sm text-gray-900">{user.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created At</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(user.created_at).toLocaleDateString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Sign In</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString() : 'N/A'}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

        </div>
      </main>
    </div>
  )
}