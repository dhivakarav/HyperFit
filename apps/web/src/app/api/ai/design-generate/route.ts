import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const FALLBACK_SHOE_CONFIG = {
  zones: {
    sole: { color: '#0a0a0a', material: 'Synthetic' },
    lace: { color: '#e8ff47', material: 'Knit' },
    upper: { color: '#1a1a2e', material: 'Mesh' },
    midsole: { color: '#f8f8f8', material: 'Synthetic' },
    outsole: { color: '#0a0a0a', material: 'Synthetic' },
    heel: { color: '#e8ff47', material: 'Leather' },
    toeCap: { color: '#1a1a2e', material: 'Synthetic' },
    stitching: { color: '#e8ff47', material: 'Knit' },
    logo: { color: '#e8ff47', material: 'Leather' },
    sideDesign: { color: '#533483', material: 'Mesh' },
  },
}

export async function POST(req: NextRequest) {
  try {
    const { productType, style } = await req.json()

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ config: FALLBACK_SHOE_CONFIG })
    }

    const prompt = `Generate a ${style} design config for a ${productType} customizer. Return ONLY JSON with this structure for shoes: {"zones":{"sole":{"color":"#hex","material":"Leather|Mesh|Suede|Knit|Synthetic"},"lace":{"color":"#hex","material":"..."},"upper":{"color":"#hex","material":"..."},"midsole":{"color":"#hex","material":"..."},"outsole":{"color":"#hex","material":"..."},"heel":{"color":"#hex","material":"..."},"toeCap":{"color":"#hex","material":"..."},"stitching":{"color":"#hex","material":"..."},"logo":{"color":"#hex","material":"..."},"sideDesign":{"color":"#hex","material":"..."}}}`

    const response = await client.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [{ role: 'user', content: prompt }],
      max_tokens: 300,
    })

    const content = response.choices[0]?.message?.content ?? ''
    const match = content.match(/\{.*\}/s)
    if (match) {
      const config = JSON.parse(match[0])
      return NextResponse.json({ config })
    }

    return NextResponse.json({ config: FALLBACK_SHOE_CONFIG })
  } catch {
    return NextResponse.json({ config: FALLBACK_SHOE_CONFIG })
  }
}
