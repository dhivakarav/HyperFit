'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const STATUSES = ['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'RETURNED', 'CANCELLED']

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400 bg-yellow-400/10',
  PROCESSING: 'text-blue-400 bg-blue-400/10',
  SHIPPED: 'text-purple-400 bg-purple-400/10',
  DELIVERED: 'text-green-400 bg-green-400/10',
  RETURNED: 'text-orange-400 bg-orange-400/10',
  CANCELLED: 'text-red-400 bg-red-400/10',
}

interface Order {
  id: string; orderNumber: string; status: string; total: number; createdAt: Date
  user?: { name: string; email: string } | null
  items: Array<{ id: string; name: string; quantity: number; price: number; size?: string | null; color?: string | null }>
}

export default function OrdersClient({ orders }: { orders: Order[] }) {
  const [filter, setFilter] = useState('ALL')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [updating, setUpdating] = useState<string | null>(null)

  const filtered = filter === 'ALL' ? orders : orders.filter((o) => o.status === filter)

  async function updateStatus(orderId: string, status: string) {
    setUpdating(orderId)
    try {
      await fetch(`/api/admin/orders`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status }),
      })
    } finally {
      setUpdating(null)
    }
  }

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors ${filter === s ? 'border-[#e8ff47] bg-[#e8ff47] text-[#0a0a0a]' : 'border-[#444444] text-[#888888] hover:border-[#e8ff47]'}`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {filtered.map((order) => (
          <div key={order.id} className="bg-[#1c1c1c] border border-[#2a2a2a]">
            <button
              onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              className="w-full flex items-center justify-between p-4 text-left hover:bg-[#2a2a2a] transition-colors"
            >
              <div className="flex items-center gap-6">
                <span className="text-xs font-bold text-[#f8f8f8]">#{order.orderNumber.slice(-8).toUpperCase()}</span>
                <span className="text-xs text-[#888888]">{order.user?.name ?? 'Guest'}</span>
                <span className="text-xs text-[#888888]">{new Date(order.createdAt).toLocaleDateString('en-IN')}</span>
              </div>
              <div className="flex items-center gap-4">
                <span className={`text-xs font-bold px-2 py-0.5 uppercase ${STATUS_COLORS[order.status] ?? 'text-[#888888]'}`}>
                  {order.status}
                </span>
                <span className="text-[#e8ff47] font-bold text-sm">₹{order.total.toLocaleString()}</span>
                <motion.div animate={{ rotate: expanded === order.id ? 180 : 0 }}>
                  <ChevronDown size={14} className="text-[#888888]" />
                </motion.div>
              </div>
            </button>

            <AnimatePresence>
              {expanded === order.id && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="px-4 pb-4 border-t border-[#2a2a2a] pt-4">
                    <div className="space-y-2 mb-4">
                      {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between text-sm">
                          <span className="text-[#888888]">{item.name} {item.size && `(${item.size})`} x{item.quantity}</span>
                          <span className="text-[#e8ff47]">₹{(item.price * item.quantity).toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <select
                        defaultValue={order.status}
                        className="bg-[#0a0a0a] border border-[#444444] text-[#f8f8f8] text-xs px-3 py-2 outline-none focus:border-[#e8ff47]"
                        onChange={(e) => updateStatus(order.id, e.target.value)}
                        disabled={updating === order.id}
                      >
                        {STATUSES.slice(1).map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      {updating === order.id && <span className="text-xs text-[#888888]">Updating...</span>}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-[#888888] text-center py-12">No orders found</p>
        )}
      </div>
    </div>
  )
}
