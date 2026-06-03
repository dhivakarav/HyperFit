import { Suspense } from 'react'
import { db } from '@/lib/db'
import type { Metadata } from 'next'
import ShopGrid from './ShopGrid'

export const metadata: Metadata = { title: 'Shop All Products' }

interface ShopPageProps {
  searchParams: Promise<{
    search?: string
    category?: string
    sort?: string
    minPrice?: string
    maxPrice?: string
    size?: string
    page?: string
  }>
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams
  const page = parseInt(params.page ?? '1')
  const limit = 12

  const where: Record<string, unknown> = { isPublished: true }

  if (params.search) {
    const q = params.search.trim()
    const ql = q.toLowerCase()
    // singular/plural tag variants so "shoe" matches the "shoes" tag, etc.
    const tagCandidates = Array.from(new Set([ql, `${ql}s`, ql.replace(/s$/, '')]))
    // map common keywords to a product type so category-style searches work
    const TYPE_MAP: Record<string, string> = {
      shoe: 'SHOES', shoes: 'SHOES', footwear: 'SHOES', sneaker: 'SHOES', sneakers: 'SHOES', trainer: 'SHOES', trainers: 'SHOES', boot: 'SHOES', boots: 'SHOES',
      tshirt: 'TSHIRT', tshirts: 'TSHIRT', tee: 'TSHIRT', tees: 'TSHIRT', shirt: 'TSHIRT', shirts: 'TSHIRT', top: 'TSHIRT', tops: 'TSHIRT', clothing: 'TSHIRT',
      pant: 'PANTS', pants: 'PANTS', bottom: 'PANTS', bottoms: 'PANTS', trouser: 'PANTS', trousers: 'PANTS', jean: 'PANTS', jeans: 'PANTS',
    }
    const typeMatch = TYPE_MAP[ql]
    where.OR = [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
      { category: { name: { contains: q, mode: 'insensitive' } } },
      { tags: { hasSome: tagCandidates } },
      ...(typeMatch ? [{ type: typeMatch }] : []),
    ]
  }

  if (params.category) {
    where.category = { slug: params.category }
  }

  const orderBy: Record<string, unknown> =
    params.sort === 'price-asc' ? { variants: { _min: { price: 'asc' } } }
    : params.sort === 'price-desc' ? { variants: { _min: { price: 'desc' } } }
    : { createdAt: 'desc' }

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: {
        variants: true,
        category: true,
        _count: { select: { reviews: true } },
      },
      orderBy,
      take: limit,
      skip: (page - 1) * limit,
    }),
    db.product.count({ where }),
    db.category.findMany(),
  ])

  return (
    <div className="min-h-screen pt-20 flex justify-center">
      <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-display text-6xl text-[#0a0a0a] mb-2">
            {params.category ? params.category.toUpperCase() : 'SHOP ALL'}
          </h1>
          <p className="text-[#6b6b6b] text-sm">{total} products</p>
        </div>

        <Suspense fallback={<div className="grid grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({length:6}).map((_,i)=><div key={i} className="aspect-square bg-[#f2f2f2] animate-pulse" />)}</div>}>
          <ShopGrid
            products={products}
            total={total}
            page={page}
            limit={limit}
            categories={categories}
          />
        </Suspense>
      </div>
    </div>
  )
}
