'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, Package, Boxes, ShoppingCart, Palette, Users, Tag, Image, TrendingUp, ChevronLeft, ChevronRight, LogOut
} from 'lucide-react'

const NAV = [
  { label: 'Overview', href: '/admin', icon: LayoutDashboard },
  { label: 'Products', href: '/admin/products', icon: Package },
  { label: 'Inventory', href: '/admin/inventory', icon: Boxes },
  { label: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { label: 'Designs', href: '/admin/designs', icon: Palette },
  { label: 'Users', href: '/admin/users', icon: Users },
  { label: 'Coupons', href: '/admin/coupons', icon: Tag },
  { label: 'Banners', href: '/admin/banners', icon: Image },
  { label: 'Analytics', href: '/admin/analytics', icon: TrendingUp },
]

export default function AdminSidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const pathname = usePathname()

  return (
    <aside className={`${collapsed ? 'w-16' : 'w-60'} transition-all duration-200 bg-[#0a0a0a] border-r border-[#1c1c1c] flex flex-col shrink-0`}>
      {/* Logo */}
      <div className={`flex items-center h-16 border-b border-[#1c1c1c] px-4 ${collapsed ? 'justify-center' : 'justify-between'}`}>
        {!collapsed && (
          <span className="font-bold text-sm uppercase tracking-widest">
            <span className="text-[#f8f8f8]">HYPER</span><span className="text-[#e8ff47]">FIT</span>
          </span>
        )}
        <button
          onClick={() => setCollapsed((p) => !p)}
          className="p-1.5 text-[#888888] hover:text-[#f8f8f8] transition-colors"
        >
          {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const active = pathname === href || (href !== '/admin' && pathname.startsWith(href))
          return (
            <Link
              key={href}
              href={href}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium transition-all ${
                active ? 'bg-[#e8ff47] text-[#0a0a0a]' : 'text-[#888888] hover:text-[#f8f8f8] hover:bg-[#1c1c1c]'
              } ${collapsed ? 'justify-center' : ''}`}
            >
              <Icon size={18} className="shrink-0" />
              {!collapsed && <span className="uppercase tracking-wider text-xs font-bold">{label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={`border-t border-[#1c1c1c] p-4 ${collapsed ? 'flex justify-center' : ''}`}>
        {!collapsed && (
          <div className="mb-3">
            <p className="text-xs font-medium text-[#f8f8f8] truncate">Admin</p>
            <p className="text-xs text-[#888888]">admin@hyperfit.com</p>
          </div>
        )}
        <Link
          href="/api/auth/signout"
          className={`flex items-center gap-2 text-[#888888] hover:text-[#ff3c3c] transition-colors text-xs ${collapsed ? 'justify-center' : ''}`}
          title={collapsed ? 'Sign Out' : undefined}
        >
          <LogOut size={16} />
          {!collapsed && 'Sign Out'}
        </Link>
      </div>
    </aside>
  )
}
