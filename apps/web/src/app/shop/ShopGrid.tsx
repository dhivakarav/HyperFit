'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ProductCard } from '@hyperfit/ui'
import type { Product } from '@/types'

interface ShopGridProps {
  products: Product[]
  total: number
  page: number
  limit: number
  categories: Array<{ id: string; name: string; slug: string }>
}

export default function ShopGrid({ products, total, page, limit, categories }: ShopGridProps) {
  const totalPages = Math.ceil(total / limit)

  if (products.length === 0) {
    return (
      <div className="text-center py-24">
        <p className="text-[#6b6b6b] text-lg mb-4">No products found</p>
        <Link href="/shop" className="text-[#c8102e] underline">Clear filters</Link>
      </div>
    )
  }

  return (
    <div>
      {/* Category filters */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Link href="/shop" className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[#d8d8d8] text-[#6b6b6b] hover:border-[#c8102e] hover:text-[#c8102e] transition-colors">
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/shop?category=${cat.slug}`}
            className="px-4 py-2 text-xs font-bold uppercase tracking-wider border border-[#d8d8d8] text-[#6b6b6b] hover:border-[#c8102e] hover:text-[#c8102e] transition-colors"
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product, i) => {
          const variant = product.variants[0]
          return (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.05 }}
            >
              <ProductCard
                id={product.id}
                name={product.name}
                price={variant?.price ?? 0}
                salePrice={variant?.salePrice ?? undefined}
                images={variant?.images ?? []}
                slug={product.slug}
                badge={variant?.stock === 0 ? 'soldout' : variant?.salePrice ? 'sale' : product.isFeatured ? 'new' : undefined}
              />
            </motion.div>
          )
        })}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-12">
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <Link
              key={p}
              href={`/shop?page=${p}`}
              className={`w-10 h-10 flex items-center justify-center text-sm font-medium border transition-colors ${
                p === page ? 'bg-[#c8102e] border-[#c8102e] text-[#ffffff]' : 'border-[#d8d8d8] text-[#6b6b6b] hover:border-[#c8102e] hover:text-[#c8102e]'
              }`}
            >
              {p}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
