import { NextResponse } from 'next/server'
import { createEmailVerification, getUserByEmail, deleteExpiredVerifications } from '@/lib/db'

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'

function generateToken(): string {
  return Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2)
}

async function sendVerificationEmail(email: string, username: string, token: string) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email send')
    console.log(`Verification link: ${APP_URL}/verify-email?token=${token}`)
    return true
  }

  const verificationUrl = `${APP_URL}/verify-email?token=${token}`

  // Use environment variable for sender or default to Resend onboarding
  const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
  const FROM_NAME = process.env.FROM_NAME || 'TubeFission'

  try {
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
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2 style="color: #111827;">Welcome to TubeFission, ${username}!</h2>
            <p style="color: #4B5563; font-size: 16px;">
              Thank you for signing up. Please verify your email address to complete your registration.
            </p>
            <div style="margin: 30px 0;">
              <a href="${verificationUrl}"
                 style="background-color: #111827; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; display: inline-block; font-weight: 500;">
                Verify Email Address
              </a>
            </div>
            <p style="color: #6B7280; font-size: 14px;">
              Or copy and paste this link into your browser:<br>
              <a href="${verificationUrl}" style="color: #3B82F6;">${verificationUrl}</a>
            </p>
            <p style="color: #9CA3AF; font-size: 12px; margin-top: 30px;">
              This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.
            </p>
          </div>
        `,
      }),
    })

    if (!response.ok) {
      let errorData: { message: string } = { message: 'Unknown error' }
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
