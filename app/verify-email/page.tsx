'use client'

import { Suspense, useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>(token ? 'loading' : 'error')
  const [message, setMessage] = useState(token ? 'Verifying your email...' : 'Invalid verification link. Please check your email for the correct link.')

  useEffect(() => {
    if (!token) {
      return
    }

    async function verifyToken() {
      try {
        const res = await fetch(`/api/auth/verify-email?token=${token}`)
        const data = await res.json()

        if (res.ok) {
          setStatus('success')
          setMessage('Your email has been verified successfully!')
        } else {
          setStatus('error')
          setMessage(data.error || 'Verification failed. The link may have expired.')
        }
      } catch {
        setStatus('error')
        setMessage('Network error. Please try again.')
      }
    }

    verifyToken()
  }, [token])

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      {status === 'loading' && (
        <>
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" aria-hidden="true" />
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Verifying...</h1>
          <p className="text-gray-600">{message}</p>
        </>
      )}

      {status === 'success' && (
        <>
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-sm font-black text-green-700" aria-hidden="true">
            OK
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Email Verified!</h1>
          <p className="mb-6 text-gray-600">{message}</p>
          <Link href="/login" className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-2.5 font-medium text-white hover:bg-gray-800">
            Sign In
          </Link>
        </>
      )}

      {status === 'error' && (
        <>
          <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-lg font-black text-red-700" aria-hidden="true">
            !
          </div>
          <h1 className="mb-2 text-2xl font-bold text-gray-900">Verification Failed</h1>
          <p className="mb-6 text-gray-600">{message}</p>
          <div className="flex flex-col gap-3">
            <Link href="/signup" className="inline-flex items-center justify-center rounded-lg bg-gray-900 px-6 py-2.5 font-medium text-white hover:bg-gray-800">
              Back to Sign Up
            </Link>
            <Link href="/login" className="inline-flex items-center justify-center rounded-lg border border-gray-300 px-6 py-2.5 font-medium text-gray-700 hover:bg-gray-50">
              Go to Login
            </Link>
          </div>
        </>
      )}
    </div>
  )
}

function LoadingState() {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
      <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-gray-200 border-t-gray-900" aria-hidden="true" />
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Loading...</h1>
    </div>
  )
}

export default function VerifyEmailPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <Suspense fallback={<LoadingState />}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </main>
  )
}
