import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { db } from '@/lib/db'

const schema = z.object({ code: z.string(), subtotal: z.number() })

export async function POST(req: NextRequest) {
  try {
    const { code, subtotal } = schema.parse(await req.json())

    const coupon = await db.coupon.findUnique({ where: { code: code.toUpperCase() } })

    if (!coupon) return NextResponse.json({ valid: false, error: 'Invalid coupon code' })
    if (!coupon.isActive) return NextResponse.json({ valid: false, error: 'This coupon has expired' })
    if (coupon.expiresAt && coupon.expiresAt < new Date()) return NextResponse.json({ valid: false, error: 'This coupon has expired' })
    if (coupon.maxUses && coupon.usedCount >= coupon.maxUses) return NextResponse.json({ valid: false, error: 'Coupon usage limit reached' })
    if (subtotal < coupon.minOrder) return NextResponse.json({ valid: false, error: `Minimum order of ₹${coupon.minOrder} required` })

    const discount = coupon.type === 'percentage'
      ? Math.round((subtotal * coupon.value) / 100)
      : coupon.value

    return NextResponse.json({ valid: true, type: coupon.type, value: coupon.value, discount })
  } catch {
    return NextResponse.json({ valid: false, error: 'Failed to validate coupon' })
  }
}
