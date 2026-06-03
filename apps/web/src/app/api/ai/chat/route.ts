import { NextRequest } from 'next/server'
import OpenAI from 'openai'

const SYSTEM_PROMPT = `You are HyperFit's AI fashion stylist. You help customers with:
- Product recommendations based on their style and needs
- Sizing and fit guidance
- Customizer help (shoe/tshirt/pants designer)
- Style combinations and outfit building
- Order and shipping questions

HyperFit is a premium AI-powered fashion brand. Keep responses concise, helpful, and on-brand. Use a confident, stylish tone. Format currency as ₹ (Indian Rupees).`

// A real key starts with "sk-" and isn't the .env.example placeholder.
function hasRealKey(): boolean {
  const k = process.env.OPENAI_API_KEY
  return !!k && k.startsWith('sk-') && !k.includes('...') && k.length > 20
}

// Local rule-based stylist used when no OpenAI key is configured.
function localReply(messages: Array<{ role: string; content: string }>): string {
  const last = messages.filter((m) => m.role === 'user').pop()?.content?.toLowerCase() ?? ''
  const has = (...words: string[]) => words.some((w) => last.includes(w))

  if (has('hi', 'hello', 'hey', 'yo ')) {
    return "Hey! Welcome to HyperFit. 👟 I can help you find products, pick a size, or design something custom in our 3D studio. What are you after today?"
  }
  if (has('shoe', 'sneaker', 'footwear')) {
    return 'Our hero sneaker is the Velocity X1 (₹7,499, on sale) — adaptive foam, breathable upper. Or go fully custom in the Shoe Builder: recolor 8 zones (laces, sole, stripes, logo and more) on a real 3D model. Want me to point you to /customize/shoes?'
  }
  if (has('shirt', 'tee', 't-shirt', 'tshirt')) {
    return 'The Performance Tee (₹2,999) is moisture-wicking with a 4-way stretch. For something unique, the T-Shirt Studio lets you pick fit, fabric, color, add front/back text in 3 fonts, and a size S–XXL. Try /customize/tshirts.'
  }
  if (has('pant', 'trouser', 'jean', 'cargo')) {
    return 'Check the Tech Cargo Pants (₹4,999) or design your own in the Pants Designer — Slim / Regular / Wide-Leg fits, fabrics, art patterns and color. Head to /customize/pants.'
  }
  if (has('size', 'fit', 'measurement', 'large', 'small', 'medium')) {
    return 'We run true-to-size. Tops come in S–XXL; shoes in EU 40–42. If you’re between sizes, size up for an oversized look or down for a slim fit. Want a size guide for a specific item?'
  }
  if (has('custom', 'design', 'customize', 'studio', 'build')) {
    return 'Love it. 🎨 You can design shoes, t-shirts, and pants in our 3D studios — real-time color, materials, patterns and prints on true 3D models. Start at /customize/shoes and switch products from the Custom menu.'
  }
  if (has('price', 'cost', 'how much', 'cheap', 'budget')) {
    return 'Pricing: tees from ₹1,999, pants from ₹3,999, sneakers from ₹6,999. Custom pieces start at the base price plus a small surcharge per upgrade. Free shipping over ₹999!'
  }
  if (has('ship', 'delivery', 'deliver', 'track')) {
    return 'Standard delivery is 5–7 days (free over ₹999), Express is 2–3 days, and same-day is available in select cities. You can track orders under Account → Orders.'
  }
  if (has('return', 'refund', 'exchange')) {
    return 'Easy 30-day returns on unworn items with tags. Custom-made pieces are final sale since they’re made just for you. Need help starting a return?'
  }
  if (has('coupon', 'discount', 'offer', 'promo', 'code')) {
    return 'Use HYPER10 for 10% off (min ₹999), HYPER500 for ₹500 off (min ₹2,999), or WELCOME15 for 15% off your first order. 🎉'
  }
  return "I can help with products, sizing, custom designs, shipping, returns and offers. Try asking about our shoes, tees, or pants — or say 'customize' to start designing. 👟"
}

function streamText(text: string): Response {
  const encoder = new TextEncoder()
  const words = text.split(' ')
  const stream = new ReadableStream({
    async start(controller) {
      for (const word of words) {
        const chunk = { choices: [{ delta: { content: word + ' ' } }] }
        controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
        await new Promise((r) => setTimeout(r, 22))
      }
      controller.enqueue(encoder.encode('data: [DONE]\n\n'))
      controller.close()
    },
  })
  return new Response(stream, {
    headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
  })
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json()

    if (!hasRealKey()) {
      return streamText(localReply(messages))
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'system', content: SYSTEM_PROMPT }, ...messages.slice(-10)],
      stream: true,
      max_tokens: 300,
    })

    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of response) {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(chunk)}\n\n`))
        }
        controller.enqueue(encoder.encode('data: [DONE]\n\n'))
        controller.close()
      },
    })
    return new Response(stream, {
      headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', Connection: 'keep-alive' },
    })
  } catch {
    return streamText("I'm having a brief hiccup — but I'm here! Ask me about our shoes, tees, pants, sizing, or custom designs. 👟")
  }
}
