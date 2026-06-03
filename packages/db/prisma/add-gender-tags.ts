import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const products = await prisma.product.findMany({ select: { id: true, slug: true, type: true, tags: true } })

  for (const p of products) {
    const genders = new Set<string>()
    // Almost everything is offered in Men.
    genders.add('men')
    // Women — unisex apparel + most shoes (loafers stay men-only as an example).
    if (p.slug !== 'heritage-horsebit-loafer') genders.add('women')
    // Kids — tees, caps, and casual sneakers.
    if (p.type === 'TSHIRT' || p.type === 'ACCESSORIES' || p.slug === 'sk8-hi-mustard' || p.slug === 'retro-runner-66') {
      genders.add('kids')
    }

    const merged = Array.from(new Set([...p.tags, ...genders]))
    await prisma.product.update({ where: { id: p.id }, data: { tags: merged } })
    console.log(`${p.slug}: ${[...genders].join(', ')}`)
  }
  console.log('✅ Gender tags applied')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
