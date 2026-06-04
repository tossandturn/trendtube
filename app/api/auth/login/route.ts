import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail, updateLastLogin, createSession } from '@/lib/auth-db'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const user = await getUserByEmail(email)
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return NextResponse.json({
        error: 'Email not verified',
        requiresVerification: true,
        email: user.email
      }, { status: 403 })
    }

    const valid = await bcrypt.compare(password, user.passwordHash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    await updateLastLogin(user.id)

    // Create session token
    const sessionToken = Buffer.from(`${user.id}:${Date.now()}`).toString('base64')
    const expiresAt = new Date()
    expiresAt.setDate(expiresAt.getDate() + 7)
    await createSession(user.id, sessionToken, expiresAt)

    return NextResponse.json({
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        emailVerified: user.emailVerified
      },
      token: sessionToken
    })
  } catch (err) {
    console.error('Login error:', err)
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
