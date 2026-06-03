import { PrismaClient } from '@prisma/client'

const LOCAL = 'postgresql://hyperfit:hyperfit_dev@localhost:5433/hyperfit'
const REMOTE = process.env.REMOTE_URL
if (!REMOTE) throw new Error('Set REMOTE_URL to the Supabase connection string')

const local = new PrismaClient({ datasources: { db: { url: LOCAL } } })
const remote = new PrismaClient({ datasources: { db: { url: REMOTE } } })

async function main() {
  // Copy in FK-dependency order. createMany(skipDuplicates) is idempotent.
  const categories = await local.category.findMany()
  await remote.category.createMany({ data: categories, skipDuplicates: true })
  console.log(`✓ categories: ${categories.length}`)

  const products = await local.product.findMany()
  await remote.product.createMany({ data: products, skipDuplicates: true })
  console.log(`✓ products: ${products.length}`)

  const variants = await local.productVariant.findMany()
  await remote.productVariant.createMany({ data: variants, skipDuplicates: true })
  console.log(`✓ variants: ${variants.length}`)

  // Reviews reference products + users; copy users first if present, else skip reviews.
  const users = await local.user.findMany()
  if (users.length) {
    await remote.user.createMany({ data: users, skipDuplicates: true })
    console.log(`✓ users: ${users.length}`)
    const reviews = await local.review.findMany()
    await remote.review.createMany({ data: reviews, skipDuplicates: true })
    console.log(`✓ reviews: ${reviews.length}`)
  }

  const coupons = await local.coupon.findMany().catch(() => [])
  if (coupons.length) {
    await remote.coupon.createMany({ data: coupons, skipDuplicates: true })
    console.log(`✓ coupons: ${coupons.length}`)
  }

  console.log('✅ Catalog copied to Supabase')
}

main()
  .catch((e) => { console.error('❌', e.message); process.exit(1) })
  .finally(async () => { await local.$disconnect(); await remote.$disconnect() })
