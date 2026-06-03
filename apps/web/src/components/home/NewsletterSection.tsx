'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button } from '@hyperfit/ui'

export default function NewsletterSection() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSubmitted(true)
    } catch {
      // silent fail
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="py-32 mt-8 border-t border-[#f2f2f2]">
      <div className="w-full px-4 sm:px-6 lg:px-8 flex justify-center">
        <div className="w-full max-w-xl text-center flex flex-col items-center">
          <p className="text-[#c8102e] text-xs font-bold uppercase tracking-[0.3em] mb-3">Stay in the loop</p>
          <h2 className="font-display text-5xl text-[#0a0a0a] mb-4">FIRST TO KNOW</h2>
          <p className="text-[#6b6b6b] mb-10">New drops, exclusive offers, and behind-the-scenes access. No spam, ever.</p>

          <AnimatePresence mode="wait">
            {submitted ? (
              <motion.div
                key="success"
                className="flex flex-col items-center gap-3"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', stiffness: 400, damping: 25 }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20, delay: 0.1 }}
                >
                  <CheckCircle size={40} className="text-[#c8102e]" />
                </motion.div>
                <p className="text-[#0a0a0a] font-medium">You're on the list! Welcome to HyperFit.</p>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className="flex flex-col sm:flex-row gap-3 w-full"
                onSubmit={handleSubmit}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="flex-1 h-12 bg-[#f2f2f2] border border-[#d8d8d8] text-[#0a0a0a] px-4 text-sm placeholder:text-[#d8d8d8] outline-none focus:border-[#c8102e] transition-colors"
                />
                <Button type="submit" variant="primary" size="md" loading={loading} className="shrink-0">
                  Subscribe
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  )
}
