import { db } from '@hyperfit/db'
import ProductsClient from './ProductsClient'

export default async function AdminProductsPage() {
  const [products, categories] = await Promise.all([
    db.product.findMany({
      include: { variants: true, category: true, _count: { select: { reviews: true } } },
      orderBy: { createdAt: 'desc' },
    }),
    db.category.findMany(),
  ])

  return (
    <div className="p-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wider">Products</h1>
          <p className="text-[#888888] text-sm">{products.length} products</p>
        </div>
      </div>
      <ProductsClient products={products} categories={categories} />
    </div>
  )
}
