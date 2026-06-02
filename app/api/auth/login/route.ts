import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByEmail, updateLastLogin } from '@/lib/db'

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
    if (!user.email_verified) {
      return NextResponse.json({
        error: 'Email not verified',
        requiresVerification: true,
        email: user.email
      }, { status: 403 })
    }

    const valid = await bcrypt.compare(password, user.password_hash)
    if (!valid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }
    await updateLastLogin(user.id)
    return NextResponse.json({ user: { id: user.id, username: user.username, email: user.email, emailVerified: true } })
  } catch (err) {
    return NextResponse.json({ error: 'Login failed' }, { status: 500 })
  }
}
