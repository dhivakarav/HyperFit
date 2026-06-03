import { db } from '@/lib/db'
import type { Metadata } from 'next'
import ShopGrid from '../ShopGrid'

interface Props {
  params: Promise<{ category: string }>
  searchParams: Promise<{ type?: string }>
}

const title = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)
const TYPE_LABEL: Record<string, string> = { SHOES: 'Shoes', TSHIRT: 'T-Shirts', PANTS: 'Bottoms' }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { category } = await params
  const cat = await db.category.findUnique({ where: { slug: category } })
  return { title: `${cat ? cat.name : title(category)} — Shop` }
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { category } = await params
  const { type } = await searchParams

  // Base scope: real category -> by category; gender -> by tag; else -> all.
  const GENDERS = ['men', 'women', 'kids']
  const cat = await db.category.findUnique({ where: { slug: category } })
  const base: Record<string, unknown> = cat
    ? { isPublished: true, category: { slug: category } }
    : GENDERS.includes(category)
    ? { isPublished: true, tags: { has: category } }
    : { isPublished: true }

  // Optional product-type filter (Men > T-Shirts -> ?type=TSHIRT).
  const validType = type && ['SHOES', 'TSHIRT', 'PANTS'].includes(type) ? type : undefined
  const where = validType ? { ...base, type: validType as never } : base

  const [products, total, categories] = await Promise.all([
    db.product.findMany({
      where,
      include: { variants: true, category: true, _count: { select: { reviews: true } } },
      take: 24,
      orderBy: { createdAt: 'desc' },
    }),
    db.product.count({ where }),
    db.category.findMany(),
  ])

  const baseHeading = cat ? cat.name : title(category)
  const heading = validType ? `${baseHeading} · ${TYPE_LABEL[validType]}` : baseHeading
  const description = validType
    ? `${baseHeading}'s ${TYPE_LABEL[validType].toLowerCase()}.`
    : cat?.description ?? `Shop the full ${title(category)} collection.`

  return (
    <div className="min-h-screen pt-20">
      {/* Category hero */}
      <div className="relative h-48 sm:h-64 overflow-hidden bg-[#f2f2f2]">
        {cat?.image && <img src={cat.image} alt={cat.name} className="w-full h-full object-cover opacity-40" />}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <h1 className="font-display text-7xl text-[#0a0a0a]">{heading.toUpperCase()}</h1>
          <p className="text-[#6b6b6b] mt-2 text-center px-4">{description}</p>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8 py-12">
          <ShopGrid products={products} total={total} page={1} limit={24} categories={categories} />
        </div>
      </div>
    </div>
  )
}
