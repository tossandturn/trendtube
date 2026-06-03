import { NextResponse } from 'next/server'
import { createEmailVerification, getUserByEmail, deleteExpiredVerifications } from '@/lib/db'
import { randomBytes } from 'crypto'

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
// Use production URL as fallback for API routes (server-side only)
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tubefission.com'

function generateToken(): string {
  // Generate a URL-safe random token (16 bytes = 32 hex characters)
  return randomBytes(16).toString('hex')
}

async function sendVerificationEmail(email: string, username: string, token: string) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email send')
    console.log(`Verification link: ${APP_URL}/verify-email?token=${token}`)
    return true
  }

  const verificationUrl = `${APP_URL}/verify-email?token=${token}`
  console.log('Generating verification URL:', verificationUrl)

  // Use environment variable for sender
  const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
  const FROM_NAME = process.env.FROM_NAME || 'TubeFission'

  console.log('Sending email with from:', `${FROM_NAME} <${FROM_EMAIL}>`)

  try {
    // Use text-only email to avoid spam filter issues with links
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject: 'Verify your TubeFission account',
        text: `Welcome to TubeFission, ${username}!

Thank you for signing up. Please verify your email address to complete your registration.

Copy and paste this link into your browser:
${verificationUrl}

This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.

---
TubeFission - YouTube Intelligence Platform
${APP_URL}`,
      }),
    })

    if (!response.ok) {
      let errorData: { message?: string; name?: string } = { message: 'Unknown error' }
      try {
        errorData = await response.json()
      } catch {
        try {
          errorData = { message: await response.text() }
        } catch {
          errorData = { message: `HTTP ${response.status}` }
        }
      }
      console.error('Failed to send email:', {
        status: response.status,
        statusText: response.statusText,
        error: errorData,
        from: FROM_EMAIL,
        to: email,
        url: verificationUrl,
      })
      return false
    }

    const data = await response.json()
    console.log('Email sent successfully:', { id: data.id, to: email })
    return true
  } catch (error) {
    console.error('Error sending email:', error)
    return false
  }
}

export async function POST(req: Request) {
  try {
    const { email } = await req.json()

    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Clean up expired tokens
    await deleteExpiredVerifications()

    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    if (user.email_verified) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    // Generate token and create verification record
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24) // 24 hours expiry

    await createEmailVerification(user.id, token, expiresAt)

    // Send verification email
    const sent = await sendVerificationEmail(email, user.username, token)

    if (!sent && RESEND_API_KEY) {
      return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent',
      // Include token in development for testing
      ...(process.env.NODE_ENV === 'development' && !RESEND_API_KEY ? { devToken: token } : {})
    })
  } catch (err) {
    console.error('Send verification error:', err)
    return NextResponse.json({ error: 'Failed to send verification email' }, { status: 500 })
  }
}
