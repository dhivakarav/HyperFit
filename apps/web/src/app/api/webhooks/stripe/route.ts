import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const sig = req.headers.get('stripe-signature')

  if (!sig) return NextResponse.json({ error: 'No signature' }, { status: 400 })

  try {
    const event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)

    switch (event.type) {
      case 'payment_intent.succeeded': {
        const pi = event.data.object
        await db.order.updateMany({
          where: { paymentId: pi.id },
          data: { status: 'PROCESSING' },
        })
        break
      }
      case 'payment_intent.payment_failed': {
        const pi = event.data.object
        await db.order.updateMany({
          where: { paymentId: pi.id },
          data: { status: 'CANCELLED' },
        })
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch {
    return NextResponse.json({ error: 'Webhook error' }, { status: 400 })
  }
}

export const config = { api: { bodyParser: false } }
