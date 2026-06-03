import { PrismaClient, ProductType } from '@prisma/client'

const prisma = new PrismaClient()

const BOTTOMS = [
  { slug: 'wpant-pleated-wide-cream', name: 'Pleated Wide Trouser — Cream', price: 3299, salePrice: 2799, color: 'Cream', colorHex: '#efe6d6', image: '/products/wpant-cream-wide.jpg', featured: true },
  { slug: 'wpant-bow-sweatpant-grey', name: 'Bow Sweatpant — Grey', price: 2999, salePrice: null, color: 'Heather Grey', colorHex: '#b6bac0', image: '/products/wpant-grey-bow.jpg', featured: true },
  { slug: 'wpant-baggy-jean-black', name: 'Baggy Jean — Washed Black', price: 3799, salePrice: 3199, color: 'Washed Black', colorHex: '#3a3a3e', image: '/products/wpant-black-baggy.jpg', featured: true },
  { slug: 'wpant-cross-jean', name: 'Printed Baggy Jean — Cross', price: 4199, salePrice: null, color: 'Vintage Blue', colorHex: '#52617a', image: '/products/wpant-cross-jeans.jpg', featured: true },
  { slug: 'wpant-corduroy-beige', name: 'Corduroy Wide Pant — Beige', price: 3499, salePrice: 2999, color: 'Beige', colorHex: '#d8c8a8', image: '/products/wpant-beige-cord.jpg', featured: false },
  { slug: 'wpant-wide-jean-blue', name: 'Wide-Leg Jean — Light Blue', price: 3599, salePrice: null, color: 'Light Blue', colorHex: '#8fb0d6', image: '/products/wpant-blue-wide.jpg', featured: true },
  { slug: 'wpant-pleated-khaki', name: 'Pleated Wide Trouser — Khaki', price: 3299, salePrice: null, color: 'Khaki', colorHex: '#b59b6e', image: '/products/wpant-khaki-pleated.jpg', featured: false },
  { slug: 'wpant-ripped-jean-blue', name: 'Ripped Wide Jean — Light Wash', price: 3899, salePrice: 3299, color: 'Light Wash', colorHex: '#a9c2dd', image: '/products/wpant-ripped-jeans.jpg', featured: false },
]

const SIZES = ['XS', 'S', 'M', 'L', 'XL']

async function main() {
  const cat = await prisma.category.findUnique({ where: { slug: 'clothing' } })
  if (!cat) throw new Error('Clothing category not found.')

  for (const b of BOTTOMS) {
    await prisma.product.upsert({
      where: { slug: b.slug },
      update: { name: b.name, isFeatured: b.featured },
      create: {
        slug: b.slug,
        name: b.name,
        description: 'A statement women’s bottom cut for a relaxed, elevated silhouette. Premium fabric, high-rise fit, made to move.',
        type: ProductType.PANTS,
        categoryId: cat.id,
        tags: ['pants', 'bottoms', 'women'],
        isFeatured: b.featured,
        variants: {
          create: SIZES.map((size) => ({
            size,
            color: b.color,
            colorHex: b.colorHex,
            price: b.price,
            salePrice: b.salePrice ?? undefined,
            stock: 15 + Math.floor(Math.random() * 25),
            sku: `${b.slug.toUpperCase().replace(/-/g, '')}-${size}`,
            images: [b.image],
          })),
        },
      },
    })
    console.log(`✓ ${b.name} — ₹${b.price}`)
  }
  console.log('✅ Added 8 women\'s bottoms')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
