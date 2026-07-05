import { PrismaClient } from '@prisma/client'

// Initialize Prisma client for shared auth with TikTok Intelligence
let prisma: PrismaClient | null = null

export function getPrisma(): PrismaClient {
  if (!prisma) {
    // Use TikTok's database URL for shared auth
    const databaseUrl = process.env.TIKTOK_DATABASE_URL || process.env.DATABASE_URL
    if (!databaseUrl) {
      throw new Error('DATABASE_URL not configured')
    }
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: databaseUrl,
        },
      },
    })
  }
  return prisma
}

// User type matching TikTok's schema
export interface User {
  id: string
  username: string
  email: string
  passwordHash: string
  emailVerified: boolean
  createdAt: Date
  lastLogin: Date | null
  updatedAt: Date
}

// User functions - using TikTok's schema
export async function createUser(username: string, email: string, passwordHash: string): Promise<User> {
  const db = getPrisma()
  return await db.user.create({
    data: {
      username,
      email,
      passwordHash,
      emailVerified: false,
    },
  }) as User
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = getPrisma()
  return await db.user.findUnique({
    where: { email },
  }) as User | null
}

export async function getUserByUsername(username: string): Promise<User | null> {
  const db = getPrisma()
  return await db.user.findUnique({
    where: { username },
  }) as User | null
}

export async function verifyUserEmail(userId: string): Promise<void> {
  const db = getPrisma()
  await db.user.update({
    where: { id: userId },
    data: { emailVerified: true },
  })
}

export async function updateLastLogin(userId: string): Promise<void> {
  const db = getPrisma()
  await db.user.update({
    where: { id: userId },
    data: { lastLogin: new Date() },
  })
}

// Email verification
export interface EmailVerification {
  id: string
  userId: string
  token: string
  expiresAt: Date
  verifiedAt: Date | null
  createdAt: Date
}

export async function createEmailVerification(userId: string, token: string, expiresAt: Date): Promise<EmailVerification> {
  const db = getPrisma()
  return await db.emailVerification.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  }) as EmailVerification
}

export async function getVerificationByToken(token: string): Promise<EmailVerification | null> {
  const db = getPrisma()
  return await db.emailVerification.findUnique({
    where: { token },
  }) as EmailVerification | null
}

export async function markVerificationUsed(token: string): Promise<void> {
  const db = getPrisma()
  await db.emailVerification.update({
    where: { token },
    data: { verifiedAt: new Date() },
  })
}

export async function deleteExpiredVerifications(): Promise<void> {
  const db = getPrisma()
  await db.emailVerification.deleteMany({
    where: {
      expiresAt: { lt: new Date() },
      verifiedAt: null,
    },
  })
}

// Session management for shared auth
export async function createSession(userId: string, token: string, expiresAt: Date) {
  const db = getPrisma()
  return await db.session.create({
    data: {
      userId,
      token,
      expiresAt,
    },
  })
}

export async function getSessionByToken(token: string) {
  const db = getPrisma()
  return await db.session.findUnique({
    where: { token },
    include: { user: true },
  })
}

export async function deleteSession(token: string): Promise<void> {
  const db = getPrisma()
  await db.session.delete({
    where: { token },
  })
}

export async function getValidSessionByToken(token: string) {
  const db = getPrisma()
  const session = await db.session.findUnique({
    where: { token },
    include: { user: true },
  })

  if (!session || session.expiresAt < new Date()) {
    return null
  }

  return session
}
