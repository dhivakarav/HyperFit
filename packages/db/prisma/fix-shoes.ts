import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // 1. Remove Urban Edge Pro
  const deleted = await prisma.product.deleteMany({ where: { slug: 'hyperfit-urban-edge-pro' } })
  console.log(`Removed Urban Edge Pro (${deleted.count})`)

  // 2. Bump the remaining Unsplash (stock-photo) images to high resolution + quality.
  const variants = await prisma.productVariant.findMany()
  for (const v of variants) {
    const hi = v.images.map((url) =>
      url.includes('images.unsplash.com')
        ? url.replace(/\?.*$/, '') + '?w=1920&q=95&auto=format&fit=max'
        : url
    )
    if (JSON.stringify(hi) !== JSON.stringify(v.images)) {
      await prisma.productVariant.update({ where: { id: v.id }, data: { images: hi } })
    }
  }
  console.log('Upgraded stock images to high-res')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
