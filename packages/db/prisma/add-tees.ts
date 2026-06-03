import { PrismaClient, ProductType } from '@prisma/client'

const prisma = new PrismaClient()

const TEES = [
  { slug: 'essential-tee-cobalt', name: 'Essential Tee — Cobalt', price: 1799, salePrice: 1499, color: 'Cobalt Blue', colorHex: '#2c4bb0', image: '/products/tee-blue.jpg', featured: true },
  { slug: 'essential-tee-coral', name: 'Essential Tee — Coral', price: 1799, salePrice: null, color: 'Coral', colorHex: '#f0603c', image: '/products/tee-coral.jpg', featured: false },
  { slug: 'essential-tee-mustard', name: 'Essential Tee — Mustard', price: 1799, salePrice: 1499, color: 'Mustard Yellow', colorHex: '#e8d23a', image: '/products/tee-yellow.jpg', featured: true },
  { slug: 'essential-tee-cocoa', name: 'Essential Tee — Cocoa', price: 1799, salePrice: null, color: 'Cocoa Brown', colorHex: '#5a4636', image: '/products/tee-brown.jpg', featured: false },
  { slug: 'essential-tee-white', name: 'Essential Tee — White', price: 1799, salePrice: null, color: 'Optic White', colorHex: '#f5f5f5', image: '/products/tee-white.jpg', featured: true },
  { slug: 'essential-tee-lavender', name: 'Essential Tee — Lavender', price: 1799, salePrice: 1499, color: 'Lavender', colorHex: '#c9a8e0', image: '/products/tee-lavender.jpg', featured: false },
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: 'clothing' } })
  if (!cat) throw new Error('Clothing category not found — run the seed first.')

  for (const t of TEES) {
    await prisma.product.upsert({
      where: { slug: t.slug },
      update: { name: t.name, isFeatured: t.featured },
      create: {
        slug: t.slug,
        name: t.name,
        description: 'Premium combed-cotton essential tee. Soft, breathable, and built to last — a relaxed everyday staple with a clean crew neck.',
        type: ProductType.TSHIRT,
        categoryId: cat.id,
        tags: ['tshirt', 'essential', 'cotton', 'everyday'],
        isFeatured: t.featured,
        variants: {
          create: SIZES.map((size) => ({
            size,
            color: t.color,
            colorHex: t.colorHex,
            price: t.price,
            salePrice: t.salePrice ?? undefined,
            stock: 20 + Math.floor(Math.random() * 30),
            sku: `${t.slug.toUpperCase().replace(/-/g, '')}-${size}`,
            images: [t.image],
          })),
        },
      },
    })
    console.log(`✓ ${t.name} — ₹${t.price}`)
  }
  console.log('✅ Added 6 tees')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
