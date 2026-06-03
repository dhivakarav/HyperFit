'use client'

import { motion } from 'framer-motion'

interface Review {
  name: string
  rating: number
  quote: string
}

const REVIEWS: Review[] = [
  { name: 'Rahul Mehta', rating: 5, quote: 'Designed my own shoes in the 3D customizer — the result was exactly what I imagined. Premium quality and fast delivery.' },
  { name: 'Ananya Reddy', rating: 4, quote: 'Love the oversized t-shirts. The fabric quality is exceptional and the fit is perfect. Already ordered three more.' },
  { name: 'Karthik Nair', rating: 5, quote: 'HyperFit is the future of athleisure. The custom cargo pants are incredibly well-made. 10/10 experience.' },
  { name: 'Sneha Patel', rating: 5, quote: 'The attention to detail is insane — from the packaging to the product itself, everything screams premium.' },
  { name: 'Arjun Verma', rating: 5, quote: 'Ordered a fully custom pair for my brother. He hasn’t stopped wearing them. The build quality is unreal.' },
  { name: 'Priya Sharma', rating: 4, quote: 'Smooth checkout, quick dispatch, and the fit guide was spot on. My new go-to for statement pieces.' },
]

function Stars({ rating }: { rating: number }) {
  return (
    <div className="flex gap-0.5 mb-4">
      {Array.from({ length: 5 }).map((_, i) => (
        <span key={i} className={i < rating ? 'text-[#c8102e]' : 'text-[#e0e0e0]'}>★</span>
      ))}
    </div>
  )
}

function Card({ r }: { r: Review }) {
  return (
    <div className="shrink-0 w-80 bg-[#f7f7f7] border border-[#ececec] rounded-2xl p-7 flex flex-col">
      <Stars rating={r.rating} />
      <p className="text-[#2a2a2a] text-[15px] leading-relaxed flex-1">&ldquo;{r.quote}&rdquo;</p>
      <div className="mt-6">
        <p className="font-bold text-[#0a0a0a]">{r.name}</p>
        <p className="flex items-center gap-1.5 text-[#c8102e] text-xs font-medium mt-1">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0">
            <path d="M20 6L9 17l-5-5" stroke="#c8102e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Verified Buyer
        </p>
      </div>
    </div>
  )
}

export default function Testimonials() {
  return (
    <section className="py-20 bg-[#ffffff] overflow-hidden">
      <div className="flex justify-center mb-10">
        <div className="w-full max-w-7xl px-4 md:px-6 lg:px-8">
          <p className="text-[#c8102e] text-xs font-bold uppercase tracking-[0.3em] mb-2">Reviews</p>
          <h2 className="font-display text-5xl sm:text-6xl text-[#0a0a0a]">WHAT THEY SAY</h2>
        </div>
      </div>

      {/* Slow auto-scrolling marquee. Two identical halves → seamless -50% loop. */}
      <div className="overflow-hidden">
        <motion.div
          className="flex gap-5 w-max px-4"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 55, ease: 'linear', repeat: Infinity }}
        >
          {[...REVIEWS, ...REVIEWS].map((r, i) => (
            <Card key={`${r.name}-${i}`} r={r} />
          ))}
        </motion.div>
      </div>
    </section>
  )
}
