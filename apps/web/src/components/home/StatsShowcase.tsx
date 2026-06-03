'use client'

import { motion } from 'framer-motion'

// Each stat shown as a big value + label, separated by stars, scrolling infinitely.
const STATS = [
  { value: '50K+', label: 'Designs Created' },
  { value: '200+', label: 'Styles Available' },
  { value: '4.9', label: 'Average Rating' },
  { value: '48HR', label: 'Express Dispatch' },
]

function StatItem({ value, label }: { value: string; label: string }) {
  return (
    <span className="flex items-baseline gap-3 shrink-0">
      <span className="font-display text-5xl sm:text-6xl lg:text-7xl text-[#ffffff] leading-none">{value}</span>
      <span className="text-[#ffffff]/60 text-base font-bold uppercase tracking-wider">{label}</span>
    </span>
  )
}

function Star() {
  return (
    <span className="text-[#ffffff] text-3xl sm:text-4xl leading-none shrink-0 mx-8 sm:mx-12">★</span>
  )
}

export default function StatsShowcase() {
  // One full sequence of stats with a trailing star, repeated for a seamless loop.
  const sequence = (
    <>
      {STATS.map((s) => (
        <span key={s.label} className="flex items-center shrink-0">
          <StatItem value={s.value} label={s.label} />
          <Star />
        </span>
      ))}
    </>
  )

  return (
    <section className="py-20 bg-[#c8102e] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10" style={{
        backgroundImage: 'repeating-linear-gradient(45deg, #0a0a0a 0, #0a0a0a 1px, transparent 0, transparent 50%)',
        backgroundSize: '20px 20px',
      }} />

      <div className="relative flex overflow-hidden">
        <motion.div
          className="flex items-center whitespace-nowrap"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 22, ease: 'linear', repeat: Infinity }}
        >
          {/* Two identical halves (each holding the sequence twice so it always
              spans wider than the viewport) → the -50% shift loops seamlessly.
              Each sequence is wrapped separately so React keys stay unique. */}
          <div className="flex items-center">
            <div className="flex items-center">{sequence}</div>
            <div className="flex items-center">{sequence}</div>
          </div>
          <div className="flex items-center">
            <div className="flex items-center">{sequence}</div>
            <div className="flex items-center">{sequence}</div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
