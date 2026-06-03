import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import crypto from 'crypto'
import { db } from '@/lib/db'
import { sendPasswordResetEmail } from '@/lib/email'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const { email } = schema.parse(await req.json())

    const user = await db.user.findUnique({ where: { email } })
    if (user) {
      const token = crypto.randomBytes(32).toString('hex')
      await db.verificationToken.create({
        data: {
          identifier: email,
          token,
          expires: new Date(Date.now() + 60 * 60 * 1000),
        },
      })
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}&email=${email}`
      await sendPasswordResetEmail(email, resetUrl)
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
