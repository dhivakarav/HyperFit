'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Minus, Plus, ShoppingBag, Trash2, Tag } from 'lucide-react'
import { Button } from '@hyperfit/ui'
import { useCartStore } from '@/store/cartStore'

export default function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQuantity, subtotal, couponCode, discount, setCoupon, clearCoupon, clearCart } = useCartStore()
  const [couponInput, setCouponInput] = useState('')
  const [couponError, setCouponError] = useState('')
  const [couponLoading, setCouponLoading] = useState(false)

  const sub = subtotal()
  const shipping = sub >= 999 ? 0 : 99
  const discountAmount = couponCode ? discount : 0
  const total = sub + shipping - discountAmount

  async function applyCoupon() {
    if (!couponInput.trim()) return
    setCouponLoading(true)
    setCouponError('')
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput.trim(), subtotal: sub }),
      })
      const data = await res.json()
      if (data.valid) {
        setCoupon(couponInput.trim().toUpperCase(), data.discount)
        setCouponInput('')
      } else {
        setCouponError(data.error || 'Invalid coupon code')
      }
    } catch {
      setCouponError('Failed to validate coupon')
    } finally {
      setCouponLoading(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50">
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
          />

          {/* Drawer */}
          <motion.div
            className="absolute right-0 top-0 bottom-0 w-full max-w-[420px] bg-[#ffffff] border-l border-[#f2f2f2] flex flex-col"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 350, damping: 30 }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#f2f2f2]">
              <div className="flex items-center gap-2">
                <ShoppingBag size={18} className="text-[#c8102e]" />
                <h2 className="font-bold uppercase tracking-wider text-sm">
                  Cart {items.length > 0 && <span className="text-[#6b6b6b]">({items.length})</span>}
                </h2>
              </div>
              <div className="flex items-center gap-3">
                {items.length > 0 && (
                  <button
                    onClick={clearCart}
                    className="flex items-center gap-1 text-[#6b6b6b] hover:text-[#ff3c3c] transition-colors text-xs font-bold uppercase tracking-wider"
                  >
                    <Trash2 size={14} /> Clear
                  </button>
                )}
                <button onClick={closeCart} className="p-1 text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors">
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full gap-4 px-6 text-center">
                  <ShoppingBag size={48} className="text-[#e8e8e8]" />
                  <p className="text-[#6b6b6b]">Your cart is empty</p>
                  <Button variant="ghost" size="sm" onClick={closeCart} asChild>
                    <Link href="/shop">Start Shopping</Link>
                  </Button>
                </div>
              ) : (
                <div className="px-6 py-4 flex flex-col gap-4">
                  {items.map((item) => (
                    <motion.div
                      key={item.id}
                      layout
                      exit={{ opacity: 0, x: 50 }}
                      className="flex gap-4"
                    >
                      <div className="w-20 h-20 bg-[#f2f2f2] shrink-0 overflow-hidden">
                        {item.image ? (
                          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#d8d8d8]">
                            <ShoppingBag size={20} />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#0a0a0a] leading-tight line-clamp-2">{item.name}</p>
                        {(item.size || item.color) && (
                          <p className="text-xs text-[#6b6b6b] mt-0.5">
                            {[item.size, item.color].filter(Boolean).join(' · ')}
                          </p>
                        )}
                        {item.isCustom && (
                          <span className="inline-block mt-1 text-[10px] bg-[#c8102e] text-[#ffffff] font-bold px-1.5 py-0.5 uppercase tracking-wider">
                            Custom
                          </span>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex items-center border border-[#d8d8d8]">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="px-2 py-1 text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
                            >
                              <Minus size={12} />
                            </button>
                            <span className="px-3 text-sm text-[#0a0a0a]">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="px-2 py-1 text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-bold text-[#c8102e]">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </span>
                            <button
                              onClick={() => removeItem(item.id)}
                              className="p-1 text-[#d8d8d8] hover:text-[#ff3c3c] transition-colors"
                              aria-label="Remove"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="border-t border-[#f2f2f2] px-6 py-5 flex flex-col gap-4">
                {/* Coupon */}
                {couponCode ? (
                  <div className="flex items-center justify-between bg-[#f2f2f2] px-3 py-2">
                    <div className="flex items-center gap-2 text-sm text-[#c8102e]">
                      <Tag size={14} />
                      <span className="font-bold">{couponCode}</span>
                      <span className="text-[#6b6b6b]">applied</span>
                    </div>
                    <button onClick={clearCoupon} className="text-[#6b6b6b] hover:text-[#ff3c3c] text-xs">
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      value={couponInput}
                      onChange={(e) => { setCouponInput(e.target.value.toUpperCase()); setCouponError('') }}
                      placeholder="Coupon code"
                      className="flex-1 h-10 bg-[#f2f2f2] border border-[#d8d8d8] text-[#0a0a0a] text-sm px-3 outline-none focus:border-[#c8102e] uppercase placeholder:normal-case placeholder:text-[#d8d8d8]"
                      onKeyDown={(e) => e.key === 'Enter' && applyCoupon()}
                    />
                    <Button variant="outline" size="sm" onClick={applyCoupon} loading={couponLoading}>
                      Apply
                    </Button>
                  </div>
                )}
                {couponError && <p className="text-[#ff3c3c] text-xs -mt-2">{couponError}</p>}

                {/* Totals */}
                <div className="flex flex-col gap-2 text-sm">
                  <div className="flex justify-between text-[#6b6b6b]">
                    <span>Subtotal</span>
                    <span>₹{sub.toLocaleString()}</span>
                  </div>
                  {discountAmount > 0 && (
                    <div className="flex justify-between text-[#c8102e]">
                      <span>Discount</span>
                      <span>-₹{discountAmount.toLocaleString()}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-[#6b6b6b]">
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-[#c8102e]">Free</span> : `₹${shipping}`}</span>
                  </div>
                  <div className="flex justify-between text-[#0a0a0a] font-bold text-base border-t border-[#f2f2f2] pt-2 mt-1">
                    <span>Total</span>
                    <span className="text-[#c8102e]">₹{total.toLocaleString()}</span>
                  </div>
                </div>

                <p className="text-center text-xs text-[#6b6b6b]">Free shipping on orders over ₹999</p>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
