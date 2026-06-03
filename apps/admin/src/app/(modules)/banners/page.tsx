import { db } from '@hyperfit/db'

export default async function AdminBannersPage() {
  const banners = await db.banner.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold uppercase tracking-wider mb-6">Banners</h1>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {banners.map((banner) => (
          <div key={banner.id} className="bg-[#1c1c1c] border border-[#2a2a2a]">
            <div className="aspect-video bg-[#0a0a0a] overflow-hidden">
              {banner.imageUrl ? (
                <img src={banner.imageUrl} alt={banner.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[#444444] text-sm">No image</div>
              )}
            </div>
            <div className="p-4">
              <p className="font-bold text-sm text-[#f8f8f8]">{banner.title}</p>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-[#888888] capitalize">{banner.position}</span>
                <span className={`text-xs font-bold px-2 py-0.5 ${banner.isActive ? 'bg-green-400/10 text-green-400' : 'bg-[#444444] text-[#888888]'}`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>
          </div>
        ))}

        <div className="border-2 border-dashed border-[#444444] aspect-video flex items-center justify-center cursor-pointer hover:border-[#e8ff47] transition-colors group">
          <div className="text-center">
            <p className="text-[#888888] group-hover:text-[#e8ff47] text-sm font-bold uppercase tracking-wider">+ Add Banner</p>
          </div>
        </div>
      </div>
    </div>
  )
}
