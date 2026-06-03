import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'

const schema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
  name: z.string().min(1),
  password: z.string().min(8),
})

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, code, name, password } = schema.parse(body)

    const token = await db.otpToken.findFirst({
      where: { email, code, used: false, expires: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    })

    if (!token) {
      return NextResponse.json({ error: 'Invalid or expired code' }, { status: 400 })
    }

    await db.otpToken.update({ where: { id: token.id }, data: { used: true } })

    const existingUser = await db.user.findUnique({ where: { email } })
    if (existingUser) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 12)
    const user = await db.user.create({
      data: { name, email, passwordHash, emailVerified: new Date() },
    })

    return NextResponse.json({ success: true, userId: user.id })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid data' }, { status: 400 })
    return NextResponse.json({ error: 'Verification failed' }, { status: 500 })
  }
}
