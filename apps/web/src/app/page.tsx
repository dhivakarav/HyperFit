import { Suspense } from 'react'
import { db } from '@/lib/db'
import HeroSection from '@/components/home/HeroSection'
import CustomStudioCTA from '@/components/home/CustomStudioCTA'
import StatsShowcase from '@/components/home/StatsShowcase'
import BestSellers from '@/components/home/BestSellers'
import Testimonials from '@/components/home/Testimonials'

async function getByGender(gender: string) {
  const products = await db.product.findMany({
    where: { isPublished: true, tags: { has: gender } },
    include: { variants: { take: 1 }, category: true },
    orderBy: [{ isFeatured: 'desc' }, { createdAt: 'desc' }],
  })

  // Interleave by type so the row is a mix of tees / shoes / pants (not all one kind).
  const buckets: Record<string, typeof products> = { TSHIRT: [], SHOES: [], PANTS: [] }
  for (const p of products) (buckets[p.type] ??= []).push(p)
  const order = ['TSHIRT', 'SHOES', 'PANTS']
  const mixed: typeof products = []
  let added = true
  while (mixed.length < 12 && added) {
    added = false
    for (const t of order) {
      const next = buckets[t]?.shift()
      if (next) { mixed.push(next); added = true; if (mixed.length >= 12) break }
    }
  }
  return mixed
}

export default async function HomePage() {
  const [men, women] = await Promise.all([getByGender('men'), getByGender('women')])

  return (
    <>
      <HeroSection />

      <StatsShowcase />

      {/* White spacer row before Men's Best Sellers */}
      <div className="h-10 sm:h-20 lg:h-28 bg-[#ffffff]" />

      <Suspense fallback={<div className="py-16 h-64" />}>
        <BestSellers title="Men's Best Sellers" eyebrow="For Him" href="/shop/men" products={men} />
      </Suspense>

      {/* White spacer row before Women's Best Sellers */}
      <div className="h-10 sm:h-20 lg:h-28 bg-[#ffffff]" />

      <Suspense fallback={<div className="py-16 h-64" />}>
        <BestSellers title="Women's Best Sellers" eyebrow="For Her" href="/shop/women" products={women} />
      </Suspense>

      {/* White spacer row before the studio */}
      <div className="h-10 sm:h-20 lg:h-28 bg-[#ffffff]" />

      <CustomStudioCTA />

      {/* White spacer row before reviews */}
      <div className="h-10 sm:h-20 lg:h-28 bg-[#ffffff]" />

      <Testimonials />

      {/* White spacer row before the footer */}
      <div className="h-10 sm:h-20 lg:h-28 bg-[#ffffff]" />
    </>
  )
}
