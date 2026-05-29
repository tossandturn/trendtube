import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { createUser, getUserByEmail } from '@/lib/db'

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()
    if (!email || !password || password.length < 6) {
      return NextResponse.json({ error: 'Invalid input' }, { status: 400 })
    }
    const existing = getUserByEmail(email)
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 })
    }
    const hash = await bcrypt.hash(password, 10)
    const user = createUser(email, hash)
    return NextResponse.json({ user: { id: user.id, email: user.email } })
  } catch (err) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 })
  }
}
