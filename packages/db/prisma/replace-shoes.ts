import { PrismaClient, ProductType } from '@prisma/client'

const prisma = new PrismaClient()

const SHOES = [
  { slug: 'sh-pink-suede-retro', name: 'Suede Retro Trainer — Pink', price: 6499, salePrice: 5499, color: 'Magenta Pink', colorHex: '#c0407a', image: '/products/sh-pink-suede.jpg', genders: ['women'], featured: true,
    desc: 'Colour-blocked suede retro trainer on a warm gum sole. Soft pink tones with a vintage terrace silhouette.' },
  { slug: 'sh-tan-suede-chukka', name: 'Suede Chukka Boot — Tan', price: 9999, salePrice: null, color: 'Tan', colorHex: '#b07a45', image: '/products/sh-tan-chukka.jpg', genders: ['men'], featured: true,
    desc: 'Premium tan suede chukka with apron-toe stitching and a durable rubber sole. Rugged, refined, year-round.' },
  { slug: 'sh-green-retro-runner', name: 'Retro Runner — Green', price: 5999, salePrice: 4999, color: 'Olive Green', colorHex: '#4c6b3a', image: '/products/sh-green-retro.jpg', genders: ['women'], featured: true,
    desc: 'Nylon-and-suede retro runner with contrast pink laces and a gum outsole. Throwback running style, modern comfort.' },
  { slug: 'sh-green-terrace', name: 'Terrace Suede — Green', price: 8499, salePrice: null, color: 'Sage Green', colorHex: '#5e7d63', image: '/products/sh-green-gazelle.jpg', genders: ['men', 'women'], featured: true,
    desc: 'Classic three-stripe terrace sneaker in soft sage suede with a gum sole. An icon, done in earthy tones.' },
  { slug: 'sh-black-chelsea-boot', name: 'Leather Chelsea Boot — Black', price: 11999, salePrice: 9999, color: 'Black', colorHex: '#0a0a0a', image: '/products/sh-black-chelsea.jpg', genders: ['men'], featured: true,
    desc: 'Polished black leather Chelsea boot with elastic side gores and a crepe-look sole. Sharp, versatile, timeless.' },
  { slug: 'sh-green-dice-lo', name: 'Dice Lo Sneaker — Green', price: 10499, salePrice: null, color: 'Green / Cream', colorHex: '#6f8f4f', image: '/products/sh-green-arigato.jpg', genders: ['men', 'women'], featured: true,
    desc: 'Premium leather low-top with suede overlays in green and cream. Clean court lines, luxe construction.' },
  { slug: 'sh-white-court', name: 'Court Sneaker — White', price: 5499, salePrice: 4499, color: 'Optic White', colorHex: '#f3f3f0', image: '/products/sh-white-court.jpg', genders: ['women'], featured: false,
    desc: 'Streamlined white nylon-and-suede court sneaker on a gum sole. Light, minimal, everyday-ready.' },
  { slug: 'sh-cream-campus', name: 'Campus Low — Pastel', price: 4499, salePrice: null, color: 'Cream / Pastel', colorHex: '#efe6cf', image: '/products/sh-cream-campus.jpg', genders: ['women'], featured: true,
    desc: 'Chunky-sole campus sneaker in cream with pink and lilac accents. Soft pastels, bold platform.' },
  { slug: 'sh-green-suede-stripe', name: 'Suede Stripe Trainer — Green', price: 5999, salePrice: 4999, color: 'Mint Green', colorHex: '#7fa886', image: '/products/sh-green-suede.jpg', genders: ['women'], featured: false,
    desc: 'Mint suede trainer with a side flash and gum sole. Retro court styling in a fresh seasonal shade.' },
  { slug: 'sh-white-leather-low', name: 'Leather Low Sneaker — White', price: 6999, salePrice: null, color: 'Optic White', colorHex: '#f5f5f2', image: '/products/sh-white-leather.jpg', genders: ['men', 'women'], featured: true,
    desc: 'Minimal white leather low-top with a cupsole. The clean, go-with-everything everyday sneaker.' },
]

const SIZES = ['40', '41', '42', '43', '44']

async function main() {
  const del = await prisma.product.deleteMany({ where: { type: ProductType.SHOES } })
  console.log(`Removed ${del.count} existing shoes`)

  const cat = await prisma.category.findUnique({ where: { slug: 'shoes' } })
  if (!cat) throw new Error('Shoes category not found.')

  for (const s of SHOES) {
    await prisma.product.create({
      data: {
        slug: s.slug,
        name: s.name,
        description: s.desc,
        type: ProductType.SHOES,
        categoryId: cat.id,
        tags: ['shoes', 'footwear', ...s.genders],
        isFeatured: s.featured,
        variants: {
          create: SIZES.map((size) => ({
            size,
            color: s.color,
            colorHex: s.colorHex,
            price: s.price,
            salePrice: s.salePrice ?? undefined,
            stock: 12 + Math.floor(Math.random() * 20),
            sku: `${s.slug.toUpperCase().replace(/-/g, '')}-${size}`,
            images: [s.image],
          })),
        },
      },
    })
    console.log(`✓ ${s.name} — ₹${s.price} [${s.genders.join('/')}]`)
  }
  console.log('✅ Replaced with 10 shoes')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
