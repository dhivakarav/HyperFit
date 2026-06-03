import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'
import { sendOtpEmail } from '@/lib/email'

const schema = z.object({ email: z.string().email() })

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email } = schema.parse(body)

    const code = Math.floor(100000 + Math.random() * 900000).toString()
    const expires = new Date(Date.now() + 10 * 60 * 1000)

    await db.otpToken.create({ data: { email, code, expires } })
    const result = await sendOtpEmail(email, code)

    // When SMTP isn't configured yet, surface the code to the UI so signup still
    // works locally. Never leaked in production.
    const devCode = result?.fallback && process.env.NODE_ENV !== 'production' ? code : undefined

    return NextResponse.json({ success: true, devCode })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 })
  }
}
