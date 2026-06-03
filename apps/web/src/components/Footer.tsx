import Link from 'next/link'
import { MapPin, Mail, Clock } from 'lucide-react'

const SHOP = [
  { label: 'Home', href: '/' },
  { label: 'Men', href: '/shop/men' },
  { label: 'Women', href: '/shop/women' },
  { label: 'Shoes', href: '/shop/shoes' },
  { label: 'Clothing', href: '/shop/clothing' },
  { label: 'Custom Studio', href: '/customize/shoes' },
]

const QUICK = [
  { label: 'Contact Us', href: '/contact' },
  { label: 'Size Guide', href: '/size-guide' },
  { label: 'Shipping', href: '/shipping' },
  { label: 'Returns & Exchange', href: '/returns' },
  { label: 'Track Order', href: '/account/orders' },
  { label: 'Our Story', href: '/about' },
]


export default function Footer() {
  return (
    <>
      {/* Dark premium footer */}
      <footer className="bg-[#0a0a0a] text-[#f8f8f8] w-full mt-24 pt-20 pb-10">
        <div className="flex justify-center">
        <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-12">
            {/* Brand */}
            <div>
              <Link href="/" className="inline-block mb-5">
                <svg width="150" height="34" viewBox="0 0 150 34" fill="none">
                  <text x="0" y="28" fontFamily="'Bebas Neue', sans-serif" fontSize="34" fill="#f8f8f8" letterSpacing="2">HYPER</text>
                  <text x="92" y="28" fontFamily="'Bebas Neue', sans-serif" fontSize="34" fill="#c8102e" letterSpacing="2">FIT</text>
                </svg>
              </Link>
              <p className="text-[#9a9a9a] text-sm leading-relaxed mb-6 max-w-xs">
                HyperFit blends performance and luxury — AI-powered custom footwear and apparel,
                engineered for the streets and designed for the future. Premium quality, made to move.
              </p>
              <div className="flex gap-3">
                {['Instagram', 'Twitter', 'YouTube', 'TikTok'].map((s) => (
                  <a
                    key={s}
                    href={`https://${s.toLowerCase()}.com/hyperfit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[11px] uppercase tracking-wider font-medium text-[#9a9a9a] hover:text-[#c8102e] transition-colors"
                  >
                    {s}
                  </a>
                ))}
              </div>
            </div>

            {/* Shop */}
            <div>
              <h3 className="text-[#c8102e] text-sm font-bold uppercase tracking-widest mb-5">Shop</h3>
              <ul className="flex flex-col gap-3">
                {SHOP.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[#bcbcbc] text-sm hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Quick links */}
            <div>
              <h3 className="text-[#c8102e] text-sm font-bold uppercase tracking-widest mb-5">Quick Links</h3>
              <ul className="flex flex-col gap-3">
                {QUICK.map((l) => (
                  <li key={l.label}>
                    <Link href={l.href} className="text-[#bcbcbc] text-sm hover:text-white transition-colors">{l.label}</Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Information */}
            <div>
              <h3 className="text-[#c8102e] text-sm font-bold uppercase tracking-widest mb-5">Information</h3>
              <ul className="flex flex-col gap-4 text-sm text-[#bcbcbc]">
                <li className="flex gap-3">
                  <MapPin size={18} className="text-[#c8102e] shrink-0 mt-0.5" />
                  <span>123 Fashion Street, T. Nagar, Chennai, Tamil Nadu — 600017</span>
                </li>
                <li className="flex gap-3 items-center">
                  <Mail size={18} className="text-[#c8102e] shrink-0" />
                  <span>support@hyperfit.com</span>
                </li>
                <li className="flex gap-3">
                  <Clock size={18} className="text-[#c8102e] shrink-0 mt-0.5" />
                  <span>Mon–Sat: 10:00 AM – 7:00 PM · Sunday holiday</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6 pt-10 border-t border-[#1c1c1c]">
            <p className="text-[#7a7a7a] text-xs">© {new Date().getFullYear()} HyperFit. All rights reserved.</p>
            <div className="flex items-center gap-3">
              <span className="text-[#5a5a5a] text-xs">We accept:</span>
              {['Visa', 'Mastercard', 'UPI', 'RuPay', 'GPay'].map((p) => (
                <span key={p} className="text-[11px] font-medium text-[#bcbcbc] border border-[#2a2a2a] rounded px-2 py-0.5">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
        </div>
      </footer>
    </>
  )
}
