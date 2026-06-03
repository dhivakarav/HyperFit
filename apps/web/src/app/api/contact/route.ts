import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { sendMail } from '@/lib/email'

const schema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  subject: z.string(),
  message: z.string().min(10),
})

export async function POST(req: NextRequest) {
  try {
    const body = schema.parse(await req.json())

    await sendMail({
      to: process.env.SMTP_USER || 'support@hyperfit.com',
      subject: `[Contact] ${body.subject} — from ${body.name}`,
      html: `<p><strong>From:</strong> ${body.name} (${body.email})</p><p><strong>Subject:</strong> ${body.subject}</p><p>${body.message.replace(/\n/g, '<br>')}</p>`,
    })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ success: true })
  }
}
