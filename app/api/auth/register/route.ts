import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, getUserByEmail, getUserByUsername, createEmailVerification } from '@/lib/auth-db'
import { randomBytes } from 'crypto'

const RESEND_API_KEY = process.env.RESEND_API_KEY || ''
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://tubefission.com'

function generateToken(): string {
  return randomBytes(16).toString('hex')
}

async function sendVerificationEmail(email: string, username: string, token: string) {
  if (!RESEND_API_KEY) {
    console.log('RESEND_API_KEY not configured, skipping email send')
    console.log(`Verification link: ${APP_URL}/verify-email?token=${token}`)
    return {
      success: process.env.NODE_ENV === 'development',
      devMode: process.env.NODE_ENV === 'development',
      error: 'Email provider is not configured',
    }
  }

  const verificationUrl = `${APP_URL}/verify-email?token=${token}`
  const FROM_EMAIL = process.env.FROM_EMAIL || 'verify@tubefission.com'
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
      const errorText = await response.text()
      console.error('Resend API error:', response.status, errorText)
      return { success: false, error: errorText }
    }

    return { success: true }
  } catch (error) {
    console.error('Error sending email:', error)
    return { success: false, error: String(error) }
  }
}

export async function POST(req: Request) {
  try {
    const { username, email, password } = await req.json()
    if (!username || !email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    if (username.length < 3 || username.length > 20) {
      return NextResponse.json({ error: 'Username must be 3-20 characters' }, { status: 400 })
    }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
      return NextResponse.json({ error: 'Username can only contain letters, numbers, and underscores' }, { status: 400 })
    }
    const existingEmail = await getUserByEmail(email)
    if (existingEmail) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
    const existingUsername = await getUserByUsername(username)
    if (existingUsername) {
      return NextResponse.json({ error: 'Username already taken' }, { status: 409 })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = await createUser(username, email, hash)

    // Generate verification token
    const token = generateToken()
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + 24)
    await createEmailVerification(user.id, token, expiresAt)

    // Send verification email
    const emailResult = await sendVerificationEmail(email, username, token)

    return NextResponse.json({
      success: true,
      emailSent: emailResult.success && !emailResult.devMode,
      message: emailResult.success
        ? 'Registration successful. Please check your email to verify your account.'
        : 'Registration successful, but the verification email could not be sent. Please use resend or contact support.',
      user: { id: user.id, username: user.username, email: user.email, emailVerified: false },
      // Include token in development for testing
      ...(process.env.NODE_ENV === 'development' && !RESEND_API_KEY ? { devToken: token } : {})
    })
  } catch (err: unknown) {
    console.error('Registration error:', err)
    const detail = err instanceof Error ? err.message : 'Unknown error'
    return NextResponse.json({
      error: 'Registration failed',
      detail,
    }, { status: 500 })
  }
}
