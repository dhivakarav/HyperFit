import { PrismaClient, ProductType, Role } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding HyperFit database...')

  const shoesCategory = await prisma.category.upsert({
    where: { slug: 'shoes' },
    update: {},
    create: { name: 'Shoes', slug: 'shoes', description: 'Performance footwear engineered for the streets and beyond.', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
  })
  const clothingCategory = await prisma.category.upsert({
    where: { slug: 'clothing' },
    update: {},
    create: { name: 'Clothing', slug: 'clothing', description: 'Premium performance apparel for every lifestyle.', image: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=800' },
  })
  const accessoriesCategory = await prisma.category.upsert({
    where: { slug: 'accessories' },
    update: {},
    create: { name: 'Accessories', slug: 'accessories', description: 'Complete your HyperFit look.', image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800' },
  })

  const passwordHash = await bcrypt.hash('password123', 12)

  const adminUser = await prisma.user.upsert({
    where: { email: 'admin@hyperfit.com' },
    update: {},
    create: { name: 'HyperFit Admin', email: 'admin@hyperfit.com', passwordHash, role: Role.ADMIN, avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100' },
  })
  const testUser = await prisma.user.upsert({
    where: { email: 'user@hyperfit.com' },
    update: {},
    create: { name: 'Alex Carter', email: 'user@hyperfit.com', passwordHash, role: Role.USER, avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?w=100' },
  })

  const velocity = await prisma.product.upsert({
    where: { slug: 'hyperfit-velocity-x1' },
    update: {},
    create: {
      slug: 'hyperfit-velocity-x1', name: 'Velocity X1',
      description: 'Next-generation performance runner with adaptive foam midsole and breathable upper. Engineered for speed, designed for the streets.',
      type: ProductType.SHOES, categoryId: shoesCategory.id, tags: ['running', 'performance', 'foam', 'featured'], isFeatured: true,
      variants: { create: [
        { size: '40', color: 'Phantom Black', colorHex: '#0a0a0a', price: 8999, salePrice: 7499, stock: 25, sku: 'VX1-40-BLK', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'] },
        { size: '41', color: 'Phantom Black', colorHex: '#0a0a0a', price: 8999, salePrice: 7499, stock: 18, sku: 'VX1-41-BLK', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'] },
        { size: '42', color: 'Phantom Black', colorHex: '#0a0a0a', price: 8999, salePrice: 7499, stock: 30, sku: 'VX1-42-BLK', images: ['https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800'] },
        { size: '42', color: 'Electric Lime', colorHex: '#e8ff47', price: 8999, stock: 12, sku: 'VX1-42-LIM', images: ['https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800'] },
      ]},
    },
  })

  await prisma.product.upsert({
    where: { slug: 'hyperfit-urban-edge-pro' },
    update: {},
    create: {
      slug: 'hyperfit-urban-edge-pro', name: 'Urban Edge Pro',
      description: 'Street-ready low-top with premium leather upper and vulcanized rubber outsole. Where culture meets craft.',
      type: ProductType.SHOES, categoryId: shoesCategory.id, tags: ['lifestyle', 'leather', 'street', 'featured'], isFeatured: true,
      variants: { create: [
        { size: '40', color: 'Chalk White', colorHex: '#f8f8f8', price: 6999, stock: 20, sku: 'UEP-40-WHT', images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'] },
        { size: '41', color: 'Chalk White', colorHex: '#f8f8f8', price: 6999, stock: 15, sku: 'UEP-41-WHT', images: ['https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800'] },
        { size: '42', color: 'Midnight Navy', colorHex: '#1a237e', price: 6999, salePrice: 5999, stock: 8, sku: 'UEP-42-NVY', images: ['https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=800'] },
      ]},
    },
  })

  const performanceTee = await prisma.product.upsert({
    where: { slug: 'hyperfit-performance-tee' },
    update: {},
    create: {
      slug: 'hyperfit-performance-tee', name: 'Performance Tee',
      description: 'Moisture-wicking dry-fit tee engineered for peak performance. 4-way stretch, flatlock seams, anti-odor treatment.',
      type: ProductType.TSHIRT, categoryId: clothingCategory.id, tags: ['performance', 'dry-fit', 'training'], isFeatured: false,
      variants: { create: [
        { size: 'S', color: 'Phantom Black', colorHex: '#0a0a0a', price: 2999, stock: 40, sku: 'PT-S-BLK', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'] },
        { size: 'M', color: 'Phantom Black', colorHex: '#0a0a0a', price: 2999, stock: 50, sku: 'PT-M-BLK', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'] },
        { size: 'L', color: 'Phantom Black', colorHex: '#0a0a0a', price: 2999, stock: 35, sku: 'PT-L-BLK', images: ['https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800'] },
        { size: 'M', color: 'Electric Lime', colorHex: '#e8ff47', price: 2999, salePrice: 2499, stock: 22, sku: 'PT-M-LIM', images: ['https://images.unsplash.com/photo-1626497764746-6dc36546b388?w=800'] },
      ]},
    },
  })

  const oversizedTee = await prisma.product.upsert({
    where: { slug: 'hyperfit-oversized-graphic-tee' },
    update: {},
    create: {
      slug: 'hyperfit-oversized-graphic-tee', name: 'Oversized Graphic Tee',
      description: 'Drop-shoulder silhouette in 100% organic cotton. Bold HyperFit graphic print, boxy fit.',
      type: ProductType.TSHIRT, categoryId: clothingCategory.id, tags: ['lifestyle', 'cotton', 'oversized', 'graphic'], isFeatured: true,
      variants: { create: [
        { size: 'S', color: 'Chalk White', colorHex: '#f8f8f8', price: 3499, stock: 30, sku: 'OGT-S-WHT', images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'] },
        { size: 'M', color: 'Chalk White', colorHex: '#f8f8f8', price: 3499, stock: 28, sku: 'OGT-M-WHT', images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'] },
        { size: 'L', color: 'Ash Gray', colorHex: '#6b6b6b', price: 3499, stock: 20, sku: 'OGT-L-GRY', images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'] },
        { size: 'XL', color: 'Ash Gray', colorHex: '#6b6b6b', price: 3499, stock: 0, sku: 'OGT-XL-GRY', images: ['https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800'] },
      ]},
    },
  })

  const techCargo = await prisma.product.upsert({
    where: { slug: 'hyperfit-tech-cargo-pants' },
    update: {},
    create: {
      slug: 'hyperfit-tech-cargo-pants', name: 'Tech Cargo Pants',
      description: 'Multi-pocket tactical cargo in water-resistant nylon. 6 pockets, adjustable ankle cuffs.',
      type: ProductType.PANTS, categoryId: clothingCategory.id, tags: ['cargo', 'nylon', 'tactical', 'featured'], isFeatured: true,
      variants: { create: [
        { size: 'S', color: 'Phantom Black', colorHex: '#0a0a0a', price: 5999, stock: 20, sku: 'TCP-S-BLK', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'] },
        { size: 'M', color: 'Phantom Black', colorHex: '#0a0a0a', price: 5999, stock: 25, sku: 'TCP-M-BLK', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'] },
        { size: 'L', color: 'Olive Drab', colorHex: '#6b7c45', price: 5999, salePrice: 4999, stock: 15, sku: 'TCP-L-OLV', images: ['https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800'] },
      ]},
    },
  })

  await prisma.product.upsert({
    where: { slug: 'hyperfit-performance-cap' },
    update: {},
    create: {
      slug: 'hyperfit-performance-cap', name: 'Performance Cap',
      description: '6-panel structured cap in moisture-wicking mesh. Embroidered HyperFit logo, adjustable snapback.',
      type: ProductType.ACCESSORIES, categoryId: accessoriesCategory.id, tags: ['cap', 'accessories', 'mesh'], isFeatured: false,
      variants: { create: [
        { size: 'ONE SIZE', color: 'Phantom Black', colorHex: '#0a0a0a', price: 1499, stock: 50, sku: 'CAP-OS-BLK', images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800'] },
        { size: 'ONE SIZE', color: 'Electric Lime', colorHex: '#e8ff47', price: 1499, stock: 30, sku: 'CAP-OS-LIM', images: ['https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=800'] },
      ]},
    },
  })

  await prisma.coupon.upsert({ where: { code: 'HYPER10' }, update: {}, create: { code: 'HYPER10', type: 'percentage', value: 10, minOrder: 999, isActive: true } })
  await prisma.coupon.upsert({ where: { code: 'HYPER500' }, update: {}, create: { code: 'HYPER500', type: 'fixed', value: 500, minOrder: 2999, isActive: true } })
  await prisma.coupon.upsert({ where: { code: 'WELCOME15' }, update: {}, create: { code: 'WELCOME15', type: 'percentage', value: 15, minOrder: 0, maxUses: 1000, isActive: true } })

  await prisma.banner.upsert({
    where: { id: 'banner-hero-1' },
    update: {},
    create: { id: 'banner-hero-1', title: 'New Drop: Velocity X1', imageUrl: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1920', link: '/product/hyperfit-velocity-x1', position: 'hero', isActive: true },
  })

  for (const product of [velocity, performanceTee, oversizedTee, techCargo]) {
    await prisma.review.upsert({
      where: { userId_productId: { userId: testUser.id, productId: product.id } },
      update: {},
      create: { userId: testUser.id, productId: product.id, rating: 5, title: 'Absolutely incredible', body: 'The quality is unlike anything I have owned. Every detail is perfect. Worth every rupee.', verified: true, images: [] },
    })
  }

  console.log('✅ Seed complete!')
  console.log('   Admin: admin@hyperfit.com / password123')
  console.log('   User:  user@hyperfit.com  / password123')
}

main().catch((e) => { console.error(e); process.exit(1) }).finally(() => prisma.$disconnect())
