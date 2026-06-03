import { PrismaClient, ProductType } from '@prisma/client'

const prisma = new PrismaClient()

const SHOES = [
  { slug: 'phantom-slip-on', name: 'Phantom Slip-On', price: 8999, salePrice: 7499, color: 'Emerald Green', colorHex: '#2e9e5b', image: '/products/shoe-green-slipon.jpg', tags: ['slip-on', 'leather', 'minimal'], featured: true,
    description: 'Laceless leather slip-on with a triple-stitch detail. Clean, minimal, and effortless — engineered comfort with a luxury finish.' },
  { slug: 'heritage-horsebit-loafer', name: 'Heritage Horsebit Loafer', price: 12999, salePrice: null, color: 'Phantom Black', colorHex: '#0a0a0a', image: '/products/shoe-black-loafer.jpg', tags: ['loafer', 'leather', 'formal'], featured: true,
    description: 'Hand-finished black leather loafer with a polished horsebit buckle. Timeless craftsmanship for the modern wardrobe.' },
  { slug: 'retro-runner-66', name: 'Retro Runner 66', price: 5499, salePrice: 4799, color: 'Chalk / Navy', colorHex: '#f0eee6', image: '/products/shoe-white-runner.jpg', tags: ['retro', 'running', 'lifestyle'], featured: false,
    description: 'Vintage-inspired low runner with a contrast side stripe. Lightweight build, all-day cushioning, throwback style.' },
  { slug: 'velocity-suede-red', name: 'Velocity Suede', price: 6499, salePrice: null, color: 'Racing Red', colorHex: '#d83a34', image: '/products/shoe-red-gazelle.jpg', tags: ['suede', 'retro', 'street'], featured: true,
    description: 'Premium suede sneaker with white side stripes and a gum outsole. Bold color, classic terrace silhouette.' },
  { slug: 'court-classic-black', name: 'Court Classic', price: 4999, salePrice: 3999, color: 'Black / Gum', colorHex: '#111111', image: '/products/shoe-black-court.jpg', tags: ['court', 'leather', 'lifestyle'], featured: false,
    description: 'Minimal court sneaker in black leather with chevron stripes and a warm gum sole. Versatile everyday essential.' },
  { slug: 'campus-tan', name: 'Campus Tan', price: 4499, salePrice: null, color: 'Mocha Brown', colorHex: '#6b4f3a', image: '/products/shoe-brown-campus.jpg', tags: ['campus', 'suede', 'retro'], featured: false,
    description: 'Earth-tone campus trainer with tonal stripes and a cream midsole. Soft, retro, and endlessly wearable.' },
  { slug: 'sk8-hi-mustard', name: 'Sk8 Hi Mustard', price: 6999, salePrice: 5999, color: 'Mustard Yellow', colorHex: '#e0a92e', image: '/products/shoe-yellow-hitop.jpg', tags: ['high-top', 'canvas', 'skate'], featured: true,
    description: 'High-top canvas skate shoe in mustard with the signature side stripe. Padded collar, vulcanized grip sole.' },
]

const SIZES = ['40', '41', '42', '43']

async function main() {
  const shoesCat = await prisma.category.findUnique({ where: { slug: 'shoes' } })
  if (!shoesCat) throw new Error('Shoes category not found — run the seed first.')

  for (const s of SHOES) {
    await prisma.product.upsert({
      where: { slug: s.slug },
      update: {
        name: s.name,
        description: s.description,
        isFeatured: s.featured,
        tags: s.tags,
      },
      create: {
        slug: s.slug,
        name: s.name,
        description: s.description,
        type: ProductType.SHOES,
        categoryId: shoesCat.id,
        tags: s.tags,
        isFeatured: s.featured,
        variants: {
          create: SIZES.map((size) => ({
            size,
            color: s.color,
            colorHex: s.colorHex,
            price: s.price,
            salePrice: s.salePrice ?? undefined,
            stock: 15 + Math.floor(Math.random() * 20),
            sku: `${s.slug.toUpperCase().replace(/-/g, '')}-${size}`,
            images: [s.image],
          })),
        },
      },
    })
    console.log(`✓ ${s.name} — ₹${s.price.toLocaleString()}`)
  }
  console.log('✅ Added 7 shoes')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
