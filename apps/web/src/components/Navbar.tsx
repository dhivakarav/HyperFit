'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, ShoppingBag, User, Menu, X, ChevronDown, LogOut, Package, Heart, Palette } from 'lucide-react'
import { useCartStore } from '@/store/cartStore'

const NAV_LINKS = [
  { label: 'Men', href: '/shop/men', sub: ['Shoes', 'T-Shirts', 'Pants'] },
  { label: 'Women', href: '/shop/women', sub: ['Shoes', 'Tops', 'Bottoms'] },
  { label: 'Shoes', href: '/shop/shoes' },
  { label: 'Clothing', href: '/shop/clothing' },
  { label: 'Custom', href: '/customize/shoes', highlight: true },
  { label: 'Sale', href: '/shop?sort=sale', sale: true },
]

// Map a sub-item label to a product type for filtering.
function subType(sub: string): string {
  const s = sub.toLowerCase()
  if (s.includes('shoe')) return 'SHOES'
  if (s.includes('pant') || s.includes('bottom')) return 'PANTS'
  return 'TSHIRT' // T-Shirts, Tops
}

// Build a gender + type filtered link, e.g. Men > T-Shirts -> /shop/men?type=TSHIRT
function subHref(parentHref: string, sub: string): string {
  return `${parentHref}?type=${subType(sub)}`
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileOpen, setProfileOpen] = useState(false)
  const [megaMenu, setMegaMenu] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const searchRef = useRef<HTMLInputElement>(null)
  const pathname = usePathname()
  // Transparent only over the homepage hero; solid everywhere else (and once scrolled).
  const isHome = pathname === '/'
  const solid = scrolled || !isHome

  const [mounted, setMounted] = useState(false)
  const { data: session } = useSession()
  const { totalItems, toggleCart } = useCartStore()
  // Guard against hydration mismatch: the cart is persisted in localStorage,
  // so it's empty on the server but populated on the client. Only read it after mount.
  const itemCount = mounted ? totalItems() : 0

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  useEffect(() => {
    if (mobileMenuOpen) document.body.style.overflow = 'hidden'
    else document.body.style.overflow = ''
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  return (
    <>
      <nav
        className={`fixed top-0 inset-x-0 z-40 transition-all duration-300 ${
          solid ? 'bg-[#ffffff] border-b border-[#f2f2f2]' : 'bg-transparent'
        }`}
      >
        <div className="w-full px-4 md:px-8 lg:px-12">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Logo */}
            <Link href="/" className="flex items-center shrink-0 ml-4 md:ml-8 lg:ml-12">
              <svg width="172" height="40" viewBox="0 0 172 40" fill="none" xmlns="http://www.w3.org/2000/svg">
                <text x="0" y="33" fontFamily="'Bebas Neue', sans-serif" fontSize="40" fill="#0a0a0a" letterSpacing="3">HYPER</text>
                <text x="100" y="33" fontFamily="'Bebas Neue', sans-serif" fontSize="40" fill="#c8102e" letterSpacing="3">FIT</text>
              </svg>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center justify-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.label}
                  className="relative"
                  onMouseEnter={() => link.sub && setMegaMenu(link.label)}
                  onMouseLeave={() => setMegaMenu(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium uppercase tracking-wider transition-colors duration-150 ${
                      link.sale ? 'text-[#ff3c3c]' : link.highlight ? 'text-[#c8102e]' : 'text-[#6b6b6b] hover:text-[#0a0a0a]'
                    }`}
                  >
                    {link.label}
                    {link.sub && <ChevronDown size={12} />}
                  </Link>

                  {link.sub && megaMenu === link.label && (
                    <AnimatePresence>
                      <motion.div
                        className="absolute top-full left-0 mt-1 bg-[#f2f2f2] border border-[#d8d8d8] min-w-[160px] py-2 shadow-xl"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -8 }}
                        transition={{ duration: 0.15 }}
                      >
                        {link.sub.map((sub) => (
                          <Link
                            key={sub}
                            href={subHref(link.href, sub)}
                            className="block px-4 py-2 text-sm text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#e8e8e8] transition-colors"
                          >
                            {sub}
                          </Link>
                        ))}
                      </motion.div>
                    </AnimatePresence>
                  )}
                </div>
              ))}
            </div>

            {/* Right actions */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Search */}
              <AnimatePresence>
                {searchOpen ? (
                  <motion.div
                    className="absolute inset-x-0 top-0 z-50 bg-[#ffffff] border-b border-[#f2f2f2] flex items-center h-16 lg:h-20 px-6 gap-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    <Search size={20} className="text-[#6b6b6b] shrink-0" />
                    <input
                      ref={searchRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products, styles, categories..."
                      className="flex-1 bg-transparent text-[#0a0a0a] placeholder:text-[#d8d8d8] outline-none text-base"
                      onKeyDown={(e) => {
                        if (e.key === 'Escape') { setSearchOpen(false); setSearchQuery('') }
                        if (e.key === 'Enter' && searchQuery) {
                          window.location.href = `/shop?search=${encodeURIComponent(searchQuery)}`
                        }
                      }}
                    />
                    <button onClick={() => { setSearchOpen(false); setSearchQuery('') }} className="p-2 text-[#6b6b6b] hover:text-[#0a0a0a]">
                      <X size={20} />
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>

              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors hidden sm:flex"
                aria-label="Search"
              >
                <Search size={26} />
              </button>

              {/* Cart */}
              <button
                onClick={toggleCart}
                className="relative p-2.5 text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
                aria-label="Cart"
              >
                <ShoppingBag size={26} />
                {itemCount > 0 && (
                  <motion.span
                    key={itemCount}
                    className="absolute top-0.5 right-0.5 w-5 h-5 bg-[#c8102e] text-[#ffffff] text-[11px] font-bold rounded-full flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                  >
                    {itemCount > 99 ? '99+' : itemCount}
                  </motion.span>
                )}
              </button>

              {/* Profile */}
              <div className="relative hidden sm:block">
                <button
                  onClick={() => setProfileOpen((p) => !p)}
                  className="p-2.5 text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors"
                  aria-label="Account"
                >
                  {session?.user?.image ? (
                    <img src={session.user.image} alt="avatar" className="w-8 h-8 rounded-full object-cover" />
                  ) : (
                    <User size={26} />
                  )}
                </button>

                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      className="absolute right-0 top-full mt-2 w-72 bg-[#f2f2f2] border border-[#d8d8d8] shadow-xl py-2"
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      onMouseLeave={() => setProfileOpen(false)}
                    >
                      {session ? (
                        <>
                          <div className="px-4 py-3 border-b border-[#d8d8d8]">
                            <p className="text-lg font-extrabold text-[#0a0a0a] truncate">{session.user?.name}</p>
                            <p className="text-sm text-[#6b6b6b] truncate">{session.user?.email}</p>
                          </div>
                          <Link href="/account" className="flex items-center gap-3 px-4 py-3.5 text-lg font-bold text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#e8e8e8]" onClick={() => setProfileOpen(false)}>
                            <User size={20} />My Account
                          </Link>
                          <Link href="/account/orders" className="flex items-center gap-3 px-4 py-3.5 text-lg font-bold text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#e8e8e8]" onClick={() => setProfileOpen(false)}>
                            <Package size={20} />Orders
                          </Link>
                          <Link href="/account/designs" className="flex items-center gap-3 px-4 py-3.5 text-lg font-bold text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#e8e8e8]" onClick={() => setProfileOpen(false)}>
                            <Palette size={20} />My Designs
                          </Link>
                          <div className="border-t border-[#d8d8d8] mt-1 pt-1">
                            <button
                              onClick={() => { signOut(); setProfileOpen(false) }}
                              className="flex items-center gap-3 w-full px-4 py-3.5 text-lg font-bold text-[#ff3c3c] hover:bg-[#e8e8e8]"
                            >
                              <LogOut size={20} />Sign Out
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <Link href="/login" className="flex items-center gap-3 px-4 py-3.5 text-lg font-bold text-[#6b6b6b] hover:text-[#0a0a0a] hover:bg-[#e8e8e8]" onClick={() => setProfileOpen(false)}>
                            Sign In
                          </Link>
                          <Link href="/signup" className="flex items-center gap-3 px-4 py-3.5 text-lg text-[#c8102e] hover:bg-[#e8e8e8] font-bold" onClick={() => setProfileOpen(false)}>
                            Create Account
                          </Link>
                        </>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile hamburger */}
              <button
                onClick={() => setMobileMenuOpen((p) => !p)}
                className="p-2 text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors lg:hidden"
                aria-label="Menu"
              >
                {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile full-screen menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="fixed inset-0 z-30 bg-[#ffffff] flex flex-col pt-20 px-6 pb-8 overflow-y-auto lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {NAV_LINKS.map((link, i) => (
              <motion.div
                key={link.label}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block py-4 text-3xl font-display uppercase border-b border-[#f2f2f2] transition-colors ${
                    link.sale ? 'text-[#ff3c3c]' : link.highlight ? 'text-[#c8102e]' : 'text-[#0a0a0a]'
                  }`}
                >
                  {link.label}
                </Link>
              </motion.div>
            ))}

            <div className="mt-8 flex flex-col gap-3">
              {session ? (
                <>
                  <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 text-[#6b6b6b] py-3">
                    <User size={18} /> My Account
                  </Link>
                  <button onClick={() => { signOut(); setMobileMenuOpen(false) }} className="flex items-center gap-3 text-[#ff3c3c] py-3">
                    <LogOut size={18} /> Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-center border border-[#d8d8d8] text-[#0a0a0a] font-medium uppercase tracking-wider">
                    Sign In
                  </Link>
                  <Link href="/signup" onClick={() => setMobileMenuOpen(false)} className="block py-3 text-center bg-[#c8102e] text-[#ffffff] font-bold uppercase tracking-wider">
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
