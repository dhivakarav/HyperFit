'use client'

import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts'

const REVENUE_DATA = Array.from({ length: 12 }, (_, i) => ({
  month: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'][i],
  revenue: Math.floor(Math.random() * 200000) + 50000,
  orders: Math.floor(Math.random() * 100) + 20,
}))

const PRODUCT_DATA = [
  { name: 'Velocity X1', revenue: 128000 },
  { name: 'Urban Edge Pro', revenue: 95000 },
  { name: 'Tech Cargo', revenue: 87000 },
  { name: 'Performance Tee', revenue: 62000 },
  { name: 'Slim Track', revenue: 48000 },
]

const STATUS_DATA = [
  { name: 'Delivered', value: 65, color: '#22c55e' },
  { name: 'Processing', value: 20, color: '#3b82f6' },
  { name: 'Shipped', value: 10, color: '#a855f7' },
  { name: 'Cancelled', value: 5, color: '#ef4444' },
]

export default function AnalyticsPage() {
  return (
    <div className="p-8 space-y-8">
      <h1 className="text-2xl font-bold uppercase tracking-wider">Analytics</h1>

      {/* KPIs */}
      <div className="grid sm:grid-cols-4 gap-4">
        {[
          { label: 'Conversion Rate', value: '3.2%' },
          { label: 'Avg Order Value', value: '₹4,850' },
          { label: 'Return Rate', value: '2.1%' },
          { label: 'Revenue MTD', value: '₹8.4L' },
        ].map(({ label, value }) => (
          <div key={label} className="bg-[#1c1c1c] border border-[#2a2a2a] p-5">
            <p className="text-2xl font-bold text-[#e8ff47]">{value}</p>
            <p className="text-xs text-[#888888] uppercase tracking-wider mt-1">{label}</p>
          </div>
        ))}
      </div>

      {/* Revenue chart */}
      <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-6">
        <h2 className="font-bold text-sm uppercase tracking-wider text-[#888888] mb-6">Monthly Revenue</h2>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={REVENUE_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
              <XAxis dataKey="month" stroke="#888888" tick={{ fontSize: 11 }} />
              <YAxis stroke="#888888" tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
              <Tooltip
                contentStyle={{ background: '#1c1c1c', border: '1px solid #444', borderRadius: 0 }}
                labelStyle={{ color: '#f8f8f8' }}
              />
              <Area type="monotone" dataKey="revenue" stroke="#e8ff47" fill="#e8ff47" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Top products */}
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-6">
          <h2 className="font-bold text-sm uppercase tracking-wider text-[#888888] mb-6">Top Products by Revenue</h2>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={PRODUCT_DATA} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#2a2a2a" />
                <XAxis type="number" stroke="#888888" tick={{ fontSize: 10 }} tickFormatter={(v) => `₹${(v/1000).toFixed(0)}k`} />
                <YAxis dataKey="name" type="category" stroke="#888888" tick={{ fontSize: 10 }} width={100} />
                <Tooltip contentStyle={{ background: '#1c1c1c', border: '1px solid #444' }} />
                <Bar dataKey="revenue" fill="#e8ff47" radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Order status */}
        <div className="bg-[#1c1c1c] border border-[#2a2a2a] p-6">
          <h2 className="font-bold text-sm uppercase tracking-wider text-[#888888] mb-6">Orders by Status</h2>
          <div className="h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={STATUS_DATA} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value">
                  {STATUS_DATA.map((entry, index) => (
                    <Cell key={index} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#1c1c1c', border: '1px solid #444' }} />
                <Legend wrapperStyle={{ fontSize: 11, color: '#888' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
