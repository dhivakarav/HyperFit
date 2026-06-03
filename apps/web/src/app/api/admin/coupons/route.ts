import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

function isAdmin(session: ReturnType<typeof getServerSession> extends Promise<infer T> ? T : never) {
  return session && (session.user as { role?: string }).role === 'ADMIN'
}

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return NextResponse.json(coupons)
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!isAdmin(session)) return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })

  const schema = z.object({
    code: z.string().min(3).toUpperCase(),
    type: z.enum(['percentage', 'fixed']),
    value: z.number().positive(),
    minOrder: z.number().default(0),
    maxUses: z.number().int().optional(),
    expiresAt: z.string().optional(),
  })

  const data = schema.parse(await req.json())
  const coupon = await db.coupon.create({
    data: {
      ...data,
      expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
    },
  })

  return NextResponse.json(coupon, { status: 201 })
}
