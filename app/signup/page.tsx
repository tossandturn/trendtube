'use client'

import { useState } from 'react'
import Link from 'next/link'

export default function SignupPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [devToken, setDevToken] = useState('')
  const [successMessage, setSuccessMessage] = useState('')
  const [emailSent, setEmailSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (username.length < 3 || username.length > 20) {
      setError('Username must be 3-20 characters')
      setLoading(false)
      return
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      setError('Username can only contain letters, numbers, and underscores')
      setLoading(false)
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters')
      setLoading(false)
      return
    }

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Registration failed')
      } else {
        setSuccess(true)
        setSuccessMessage(data.message || 'Registration successful. Please check your email to verify your account.')
        setEmailSent(!!data.emailSent)
        if (data.devToken) {
          setDevToken(data.devToken)
        }
      }
    } catch {
      setError('Network error')
    }
    setLoading(false)
  }

  async function resendVerification() {
    try {
      const res = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      alert(res.ok ? 'Verification email resent!' : data.error || 'Failed to resend verification email')
    } catch {
      alert('Network error')
    }
  }

  if (success) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
        <div className="w-full max-w-md">
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <div className={`mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full text-sm font-black ${emailSent ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
              {emailSent ? 'OK' : '!'}
            </div>
            <h1 className="mb-2 text-2xl font-bold text-gray-900">Verify your email</h1>
            <p className="mb-4 text-gray-600">
              {emailSent ? 'We sent a verification link to ' : 'Your account was created for '}
              <strong>{email}</strong>
            </p>
            <p className="mb-6 text-sm text-gray-500">{successMessage}</p>

            {devToken && (
              <div className="mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
                <p className="mb-2 text-sm font-medium text-yellow-800">Development Mode</p>
                <p className="mb-2 text-xs text-yellow-700">Email not configured. Use this link to verify:</p>
                <a href={`/verify-email?token=${devToken}`} className="break-all text-xs text-blue-600 hover:text-blue-700">
                  {`http://localhost:3000/verify-email?token=${devToken}`}
                </a>
              </div>
            )}

            <Link href="/login" className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-2.5 font-medium text-white hover:bg-gray-800">
              Go to Login
            </Link>

            <div className="mt-6 text-sm text-gray-500">
              Didn&apos;t receive the email?{' '}
              <button onClick={resendVerification} className="font-medium text-blue-600 hover:text-blue-700">
                Resend
              </button>
            </div>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Create account</h1>
          <p className="mb-6 text-gray-600">Start tracking viral opportunities today.</p>

          {error && <div className="mb-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{error}</div>}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
                minLength={3}
                maxLength={20}
                pattern="^[a-zA-Z0-9_]+$"
                placeholder="Choose a username"
              />
              <p className="mt-1 text-xs text-gray-500">3-20 characters, letters, numbers, underscores only</p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                required
              />
              <p className="mt-1 text-xs text-gray-500">At least 6 characters</p>
            </div>
            <button type="submit" disabled={loading} className="w-full rounded-lg bg-gray-900 py-2.5 font-medium text-white transition-colors hover:bg-gray-800 disabled:opacity-50">
              {loading ? 'Creating account...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-500">Already have an account? </span>
            <Link href="/login" className="font-medium text-blue-600 hover:text-blue-700">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
