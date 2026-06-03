'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Package } from 'lucide-react'
import { Badge } from '@hyperfit/ui'

const STATUS_VARIANT: Record<string, 'new' | 'sale' | 'limited' | 'soldout' | 'default'> = {
  PENDING: 'default',
  PROCESSING: 'new',
  SHIPPED: 'limited',
  DELIVERED: 'new',
  RETURNED: 'sale',
  CANCELLED: 'soldout',
}

interface Order {
  id: string; orderNumber: string; status: string; total: number; createdAt: Date
  items: Array<{ id: string; name: string; price: number; quantity: number; size?: string | null; color?: string | null; image?: string | null }>
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [expanded, setExpanded] = useState<string | null>(null)

  if (orders.length === 0) {
    return (
      <div className="text-center py-20">
        <Package size={48} className="text-[#e8e8e8] mx-auto mb-4" />
        <p className="text-[#6b6b6b]">No orders yet. Start shopping!</p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <div key={order.id} className="bg-[#f2f2f2] border border-[#e8e8e8] overflow-hidden">
          <button
            onClick={() => setExpanded(expanded === order.id ? null : order.id)}
            className="w-full flex items-center justify-between p-5 text-left hover:bg-[#e8e8e8] transition-colors"
          >
            <div className="flex items-center gap-4">
              <div>
                <p className="font-bold text-sm text-[#0a0a0a]">#{order.orderNumber.slice(-8).toUpperCase()}</p>
                <p className="text-[#6b6b6b] text-xs">{new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={STATUS_VARIANT[order.status] ?? 'default'}>{order.status}</Badge>
              <span className="text-[#c8102e] font-bold text-sm">₹{order.total.toLocaleString()}</span>
              <motion.div animate={{ rotate: expanded === order.id ? 180 : 0 }}>
                <ChevronDown size={16} className="text-[#6b6b6b]" />
              </motion.div>
            </div>
          </button>

          <AnimatePresence>
            {expanded === order.id && (
              <motion.div
                initial={{ height: 0 }}
                animate={{ height: 'auto' }}
                exit={{ height: 0 }}
                className="overflow-hidden"
              >
                <div className="px-5 pb-5 border-t border-[#e8e8e8] pt-4 space-y-3">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-3">
                      {item.image && <img src={item.image} alt={item.name} className="w-12 h-12 object-cover bg-[#ffffff]" />}
                      <div className="flex-1">
                        <p className="text-sm text-[#0a0a0a]">{item.name}</p>
                        <p className="text-xs text-[#6b6b6b]">{[item.size, item.color].filter(Boolean).join(' · ')} × {item.quantity}</p>
                      </div>
                      <span className="text-sm text-[#c8102e] font-bold">₹{(item.price * item.quantity).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  )
}
