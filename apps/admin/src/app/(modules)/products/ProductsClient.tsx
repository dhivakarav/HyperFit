'use client'

import { useState } from 'react'
import { Edit, Trash2, Eye, EyeOff } from 'lucide-react'

interface Product {
  id: string; name: string; slug: string; isPublished: boolean; isFeatured: boolean; type: string
  category: { name: string }
  variants: Array<{ price: number; stock: number }>
  _count: { reviews: number }
}

export default function ProductsClient({ products }: { products: Product[]; categories: Array<{ id: string; name: string }> }) {
  const [search, setSearch] = useState('')

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const minPrice = (variants: Product['variants']) =>
    variants.length ? Math.min(...variants.map((v) => v.price)) : 0

  const totalStock = (variants: Product['variants']) =>
    variants.reduce((sum, v) => sum + v.stock, 0)

  return (
    <div>
      <div className="flex gap-3 mb-6">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products..."
          className="flex-1 h-10 bg-[#1c1c1c] border border-[#444444] text-[#f8f8f8] text-sm px-4 outline-none focus:border-[#e8ff47] max-w-sm"
        />
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-[#888888] text-xs uppercase tracking-wider">
              <th className="text-left py-3 pr-4">Product</th>
              <th className="text-left py-3 pr-4">Category</th>
              <th className="text-left py-3 pr-4">Type</th>
              <th className="text-right py-3 pr-4">Price</th>
              <th className="text-right py-3 pr-4">Stock</th>
              <th className="text-center py-3 pr-4">Reviews</th>
              <th className="text-center py-3 pr-4">Status</th>
              <th className="text-right py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((product) => (
              <tr key={product.id} className="border-b border-[#1c1c1c] hover:bg-[#1c1c1c] transition-colors">
                <td className="py-3 pr-4">
                  <div>
                    <p className="font-medium text-[#f8f8f8]">{product.name}</p>
                    {product.isFeatured && <span className="text-[10px] font-bold text-[#e8ff47] uppercase">Featured</span>}
                  </div>
                </td>
                <td className="py-3 pr-4 text-[#888888]">{product.category.name}</td>
                <td className="py-3 pr-4 text-[#888888]">{product.type}</td>
                <td className="py-3 pr-4 text-right text-[#e8ff47] font-bold">₹{minPrice(product.variants).toLocaleString()}</td>
                <td className="py-3 pr-4 text-right">
                  <span className={totalStock(product.variants) === 0 ? 'text-[#ff3c3c]' : totalStock(product.variants) < 20 ? 'text-yellow-400' : 'text-green-400'}>
                    {totalStock(product.variants)}
                  </span>
                </td>
                <td className="py-3 pr-4 text-center text-[#888888]">{product._count.reviews}</td>
                <td className="py-3 pr-4 text-center">
                  <span className={`text-xs font-bold px-2 py-0.5 ${product.isPublished ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                    {product.isPublished ? 'Live' : 'Draft'}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button className="p-1.5 text-[#888888] hover:text-[#f8f8f8] transition-colors" title="Toggle visibility">
                      {product.isPublished ? <EyeOff size={14} /> : <Eye size={14} />}
                    </button>
                    <button className="p-1.5 text-[#888888] hover:text-[#e8ff47] transition-colors" title="Edit">
                      <Edit size={14} />
                    </button>
                    <button className="p-1.5 text-[#888888] hover:text-[#ff3c3c] transition-colors" title="Delete">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <p className="text-center text-[#888888] py-12">No products found</p>
        )}
      </div>
    </div>
  )
}
