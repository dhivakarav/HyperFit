import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as { id: string }).id
  const designs = await db.customDesign.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })
  return NextResponse.json(designs)
}

const schema = z.object({
  productType: z.enum(['SHOES', 'TSHIRT', 'PANTS', 'ACCESSORIES']),
  name: z.string().min(1).default('My Design'),
  config: z.record(z.string(), z.unknown()),
  previewUrl: z.string().optional(),
  price: z.number().optional(),
})

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const userId = (session.user as { id: string }).id
    const body = schema.parse(await req.json())

    const design = await db.customDesign.create({
      data: {
        userId,
        productType: body.productType,
        name: body.name,
        config: body.config as object,
        previewUrl: body.previewUrl,
        price: body.price,
        status: 'draft',
      },
    })

    return NextResponse.json({ id: design.id }, { status: 201 })
  } catch (err) {
    if (err instanceof z.ZodError) return NextResponse.json({ error: 'Invalid design data' }, { status: 400 })
    return NextResponse.json({ error: 'Failed to save design' }, { status: 500 })
  }
}
