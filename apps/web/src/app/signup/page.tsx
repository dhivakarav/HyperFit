'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button, Input } from '@hyperfit/ui'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState<'form' | 'otp'>('form')
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [devCode, setDevCode] = useState('')
  const [countdown, setCountdown] = useState(0)
  const otpRefs = useRef<(HTMLInputElement | null)[]>([])

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (!res.ok) throw new Error('Failed to send OTP')
      const data = await res.json()
      if (data.devCode) setDevCode(data.devCode)
      setStep('otp')
      startCountdown()
    } catch {
      setError('Failed to send verification code. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  function startCountdown() {
    setCountdown(30)
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(interval); return 0 }
        return c - 1
      })
    }, 1000)
  }

  function handleOtpChange(index: number, value: string) {
    if (value.length > 1) return
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)
    if (value && index < 5) otpRefs.current[index + 1]?.focus()
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus()
    }
  }

  async function handleOtpSubmit(e: React.FormEvent) {
    e.preventDefault()
    const code = otp.join('')
    if (code.length !== 6) { setError('Enter all 6 digits'); return }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code, name, password }),
      })
      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Invalid code')
      }
      await signIn('credentials', { email, password, redirect: false })
      router.push('/account')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed')
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
          <p className="text-[#6b6b6b] text-sm mt-3">
            {step === 'form' ? 'Create your account' : 'Verify your email'}
          </p>
        </div>

        {error && (
          <div className="bg-[#ff3c3c]/10 border border-[#ff3c3c]/30 text-[#ff3c3c] text-sm px-4 py-3 mb-6">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {step === 'form' ? (
            <motion.form key="form" onSubmit={handleFormSubmit} className="space-y-4" initial={{ opacity: 1 }} exit={{ opacity: 0, x: -30 }}>
              <Input label="Full Name" type="text" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Alex Carter" />
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min 8 characters" minLength={8} helper="At least 8 characters" />
              <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                Continue
              </Button>
            </motion.form>
          ) : (
            <motion.form key="otp" onSubmit={handleOtpSubmit} className="space-y-6" initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
              <p className="text-[#6b6b6b] text-sm text-center">
                We sent a 6-digit code to <span className="text-[#0a0a0a]">{email}</span>
              </p>
              {devCode && (
                <p className="text-center text-xs bg-[#fff7d6] border border-[#e8d27a] text-[#7a5c00] px-3 py-2">
                  Dev mode (no email configured) — your code is <span className="font-bold tracking-widest">{devCode}</span>
                </p>
              )}
              <div className="flex justify-center gap-3">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { otpRefs.current[i] = el }}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value.replace(/\D/g, ''))}
                    onKeyDown={(e) => handleOtpKeyDown(i, e)}
                    className="w-12 h-14 text-center text-xl font-bold bg-[#f2f2f2] border border-[#d8d8d8] text-[#0a0a0a] outline-none focus:border-[#c8102e] transition-colors"
                  />
                ))}
              </div>
              <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
                Verify & Create Account
              </Button>
              <p className="text-center text-sm text-[#6b6b6b]">
                {countdown > 0 ? (
                  <>Resend in <span className="text-[#0a0a0a]">{countdown}s</span></>
                ) : (
                  <button type="button" onClick={() => { handleFormSubmit(new Event('') as unknown as React.FormEvent); startCountdown() }} className="text-[#c8102e] hover:underline">
                    Resend code
                  </button>
                )}
              </p>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="text-center text-[#6b6b6b] text-sm mt-8">
          Already have an account?{' '}
          <Link href="/login" className="text-[#c8102e] hover:underline font-medium">Sign in</Link>
        </p>
      </motion.div>
    </div>
  )
}
