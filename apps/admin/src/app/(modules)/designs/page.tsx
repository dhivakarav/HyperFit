import { db } from '@hyperfit/db'

export default async function AdminDesignsPage() {
  const designs = await db.customDesign.findMany({
    include: { user: { select: { name: true, email: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold uppercase tracking-wider mb-6">Custom Design Approvals</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {designs.map((design) => (
          <div key={design.id} className="bg-[#1c1c1c] border border-[#2a2a2a]">
            <div className="aspect-video bg-[#0a0a0a] flex items-center justify-center">
              {design.previewUrl ? (
                <img src={design.previewUrl} alt={design.name} className="w-full h-full object-cover" />
              ) : (
                <div className="text-center p-4">
                  <p className="text-[#444444] text-xs">No preview</p>
                  <p className="text-[#888888] text-xs mt-1">{design.productType}</p>
                </div>
              )}
            </div>
            <div className="p-4">
              <p className="font-bold text-sm text-[#f8f8f8]">{design.name}</p>
              <p className="text-[#888888] text-xs">{design.user.name} · {new Date(design.createdAt).toLocaleDateString('en-IN')}</p>
              <div className="flex gap-2 mt-3">
                <button className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-green-400/10 text-green-400 hover:bg-green-400/20 transition-colors border border-green-400/20">
                  Approve
                </button>
                <button className="flex-1 py-2 text-xs font-bold uppercase tracking-wider bg-red-400/10 text-red-400 hover:bg-red-400/20 transition-colors border border-red-400/20">
                  Reject
                </button>
              </div>
            </div>
          </div>
        ))}

        {designs.length === 0 && (
          <p className="text-[#888888] col-span-full text-center py-12">No pending designs</p>
        )}
      </div>
    </div>
  )
}
