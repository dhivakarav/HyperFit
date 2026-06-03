'use client'

import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'

interface Coupon {
  id: string; code: string; type: string; value: number; minOrder: number
  usedCount: number; maxUses?: number | null; expiresAt?: Date | null; isActive: boolean
}

export default function CouponsClient({ coupons: initial }: { coupons: Coupon[] }) {
  const [coupons] = useState(initial)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ code: '', type: 'percentage', value: '', minOrder: '', maxUses: '', expiresAt: '' })

  async function createCoupon(e: React.FormEvent) {
    e.preventDefault()
    await fetch('/api/admin/coupons', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        code: form.code.toUpperCase(),
        type: form.type,
        value: parseFloat(form.value),
        minOrder: parseFloat(form.minOrder) || 0,
        maxUses: form.maxUses ? parseInt(form.maxUses) : undefined,
        expiresAt: form.expiresAt || undefined,
      }),
    })
    setShowForm(false)
  }

  return (
    <div>
      <button
        onClick={() => setShowForm((p) => !p)}
        className="flex items-center gap-2 mb-6 px-4 py-2.5 bg-[#e8ff47] text-[#0a0a0a] font-bold text-sm uppercase tracking-wider hover:brightness-110 transition-all"
      >
        <Plus size={16} /> Create Coupon
      </button>

      {showForm && (
        <form onSubmit={createCoupon} className="bg-[#1c1c1c] border border-[#2a2a2a] p-6 mb-6 grid sm:grid-cols-3 gap-4">
          <div>
            <label className="text-xs text-[#888888] uppercase tracking-wider mb-1 block">Code</label>
            <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} className="w-full h-10 bg-[#0a0a0a] border border-[#444444] text-[#f8f8f8] px-3 text-sm outline-none focus:border-[#e8ff47] uppercase" required />
          </div>
          <div>
            <label className="text-xs text-[#888888] uppercase tracking-wider mb-1 block">Type</label>
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full h-10 bg-[#0a0a0a] border border-[#444444] text-[#f8f8f8] px-3 text-sm outline-none focus:border-[#e8ff47]">
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed (₹)</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#888888] uppercase tracking-wider mb-1 block">Value</label>
            <input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="w-full h-10 bg-[#0a0a0a] border border-[#444444] text-[#f8f8f8] px-3 text-sm outline-none focus:border-[#e8ff47]" required />
          </div>
          <div className="sm:col-span-3 flex gap-3">
            <button type="submit" className="px-6 py-2 bg-[#e8ff47] text-[#0a0a0a] font-bold text-sm uppercase tracking-wider">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 border border-[#444444] text-[#888888] text-sm uppercase tracking-wider hover:border-[#f8f8f8]">Cancel</button>
          </div>
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-[#888888] text-xs uppercase tracking-wider">
              <th className="text-left py-3 pr-4">Code</th>
              <th className="text-left py-3 pr-4">Type</th>
              <th className="text-right py-3 pr-4">Value</th>
              <th className="text-right py-3 pr-4">Min Order</th>
              <th className="text-center py-3 pr-4">Usage</th>
              <th className="text-left py-3 pr-4">Expiry</th>
              <th className="text-center py-3 pr-4">Status</th>
              <th className="text-right py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="border-b border-[#1c1c1c] hover:bg-[#1c1c1c]">
                <td className="py-3 pr-4 font-bold text-[#e8ff47]">{coupon.code}</td>
                <td className="py-3 pr-4 text-[#888888] capitalize">{coupon.type}</td>
                <td className="py-3 pr-4 text-right text-[#f8f8f8]">{coupon.type === 'percentage' ? `${coupon.value}%` : `₹${coupon.value}`}</td>
                <td className="py-3 pr-4 text-right text-[#888888]">₹{coupon.minOrder}</td>
                <td className="py-3 pr-4 text-center text-[#888888]">{coupon.usedCount}{coupon.maxUses ? `/${coupon.maxUses}` : ''}</td>
                <td className="py-3 pr-4 text-xs text-[#888888]">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString('en-IN') : 'Never'}</td>
                <td className="py-3 pr-4 text-center">
                  <span className={`text-xs font-bold px-2 py-0.5 ${coupon.isActive ? 'bg-green-400/10 text-green-400' : 'bg-red-400/10 text-red-400'}`}>
                    {coupon.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="py-3 text-right">
                  <button className="p-1.5 text-[#888888] hover:text-[#ff3c3c] transition-colors">
                    <Trash2 size={14} />
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
