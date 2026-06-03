import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { stripe } from '@/lib/stripe'
import { authOptions } from '@/lib/auth'

const schema = z.object({
  amount: z.number().int().positive(),
  currency: z.string().default('inr'),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const { amount, currency } = schema.parse(await req.json())

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100,
      currency,
      automatic_payment_methods: { enabled: true },
      metadata: { userId: (session.user as { id: string }).id },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch {
    return NextResponse.json({ error: 'Failed to create payment intent' }, { status: 500 })
  }
}
