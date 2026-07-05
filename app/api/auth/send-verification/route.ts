import { NextResponse } from 'next/server'
import { createEmailVerification, getUserByEmail, deleteExpiredVerifications } from '@/lib/auth-db'
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
    return process.env.NODE_ENV === 'development'
  }

  const verificationUrl = `${APP_URL}/verify-email?token=${token}`
  console.log('Generating verification URL:', verificationUrl)

  // Use environment variable for sender
  const FROM_EMAIL = process.env.FROM_EMAIL || 'verify@tubefission.com'
  const FROM_NAME = process.env.FROM_NAME || 'TubeFission'

  console.log('Sending email with from:', `${FROM_NAME} <${FROM_EMAIL}>`)

  try {
    // Send email with both text and HTML versions
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

Visit: ${verificationUrl}

This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.

TubeFission - YouTube Intelligence Platform`,
        html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify your TubeFission account</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f3f4f6;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width: 600px; width: 100%; background-color: #ffffff; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="padding: 40px;">
              <h1 style="margin: 0 0 20px 0; color: #111827; font-size: 24px; font-weight: 600;">Welcome to TubeFission, ${username}!</h1>
              <p style="margin: 0 0 24px 0; color: #4b5563; font-size: 16px; line-height: 1.6;">Thank you for signing up. Please verify your email address to complete your registration.</p>
              <table cellpadding="0" cellspacing="0" border="0" style="margin: 24px 0;">
                <tr>
                  <td style="background-color: #111827; border-radius: 6px; text-align: center;">
                    <a href="${verificationUrl}" style="display: inline-block; padding: 14px 28px; color: #ffffff; text-decoration: none; font-weight: 500; font-size: 16px;">Verify Email Address</a>
                  </td>
                </tr>
              </table>
              <p style="margin: 24px 0 0 0; color: #6b7280; font-size: 14px; line-height: 1.5;">This link will expire in 24 hours. If you did not create an account, you can safely ignore this email.</p>
            </td>
          </tr>
          <tr>
            <td style="padding: 24px 40px; border-top: 1px solid #e5e7eb; background-color: #f9fafb; border-radius: 0 0 8px 8px;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">TubeFission - YouTube Intelligence Platform</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`,
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

    if (user.emailVerified) {
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
