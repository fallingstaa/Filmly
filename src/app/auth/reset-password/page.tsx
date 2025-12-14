"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"

export default function ResetPasswordPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")

  useEffect(() => {
    const handleAuthTokens = async () => {
      setLoading(true)
      
      // First check for tokens in URL fragment (hash) - direct from Supabase
      if (window.location.hash) {
        const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ""))
        const accessToken = hashParams.get("access_token")
        const refreshToken = hashParams.get("refresh_token")
        
        if (accessToken) {
          setAccessToken(accessToken)
          
          // Set the session with the recovery tokens
          const { error: setSessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken || "",
          })
          
          if (setSessionError) {
            setError(setSessionError.message)
          }
          
          setLoading(false)
          return
        }
      }
      
      // Check for query parameters first
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get("code")
      const accessToken = searchParams.get("access_token")
      
      if (code) {
        // We have a code from password recovery, but don't exchange it yet
        // We'll exchange it only when the user successfully updates their password
        console.log('Password recovery code found, waiting for password update')
        setAccessToken("pending") // Use a placeholder to show the form
        setLoading(false)
        return
      }
      
      // Check for existing session (for other flows)
      const { data: sessionData } = await supabase.auth.getSession()
      
      if (sessionData.session) {
        console.log('Found existing session')
        setAccessToken(sessionData.session.access_token)
        setLoading(false)
        return
      }
      
      if (accessToken) {
        setAccessToken(accessToken)
        
        const refreshToken = searchParams.get("refresh_token")
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken || "",
        })
        
        if (setSessionError) {
          setError(setSessionError.message)
        }
      } else {
        setError("No recovery token found. Make sure you opened the link from your email.")
      }
      
      setLoading(false)
    }

    handleAuthTokens()
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!password || password.length < 6) {
      setError("Password must be at least 6 characters")
      return
    }

    if (password !== confirm) {
      setError("Passwords do not match")
      return
    }

    setLoading(true)

    // Check if we have a code that needs to be exchanged first
    const searchParams = new URLSearchParams(window.location.search)
    const code = searchParams.get("code")

    if (code && accessToken === "pending") {
      // Exchange the code for a session first
      const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
      
      if (exchangeError) {
        setLoading(false)
        setError(exchangeError.message)
        return
      }
      
      if (!data.session) {
        setLoading(false)
        setError("Failed to establish session for password reset")
        return
      }
      
      // Now update the password using the new session
      const { error: updateError } = await supabase.auth.updateUser({ password })
      
      if (updateError) {
        setLoading(false)
        setError(updateError.message)
        return
      }
    } else {
      // Regular password update for existing session
      const { error: updateError } = await supabase.auth.updateUser({ password })

      if (updateError) {
        setLoading(false)
        setError(updateError.message)
        return
      }
    }

    setLoading(false)
    setMessage("Your password has been updated. Redirecting to dashboard...")

    // Clear any error states and redirect to dashboard since user is now authenticated
    setTimeout(() => router.push("/dashboard"), 2000)
  }

  return (
    <div style={{ maxWidth: 520, margin: "48px auto", padding: 24 }}>
