'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { ShoppingBag, Minus, Plus, Trash2 } from 'lucide-react'
import { Button } from '@hyperfit/ui'
import { useCartStore } from '@/store/cartStore'

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal } = useCartStore()
  const sub = subtotal()
  const shipping = sub >= 999 ? 0 : 99

  if (items.length === 0) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="text-center">
          <ShoppingBag size={64} className="text-[#e8e8e8] mx-auto mb-6" />
          <h1 className="font-display text-5xl text-[#0a0a0a] mb-4">YOUR CART IS EMPTY</h1>
          <p className="text-[#6b6b6b] mb-8">Looks like you haven&apos;t added anything yet.</p>
          <Link href="/shop">
            <Button variant="primary" size="lg">Start Shopping</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="font-display text-6xl text-[#0a0a0a] mb-10">YOUR CART</h1>

        <div className="grid lg:grid-cols-[1fr_360px] gap-10">
          {/* Items */}
          <div className="space-y-4">
            {items.map((item) => (
              <motion.div
                key={item.id}
                layout
                exit={{ opacity: 0, x: 50 }}
                className="flex gap-5 p-5 bg-[#f2f2f2] border border-[#e8e8e8]"
              >
                <div className="w-24 h-24 bg-[#ffffff] shrink-0 overflow-hidden">
                  {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-[#0a0a0a]">{item.name}</p>
                  {(item.size || item.color) && (
                    <p className="text-sm text-[#6b6b6b] mt-1">{[item.size, item.color].filter(Boolean).join(' · ')}</p>
                  )}
                  {item.isCustom && <span className="inline-block mt-1 text-[10px] bg-[#c8102e] text-[#ffffff] font-bold px-1.5 py-0.5 uppercase">Custom</span>}

                  <div className="flex items-center justify-between mt-4">
                    <div className="flex items-center border border-[#d8d8d8]">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 py-2 text-[#6b6b6b] hover:text-[#0a0a0a]">
                        <Minus size={14} />
                      </button>
                      <span className="px-4 text-[#0a0a0a]">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 py-2 text-[#6b6b6b] hover:text-[#0a0a0a]">
                        <Plus size={14} />
                      </button>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-bold text-[#c8102e]">₹{(item.price * item.quantity).toLocaleString()}</span>
                      <button onClick={() => removeItem(item.id)} className="p-1 text-[#d8d8d8] hover:text-[#ff3c3c] transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary */}
          <div className="bg-[#f2f2f2] border border-[#e8e8e8] p-6 self-start sticky top-24">
            <h2 className="font-bold text-sm uppercase tracking-wider text-[#0a0a0a] mb-6">Order Summary</h2>
            <div className="space-y-3 text-sm mb-6">
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Subtotal ({items.length} items)</span>
                <span>₹{sub.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-[#6b6b6b]">
                <span>Shipping</span>
                <span>{shipping === 0 ? <span className="text-[#c8102e]">Free</span> : `₹${shipping}`}</span>
              </div>
              <div className="flex justify-between text-[#0a0a0a] font-bold text-base border-t border-[#d8d8d8] pt-3">
                <span>Total</span>
                <span className="text-[#c8102e]">₹{(sub + shipping).toLocaleString()}</span>
              </div>
            </div>
            <p className="text-center text-xs text-[#6b6b6b] mt-3">Free shipping on orders over ₹999</p>
          </div>
        </div>
      </div>
    </div>
  )
}
