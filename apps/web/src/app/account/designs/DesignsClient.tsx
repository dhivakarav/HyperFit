'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Palette, ExternalLink, Trash2 } from 'lucide-react'
import { Badge } from '@hyperfit/ui'

const TYPE_ROUTE: Record<string, string> = {
  SHOES: '/customize/shoes',
  TSHIRT: '/customize/tshirts',
  PANTS: '/customize/pants',
}

interface Design {
  id: string; name: string; productType: string; previewUrl?: string | null; status: string; createdAt: Date; price?: number | null
}

export default function DesignsClient({ designs }: { designs: Design[] }) {
  if (designs.length === 0) {
    return (
      <div className="text-center py-20">
        <Palette size={48} className="text-[#e8e8e8] mx-auto mb-4" />
        <p className="text-[#6b6b6b] mb-4">No saved designs yet.</p>
        <Link href="/customize/shoes" className="text-[#c8102e] hover:underline">Start designing →</Link>
      </div>
    )
  }

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {designs.map((design, i) => (
        <motion.div
          key={design.id}
          className="bg-[#f2f2f2] border border-[#e8e8e8] overflow-hidden group"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <div className="aspect-square bg-[#ffffff] relative overflow-hidden">
            {design.previewUrl ? (
              <img src={design.previewUrl} alt={design.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Palette size={40} className="text-[#e8e8e8]" />
              </div>
            )}
            <div className="absolute top-3 left-3">
              <Badge variant="default">{design.productType}</Badge>
            </div>
          </div>
          <div className="p-4">
            <p className="font-bold text-[#0a0a0a] text-sm mb-1">{design.name}</p>
            <p className="text-[#6b6b6b] text-xs mb-3">{new Date(design.createdAt).toLocaleDateString('en-IN')}</p>
            {design.price && <p className="text-[#c8102e] font-bold text-sm mb-3">₹{design.price.toLocaleString()}</p>}
            <div className="flex gap-2">
              <Link
                href={`${TYPE_ROUTE[design.productType] ?? '/customize/shoes'}?designId=${design.id}`}
                className="flex-1 flex items-center justify-center gap-2 py-2 text-xs font-bold uppercase tracking-wider border border-[#d8d8d8] text-[#6b6b6b] hover:border-[#c8102e] hover:text-[#c8102e] transition-colors"
              >
                <ExternalLink size={12} /> Open
              </Link>
              <button className="p-2 border border-[#d8d8d8] text-[#6b6b6b] hover:border-[#ff3c3c] hover:text-[#ff3c3c] transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
