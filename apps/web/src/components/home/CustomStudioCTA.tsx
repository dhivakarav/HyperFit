'use client'

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

const StudioCardPreview = dynamic(() => import('./StudioCardPreview'), { ssr: false })

const OPTIONS = [
  { label: 'Shoes', href: '/customize/shoes', description: '8 customizable zones', type: 'shoes' as const },
  { label: 'T-Shirts', href: '/customize/tshirts', description: 'Front & back design studio', type: 'tshirt' as const },
  { label: 'Pants', href: '/customize/pants', description: 'Fit, fabric & details', type: 'pants' as const },
]

export default function CustomStudioCTA() {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  return (
    <section id="design-yours" className="relative pt-32 pb-40 overflow-hidden bg-[#ffffff] scroll-mt-24" ref={ref}>
      {/* Background grid */}
      <div className="absolute inset-0" style={{
        backgroundImage: 'linear-gradient(rgba(200,16,46,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(200,16,46,0.03) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />
      <div className="absolute inset-0 bg-gradient-to-b from-[#ffffff] via-transparent to-[#ffffff]" />

      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8 flex justify-center">
       <div className="w-full max-w-6xl flex flex-col items-center text-center">
        <motion.p
          className="w-full text-center text-[#c8102e] text-xs font-bold uppercase tracking-[0.4em] mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.5 }}
        >
          The Studio
        </motion.p>

        <motion.h2
          className="w-full text-center font-display text-6xl sm:text-7xl lg:text-8xl leading-none text-[#0a0a0a] mb-6"
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.1 }}
        >
          DESIGN YOURS
        </motion.h2>

        <motion.p
          className="w-full text-center text-[#6b6b6b] text-lg mb-4"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          AI-powered 3D customization studio. Build it. Wear it. Own it.
        </motion.p>

        <motion.p
          className="w-full text-center text-[#c8102e] text-sm font-bold uppercase tracking-[0.2em] mb-12"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Pick a product to start designing ↓
        </motion.p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 w-full max-w-6xl mx-auto">
          {OPTIONS.map(({ label, href, description, type }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.5 + i * 0.1 }}
            >
              <Link
                href={href}
                className="group relative block aspect-[3/4] overflow-hidden rounded-2xl bg-[#f4f4f4] shadow-sm hover:shadow-2xl transition-shadow duration-300"
              >
                {/* design-grid (blueprint) background */}
                <div className="absolute inset-0 opacity-[0.07]" style={{
                  backgroundImage: 'linear-gradient(#c8102e 1px, transparent 1px), linear-gradient(90deg, #c8102e 1px, transparent 1px)',
                  backgroundSize: '22px 22px',
                }} />

                {/* live auto-rotating 3D model (lazy-loaded once the section scrolls into view) */}
                <div className="absolute inset-0 pointer-events-none">
                  {inView && <StudioCardPreview type={type} />}
                </div>

                {/* Customize tag */}
                <span className="absolute top-4 left-4 z-10 bg-[#c8102e] text-white text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                  Customize
                </span>

                {/* colour-swatch design hint */}
                <div className="absolute top-4 right-4 z-10 flex flex-col gap-1.5">
                  {['#0a0a0a', '#c8102e', '#2c4bb0', '#e8d23a', '#f8f8f8'].map((c) => (
                    <span key={c} className="w-4 h-4 rounded-full border border-white/80 shadow" style={{ backgroundColor: c }} />
                  ))}
                </div>

                {/* label */}
                <div className="absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-7 text-left">
                  <p className="font-display text-4xl text-white uppercase tracking-wider leading-none">{label}</p>
                  <p className="text-white/70 text-sm mt-1.5">{description}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-white text-sm font-bold uppercase tracking-widest translate-y-1 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                    Start Designing →
                  </span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
       </div>
      </div>
    </section>
  )
}
