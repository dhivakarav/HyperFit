import { db } from '@hyperfit/db'

export default async function InventoryPage() {
  const variants = await db.productVariant.findMany({
    include: { product: { select: { name: true, slug: true } } },
    orderBy: { stock: 'asc' },
    take: 100,
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold uppercase tracking-wider mb-6">Inventory</h1>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-[#888888] text-xs uppercase tracking-wider">
              <th className="text-left py-3 pr-4">Product</th>
              <th className="text-left py-3 pr-4">SKU</th>
              <th className="text-left py-3 pr-4">Size</th>
              <th className="text-left py-3 pr-4">Color</th>
              <th className="text-right py-3 pr-4">Price</th>
              <th className="text-right py-3 pr-4">Stock</th>
              <th className="text-right py-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {variants.map((v) => (
              <tr key={v.id} className="border-b border-[#1c1c1c] hover:bg-[#1c1c1c]">
                <td className="py-3 pr-4 text-[#f8f8f8]">{v.product.name}</td>
                <td className="py-3 pr-4 font-mono text-xs text-[#888888]">{v.sku}</td>
                <td className="py-3 pr-4 text-[#888888]">{v.size}</td>
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-2">
                    {v.colorHex && <span className="w-4 h-4 rounded-full border border-[#444444]" style={{ backgroundColor: v.colorHex }} />}
                    <span className="text-[#888888] text-xs">{v.color}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-right text-[#e8ff47]">₹{v.price.toLocaleString()}</td>
                <td className="py-3 pr-4 text-right">
                  <span className={`font-bold ${v.stock === 0 ? 'text-[#ff3c3c]' : v.stock <= 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                    {v.stock}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button className="text-xs px-3 py-1 border border-[#444444] text-[#888888] hover:border-[#e8ff47] hover:text-[#e8ff47] transition-colors">
                    Restock
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
