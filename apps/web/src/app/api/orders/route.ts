import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'
import { sendOrderConfirmation } from '@/lib/email'

const orderSchema = z.object({
  items: z.array(z.object({
    productId: z.string(),
    variantId: z.string().optional(),
    name: z.string(),
    price: z.number(),
    quantity: z.number().int().positive(),
    size: z.string().optional(),
    color: z.string().optional(),
    image: z.string().optional(),
  })),
  contact: z.object({ name: z.string(), email: z.string().email(), phone: z.string() }),
  address: z.object({
    line1: z.string(), line2: z.string().optional(), city: z.string(),
    state: z.string(), pincode: z.string(), country: z.string(),
  }),
  shippingMethod: z.string(),
  couponCode: z.string().optional(),
  subtotal: z.number(),
  discount: z.number().default(0),
  shipping: z.number(),
  total: z.number(),
  paymentMethod: z.string().optional(),
})

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const { searchParams } = req.nextUrl
  const page = parseInt(searchParams.get('page') ?? '1')
  const limit = 20

  const [items, total] = await Promise.all([
    db.order.findMany({
      where: { userId },
      include: { items: true },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.order.count({ where: { userId } }),
  ])

  return NextResponse.json({ items, total, page, limit })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const userId = (session.user as { id: string }).id
    const body = orderSchema.parse(await req.json())

    const order = await db.order.create({
      data: {
        userId,
        subtotal: body.subtotal,
        discount: body.discount,
        shipping: body.shipping,
        total: body.total,
        address: body.address as Record<string, unknown>,
        couponCode: body.couponCode,
        paymentMethod: body.paymentMethod,
        items: {
          create: body.items.map((item) => ({
            productId: item.productId,
            variantId: item.variantId,
            name: item.name,
            price: item.price,
            quantity: item.quantity,
            size: item.size,
            color: item.color,
            image: item.image,
          })),
        },
      },
      include: { items: true },
    })

    if (body.couponCode) {
      await db.coupon.updateMany({
        where: { code: body.couponCode },
        data: { usedCount: { increment: 1 } },
      })
    }

    const user = await db.user.findUnique({ where: { id: userId }, select: { email: true } })
    if (user) {
      await sendOrderConfirmation(user.email, {
        orderNumber: order.orderNumber,
        total: order.total,
        items: order.items.map((i) => ({ name: i.name, quantity: i.quantity, price: i.price })),
      }).catch(() => {})
    }

    return NextResponse.json({ id: order.id, orderNumber: order.orderNumber }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid order data', details: err.errors }, { status: 400 })
    return NextResponse.json({ error: 'Failed to create order' }, { status: 500 })
  }
}
