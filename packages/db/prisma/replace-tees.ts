import { PrismaClient, ProductType } from '@prisma/client'

const prisma = new PrismaClient()

const TEES = [
  { slug: 'mtee-heavyweight-cream', name: 'Heavyweight Tee — Cream', price: 1699, salePrice: null, color: 'Cream', colorHex: '#ece4d4', image: '/products/mtee-cream.jpg', featured: true },
  { slug: 'mtee-heavyweight-red', name: 'Heavyweight Tee — Red', price: 1699, salePrice: 1399, color: 'Racing Red', colorHex: '#e21f26', image: '/products/mtee-red.jpg', featured: true },
  { slug: 'mtee-waffle-grey', name: 'Waffle Tee — Grey', price: 1999, salePrice: null, color: 'Heather Grey', colorHex: '#b6bac0', image: '/products/mtee-grey.jpg', featured: false },
  { slug: 'mtee-oversized-green', name: 'Oversized Tee — Forest', price: 2199, salePrice: 1799, color: 'Forest Green', colorHex: '#1f4d3a', image: '/products/mtee-green.jpg', featured: true },
  { slug: 'mtee-heavyweight-navy', name: 'Heavyweight Tee — Navy', price: 1699, salePrice: null, color: 'Navy Blue', colorHex: '#1f3a63', image: '/products/mtee-navy.jpg', featured: false },
  { slug: 'mtee-heavyweight-royal', name: 'Heavyweight Tee — Royal', price: 1699, salePrice: 1399, color: 'Royal Blue', colorHex: '#1c52c2', image: '/products/mtee-royal.jpg', featured: true },
  { slug: 'mtee-slim-cocoa', name: 'Slim Tee — Cocoa', price: 1499, salePrice: null, color: 'Cocoa Brown', colorHex: '#5a4334', image: '/products/mtee-brown.jpg', featured: false },
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

async function main() {
  // Remove ALL existing t-shirts
  const del = await prisma.product.deleteMany({ where: { type: ProductType.TSHIRT } })
  console.log(`Removed ${del.count} existing t-shirts`)

  const cat = await prisma.category.findUnique({ where: { slug: 'clothing' } })
  if (!cat) throw new Error('Clothing category not found.')

  for (const t of TEES) {
    await prisma.product.create({
      data: {
        slug: t.slug,
        name: t.name,
        description: 'Premium heavyweight cotton tee with a structured crew neck and clean drop-shoulder fit. A wardrobe essential, built to last.',
        type: ProductType.TSHIRT,
        categoryId: cat.id,
        tags: ['tshirt', 'essential', 'cotton', 'men', 'women', 'kids'],
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
  console.log('✅ Replaced with 7 men\'s tees')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
