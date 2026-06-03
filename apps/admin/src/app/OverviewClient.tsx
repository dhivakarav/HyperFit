'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { TrendingUp, ShoppingCart, Users, DollarSign, AlertTriangle } from 'lucide-react'

interface Stats {
  ordersToday: number
  totalRevenue: number
  newUsers: number
  revenueData: Array<{ date: string; revenue: number }>
  recentOrders: Array<{
    id: string; orderNumber: string; status: string; total: number; createdAt: Date
    user?: { name: string; email: string } | null
    items: Array<{ name: string }>
  }>
  lowStock: Array<{ id: string; sku: string; stock: number; size: string; color: string; product: { name: string } }>
}

const KPI_CARDS = (stats: Stats) => [
  { label: 'Total Revenue', value: `₹${stats.totalRevenue.toLocaleString()}`, icon: DollarSign, trend: '+12%' },
  { label: 'Orders Today', value: stats.ordersToday.toString(), icon: ShoppingCart, trend: '+5%' },
  { label: 'New Users Today', value: stats.newUsers.toString(), icon: Users, trend: '+8%' },
  { label: 'Avg Order Value', value: `₹${stats.ordersToday > 0 ? Math.round(stats.totalRevenue / Math.max(1, stats.ordersToday)) : 0}`, icon: TrendingUp, trend: '+3%' },
]

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'text-yellow-400',
  PROCESSING: 'text-blue-400',
  SHIPPED: 'text-purple-400',
  DELIVERED: 'text-green-400',
  RETURNED: 'text-orange-400',
  CANCELLED: 'text-red-400',
}

export default function OverviewClient({ stats }: { stats: Stats }) {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-[#f8f8f8] uppercase tracking-wider">Dashboard Overview</h1>
        <p className="text-[#888888] text-sm mt-1">Welcome back, Admin.</p>
      </div>

      {/* KPI Cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        {KPI_CARDS(stats).map(({ label, value, icon: Icon, trend }) => (
          <div key={label} className="bg-[#1c1c1c] border border-[#2a2a2a] p-5">
            <div className="flex items-center justify-between mb-3">
              <Icon size={18} className="text-[#888888]" />
              <span className="text-xs font-bold text-[#e8ff47]">{trend}</span>
            </div>
            <p className="text-2xl font-bold text-[#f8f8f8]">{value}</p>
            <p className="text-xs text-[#888888] mt-1 uppercase tracking-wider">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-6 mb-8">
        <h2 className="font-bold text-sm uppercase tracking-wider text-[#888888] mb-6">Revenue — Last 30 Days</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={stats.revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="date" stroke="#888888" tick={{ fontSize: 11 }} interval={4} />
              <YAxis stroke="#888888" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1c1c1c', border: '1px solid #444', borderRadius: 0 }}
                labelStyle={{ color: '#f8f8f8', fontSize: 12 }}
                formatter={(v: number) => [`₹${v.toLocaleString()}`, 'Revenue']}
              />
              <Line type="monotone" dataKey="revenue" stroke="#e8ff47" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Recent orders */}
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-6">
          <h2 className="font-bold text-sm uppercase tracking-wider text-[#888888] mb-4">Recent Orders</h2>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0">
                <div>
                  <p className="text-xs font-bold text-[#f8f8f8]">#{order.orderNumber.slice(-8).toUpperCase()}</p>
                  <p className="text-xs text-[#888888]">{order.user?.name ?? 'Guest'}</p>
                </div>
                <div className="text-right">
                  <p className={`text-xs font-bold uppercase ${STATUS_COLORS[order.status] ?? 'text-[#888888]'}`}>{order.status}</p>
                  <p className="text-xs text-[#e8ff47] font-bold">₹{order.total.toLocaleString()}</p>
                </div>
              </div>
            ))}
            {stats.recentOrders.length === 0 && (
              <p className="text-[#888888] text-sm">No orders yet</p>
            )}
          </div>
        </div>

        {/* Low stock alerts */}
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-6">
          <h2 className="font-bold text-sm uppercase tracking-wider text-[#888888] mb-4 flex items-center gap-2">
            <AlertTriangle size={14} className="text-[#ff3c3c]" /> Low Stock Alerts
          </h2>
          <div className="space-y-3">
            {stats.lowStock.map((variant) => (
              <div key={variant.id} className="flex items-center justify-between py-2 border-b border-[#2a2a2a] last:border-0">
                <div>
                  <p className="text-xs font-bold text-[#f8f8f8]">{variant.product.name}</p>
                  <p className="text-xs text-[#888888]">{variant.size} / {variant.color}</p>
                </div>
                <span className={`text-xs font-bold px-2 py-0.5 ${variant.stock === 0 ? 'bg-[#ff3c3c] text-white' : 'bg-yellow-500/20 text-yellow-400'}`}>
                  {variant.stock === 0 ? 'OUT' : `${variant.stock} left`}
                </span>
              </div>
            ))}
            {stats.lowStock.length === 0 && (
              <p className="text-[#e8ff47] text-sm">All stock levels good ✓</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
