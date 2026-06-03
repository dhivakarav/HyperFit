'use client'

import { useRef, useEffect } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { ArrowDown } from 'lucide-react'
import { Button } from '@hyperfit/ui'

const HEADLINE_WORDS = ['PERFORM', 'WITHOUT', 'LIMITS']

export default function HeroSection() {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.play().catch(() => {})
    }
  }, [])

  return (
    <section className="relative h-screen w-full overflow-hidden flex items-center justify-center">
      {/* Background video — looped early (at 8s of 10s) so it never reaches the
          "HyperFit" end card, and brightened a touch. */}
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover brightness-125"
        onTimeUpdate={(e) => { if (e.currentTarget.currentTime >= 8) e.currentTarget.currentTime = 0 }}
      >
        <source src="/video/hero.mp4" type="video/mp4" />
      </video>

      {/* Readability + blend overlays (light wash so the dark headline stays legible,
          and a fade to white at the bottom so it merges into the white page) */}
      <div className="absolute inset-0 bg-white/20" />
      <div className="absolute inset-0 bg-gradient-to-b from-white/30 via-transparent to-[#ffffff]" />

      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: 'linear-gradient(#c8102e 1px, transparent 1px), linear-gradient(90deg, #c8102e 1px, transparent 1px)',
        backgroundSize: '80px 80px',
      }} />

      {/* Content */}
      <div className="relative z-10 w-full px-4 max-w-6xl mx-auto flex flex-col items-center text-center">
        <motion.p
          className="w-full text-center text-[#c8102e] text-xs sm:text-sm font-bold uppercase tracking-[0.4em] mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          New Season 2026
        </motion.p>

        <div className="w-full overflow-hidden">
          {HEADLINE_WORDS.map((word, i) => (
            <motion.div
              key={word}
              className="w-full overflow-hidden"
              initial={{ clipPath: 'inset(0 0 100% 0)' }}
              animate={{ clipPath: 'inset(0 0 0% 0)' }}
              transition={{ duration: 0.7, delay: 0.3 + i * 0.12, ease: [0.76, 0, 0.24, 1] }}
            >
              <h1
                className="w-full text-center font-display text-7xl sm:text-8xl lg:text-9xl leading-none tracking-tight"
                style={{ color: i === 1 ? '#c8102e' : '#0a0a0a' }}
              >
                {word}
              </h1>
            </motion.div>
          ))}
        </div>

        <motion.div
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.1 }}
        >
          <Link href="/shop">
            <Button variant="primary" size="lg" className="min-w-[180px]">
              Shop Now
            </Button>
          </Link>
          <a href="#design-yours">
            <Button variant="ghost" size="lg" className="min-w-[180px]">
              Customize Yours
            </Button>
          </a>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <span className="text-[#6b6b6b] text-[10px] uppercase tracking-[0.3em]">Scroll</span>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
          <ArrowDown size={16} className="text-[#6b6b6b]" />
        </motion.div>
      </motion.div>
    </section>
  )
}
