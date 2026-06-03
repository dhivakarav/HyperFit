import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { z } from 'zod'
import { db } from '@/lib/db'
import { authOptions } from '@/lib/auth'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl
    const search = searchParams.get('search') ?? undefined
    const category = searchParams.get('category') ?? undefined
    const sort = searchParams.get('sort') ?? 'newest'
    const page = parseInt(searchParams.get('page') ?? '1')
    const limit = parseInt(searchParams.get('limit') ?? '12')

    const where: Record<string, unknown> = { isPublished: true }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    if (category) where.category = { slug: category }

    const orderBy: Record<string, unknown> =
      sort === 'price-asc' ? { createdAt: 'asc' }
      : sort === 'price-desc' ? { createdAt: 'desc' }
      : { createdAt: 'desc' }

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { variants: true, category: true, _count: { select: { reviews: true } } },
        orderBy,
        take: limit,
        skip: (page - 1) * limit,
      }),
      db.product.count({ where }),
    ])

    return NextResponse.json({ items, total, page, limit, totalPages: Math.ceil(total / limit) })
  } catch {
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  try {
    const body = await req.json()
    const product = await db.product.create({
      data: {
        slug: body.name.toLowerCase().replace(/\s+/g, '-') + '-' + Date.now(),
        name: body.name,
        description: body.description,
        type: body.type,
        categoryId: body.categoryId,
        tags: body.tags ?? [],
        variants: { create: body.variants ?? [] },
      },
      include: { variants: true, category: true },
    })
    return NextResponse.json(product, { status: 201 })
  } catch {
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
