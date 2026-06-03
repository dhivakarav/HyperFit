import { PrismaClient, ProductType } from '@prisma/client'

const prisma = new PrismaClient()

const TEES = [
  { slug: 'wtee-baby-red', name: 'Baby Tee — Red', price: 1399, salePrice: null, color: 'Wine Red', colorHex: '#9e2a2b', image: '/products/wtee-red.jpg', featured: true },
  { slug: 'wtee-crop-olive', name: 'Cropped Tee — Olive', price: 1499, salePrice: 1199, color: 'Olive Green', colorHex: '#6f8f3e', image: '/products/wtee-green.jpg', featured: false },
  { slug: 'wtee-boxy-black-mock', name: 'Boxy Crop — Black', price: 1799, salePrice: null, color: 'Black', colorHex: '#0a0a0a', image: '/products/wtee-black-mock.jpg', featured: true },
  { slug: 'wtee-crop-pink', name: 'Cropped Tee — Pink', price: 1399, salePrice: 1099, color: 'Blush Pink', colorHex: '#e7a6c4', image: '/products/wtee-pink.jpg', featured: false },
  { slug: 'wtee-ringer-green', name: 'Ringer Baby Tee — Green', price: 1599, salePrice: null, color: 'Forest Green', colorHex: '#1f4d3a', image: '/products/wtee-green-ringer.jpg', featured: true },
  { slug: 'wtee-boxy-black', name: 'Oversized Crop — Black', price: 1899, salePrice: 1599, color: 'Black', colorHex: '#0a0a0a', image: '/products/wtee-black-boxy.jpg', featured: false },
  { slug: 'wtee-ribbed-maroon', name: 'Ribbed Baby Tee — Maroon', price: 1499, salePrice: null, color: 'Maroon', colorHex: '#5e2b2f', image: '/products/wtee-maroon-ribbed.jpg', featured: true },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: 'clothing' } })
  if (!cat) throw new Error('Clothing category not found.')

  for (const t of TEES) {
    await prisma.product.upsert({
      where: { slug: t.slug },
      update: { name: t.name, isFeatured: t.featured },
      create: {
        slug: t.slug,
        name: t.name,
        description: 'Soft stretch-cotton baby tee with a fitted cropped silhouette. A versatile women’s essential — wear it high-waisted or layered.',
        type: ProductType.TSHIRT,
        categoryId: cat.id,
        tags: ['tshirt', 'crop', 'women', 'kids'],
        isFeatured: t.featured,
        variants: {
          create: SIZES.map((size) => ({
            size,
            color: t.color,
            colorHex: t.colorHex,
            price: t.price,
            salePrice: t.salePrice ?? undefined,
            stock: 18 + Math.floor(Math.random() * 25),
            sku: `${t.slug.toUpperCase().replace(/-/g, '')}-${size}`,
            images: [t.image],
          })),
        },
      },
    })
    console.log(`✓ ${t.name} — ₹${t.price}`)
  }
  console.log('✅ Added 7 women\'s tees')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
