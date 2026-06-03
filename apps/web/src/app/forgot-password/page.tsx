'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle } from 'lucide-react'
import { Button, Input } from '@hyperfit/ui'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#ffffff]">
      <motion.div className="w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-10">
          <Link href="/">
            <svg width="140" height="32" viewBox="0 0 140 32" className="mx-auto">
              <text x="0" y="28" fontFamily="'Bebas Neue', sans-serif" fontSize="32" fill="#0a0a0a" letterSpacing="2">HYPER</text>
              <text x="82" y="28" fontFamily="'Bebas Neue', sans-serif" fontSize="32" fill="#c8102e" letterSpacing="2">FIT</text>
            </svg>
          </Link>
          <p className="text-[#6b6b6b] text-sm mt-3">Reset your password</p>
        </div>

        <AnimatePresence mode="wait">
          {sent ? (
            <motion.div key="success" className="text-center space-y-4" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
              <CheckCircle size={48} className="text-[#c8102e] mx-auto" />
              <h2 className="text-[#0a0a0a] font-bold text-lg">Check your email</h2>
              <p className="text-[#6b6b6b] text-sm">We've sent a reset link to <span className="text-[#0a0a0a]">{email}</span>. Check your inbox.</p>
              <Link href="/login">
                <Button variant="ghost" size="md" className="mt-4">Back to Sign In</Button>
              </Link>
            </motion.div>
          ) : (
            <motion.form key="form" onSubmit={handleSubmit} className="space-y-4" exit={{ opacity: 0 }}>
              <p className="text-[#6b6b6b] text-sm mb-6">Enter your email address and we'll send you a link to reset your password.</p>
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
              <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                Send Reset Link
              </Button>
              <Link href="/login" className="block text-center text-sm text-[#6b6b6b] hover:text-[#0a0a0a] transition-colors mt-4">
                Back to Sign In
              </Link>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
