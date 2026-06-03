import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const FALLBACK_PALETTES: Record<string, string[]> = {
  dark: ['#1a1a2e', '#16213e', '#0f3460', '#533483', '#e94560'],
  lime: ['#e8ff47', '#b3cc00', '#78aa00', '#3d8700', '#006600'],
  default: ['#e8ff47', '#ff3c3c', '#00b4d8', '#8b5cf6', '#f97316'],
}

export async function POST(req: NextRequest) {
  try {
    const { baseColor } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ colors: FALLBACK_PALETTES.default })
    }

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'user',
          content: `Given base color ${baseColor}, suggest 5 harmonious colors for a premium athletic shoe design. Return ONLY a JSON array of hex strings, no explanation. Example: ["#hex1","#hex2","#hex3","#hex4","#hex5"]`,
        },
      ],
      max_tokens: 100,
    })

    const content = response.choices[0]?.message?.content ?? ''
    const match = content.match(/\[.*\]/s)
    if (match) {
      const colors = JSON.parse(match[0]) as string[]
      return NextResponse.json({ colors })
    }

    return NextResponse.json({ colors: FALLBACK_PALETTES.default })
  } catch {
    return NextResponse.json({ colors: FALLBACK_PALETTES.default })
  }
}
