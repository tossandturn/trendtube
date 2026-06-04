import { NextResponse } from 'next/server'
import { getVerificationByToken, markVerificationUsed, verifyUserEmail, deleteExpiredVerifications } from '@/lib/auth-db'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json({ error: 'Token is required' }, { status: 400 })
    }

    // Clean up expired tokens
    await deleteExpiredVerifications()

    const verification = await getVerificationByToken(token)

    if (!verification) {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    if (verification.verifiedAt) {
      return NextResponse.json({ error: 'Email already verified' }, { status: 400 })
    }

    // Check if token is expired
    if (verification.expiresAt < new Date()) {
      return NextResponse.json({ error: 'Token has expired' }, { status: 400 })
    }

    // Mark as verified
    await markVerificationUsed(token)
    await verifyUserEmail(verification.userId)

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (err) {
    console.error('Verify email error:', err)
    return NextResponse.json({ error: 'Failed to verify email' }, { status: 500 })
  }
}
