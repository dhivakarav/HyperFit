'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { Package, Palette, MapPin, Bell, User, ChevronRight } from 'lucide-react'

interface AccountDashboardProps {
  user: {
    id: string; name: string; email: string; avatar?: string | null; phone?: string | null; role: string
    addresses: Array<{ id: string; label: string; line1: string; city: string; isDefault: boolean }>
  }
}

const MENU = [
  { label: 'My Orders', description: 'Track and manage orders', href: '/account/orders', icon: Package },
  { label: 'My Designs', description: 'Saved custom creations', href: '/account/designs', icon: Palette },
  { label: 'Addresses', description: 'Manage shipping addresses', href: '/account/addresses', icon: MapPin },
  { label: 'Notifications', description: 'Email and push preferences', href: '/account/notifications', icon: Bell },
]

export default function AccountDashboard({ user }: AccountDashboardProps) {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-5 mb-12">
          <div className="w-20 h-20 rounded-full bg-[#f2f2f2] border-2 border-[#c8102e] overflow-hidden shrink-0">
            {user.avatar ? (
              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User size={32} className="text-[#6b6b6b]" />
              </div>
            )}
          </div>
          <div>
            <h1 className="font-display text-4xl text-[#0a0a0a]">{user.name.toUpperCase()}</h1>
            <p className="text-[#6b6b6b] text-sm">{user.email}</p>
            {user.role === 'ADMIN' && (
              <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider bg-[#c8102e] text-[#ffffff] px-2 py-0.5">
                Admin
              </span>
            )}
          </div>
        </div>

        {/* Menu grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {MENU.map(({ label, description, href, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Link
                href={href}
                className="group flex items-center gap-4 p-6 bg-[#f2f2f2] border border-[#e8e8e8] hover:border-[#c8102e] transition-colors"
              >
                <div className="w-12 h-12 bg-[#ffffff] flex items-center justify-center group-hover:bg-[#c8102e] transition-colors">
                  <Icon size={20} className="text-[#6b6b6b] group-hover:text-[#ffffff] transition-colors" />
                </div>
                <div className="flex-1">
                  <p className="font-extrabold text-xl uppercase tracking-wider text-[#0a0a0a]">{label}</p>
                  <p className="text-[#6b6b6b] text-sm mt-1">{description}</p>
                </div>
                <ChevronRight size={16} className="text-[#d8d8d8] group-hover:text-[#c8102e] transition-colors" />
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Default address */}
        {user.addresses.filter((a) => a.isDefault)[0] && (
          <div className="mt-8 p-6 bg-[#f2f2f2] border border-[#e8e8e8]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#6b6b6b] mb-3">Default Address</p>
            {(() => {
              const addr = user.addresses.find((a) => a.isDefault)!
              return (
                <p className="text-[#0a0a0a] text-sm">{addr.line1}, {addr.city}</p>
              )
            })()}
          </div>
        )}

        {user.role === 'ADMIN' && (
          <div className="mt-6">
            <Link
              href="/admin"
              className="flex items-center justify-center gap-2 w-full p-4 border border-[#c8102e] text-[#c8102e] font-bold uppercase tracking-wider hover:bg-[#c8102e] hover:text-[#ffffff] transition-colors"
            >
              Admin Dashboard →
            </Link>
          </div>
        )}
      </div>
    </div>
  )
}
