import { PrismaClient, ProductType } from '@prisma/client'

const prisma = new PrismaClient()

const PANTS = [
  { slug: 'pleated-trouser-beige', name: 'Pleated Trouser — Beige', price: 3499, salePrice: 2999, color: 'Beige', colorHex: '#cdbb9a', image: '/products/pant-pleated-beige.jpg', featured: true,
    desc: 'Tailored double-pleat trouser in a soft beige twill. Relaxed straight leg with a clean crease — smart-casual done right.' },
  { slug: 'cargo-jogger-khaki', name: 'Cargo Jogger — Khaki', price: 3999, salePrice: null, color: 'Khaki', colorHex: '#b5a06f', image: '/products/pant-cargo-khaki.jpg', featured: true,
    desc: 'Utility cargo jogger with six pockets and ribbed ankle cuffs. Durable cotton blend built for everyday movement.' },
  { slug: 'slim-chino-tan', name: 'Slim Chino — Tan', price: 2999, salePrice: 2499, color: 'Tan', colorHex: '#a9885f', image: '/products/pant-chino-tan.jpg', featured: false,
    desc: 'Modern slim-fit chino in stretch cotton. Tapered through the leg for a sharp, versatile silhouette.' },
  { slug: 'wide-cargo-sage', name: 'Wide Cargo — Sage', price: 4499, salePrice: null, color: 'Sage Green', colorHex: '#9aa783', image: '/products/pant-cargo-sage.jpg', featured: true,
    desc: 'Relaxed wide-leg cargo in washed sage. Oversized flap pockets and a drawstring waist for an easy streetwear fit.' },
  { slug: 'wide-leg-trouser-black', name: 'Wide-Leg Trouser — Black', price: 3799, salePrice: 3199, color: 'Black', colorHex: '#0a0a0a', image: '/products/pant-wide-black.jpg', featured: false,
    desc: 'Fluid wide-leg trouser with an elastic drawstring waist. Drapes clean for an elevated, modern look.' },
  { slug: 'graphic-sweatpant-black', name: 'Graphic Sweatpant — Black', price: 3299, salePrice: null, color: 'Black', colorHex: '#0a0a0a', image: '/products/pant-graphic-black.jpg', featured: false,
    desc: 'Heavyweight wide sweatpant with a script side print. Soft fleece interior, baggy skate-inspired fit.' },
]

const SIZES = ['S', 'M', 'L', 'XL', 'XXL']

async function main() {
  // Remove Tech Cargo Pants
  const del = await prisma.product.deleteMany({ where: { slug: 'hyperfit-tech-cargo-pants' } })
  console.log(`Removed Tech Cargo Pants (${del.count})`)

  const cat = await prisma.category.findUnique({ where: { slug: 'clothing' } })
  if (!cat) throw new Error('Clothing category not found — run the seed first.')

  for (const p of PANTS) {
    const genders = new Set(['men', 'women'])
    if (p.slug === 'graphic-sweatpant-black' || p.slug === 'cargo-jogger-khaki') genders.add('kids')

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { name: p.name, isFeatured: p.featured },
      create: {
        slug: p.slug,
        name: p.name,
        description: p.desc,
        type: ProductType.PANTS,
        categoryId: cat.id,
        tags: ['pants', 'bottoms', ...genders],
        isFeatured: p.featured,
        variants: {
          create: SIZES.map((size) => ({
            size,
            color: p.color,
            colorHex: p.colorHex,
            price: p.price,
            salePrice: p.salePrice ?? undefined,
            stock: 15 + Math.floor(Math.random() * 25),
            sku: `${p.slug.toUpperCase().replace(/-/g, '')}-${size}`,
            images: [p.image],
          })),
        },
      },
    })
    console.log(`✓ ${p.name} — ₹${p.price}`)
  }
  console.log('✅ Added 6 pants')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
