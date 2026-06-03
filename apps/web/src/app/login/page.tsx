'use client'

import { useState } from 'react'
import Link from 'next/link'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Button, Input } from '@hyperfit/ui'

export default function LoginPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const errorParam = searchParams.get('error')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
      })
      if (result?.error) {
        setError('Invalid email or password')
      } else {
        router.push('/account')
        router.refresh()
      }
    } finally {
      setLoading(false)
    }
  }

  async function handleGoogle() {
    await signIn('google', { callbackUrl: '/account' })
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-[#ffffff]">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Logo */}
        <div className="text-center mb-10">
          <Link href="/">
            <svg width="140" height="32" viewBox="0 0 140 32" className="mx-auto">
              <text x="0" y="28" fontFamily="'Bebas Neue', sans-serif" fontSize="32" fill="#0a0a0a" letterSpacing="2">HYPER</text>
              <text x="82" y="28" fontFamily="'Bebas Neue', sans-serif" fontSize="32" fill="#c8102e" letterSpacing="2">FIT</text>
            </svg>
          </Link>
          <p className="text-[#6b6b6b] text-sm mt-3">Sign in to your account</p>
        </div>

        {(error || errorParam) && (
          <div className="bg-[#ff3c3c]/10 border border-[#ff3c3c]/30 text-[#ff3c3c] text-sm px-4 py-3 mb-6">
            {error || (errorParam === 'unauthorized' ? 'You do not have permission to access that page.' : 'Authentication error. Please try again.')}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
          <Input
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-xs text-[#6b6b6b] hover:text-[#c8102e] transition-colors">
              Forgot password?
            </Link>
          </div>
          <Button type="submit" variant="primary" size="lg" className="w-full" loading={loading}>
            Sign In
          </Button>
        </form>

        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-[#f2f2f2]" />
          <span className="text-[#d8d8d8] text-xs uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-[#f2f2f2]" />
        </div>

        <button
          onClick={handleGoogle}
          className="w-full flex items-center justify-center gap-3 border border-[#d8d8d8] h-12 text-sm text-[#0a0a0a] hover:border-[#0a0a0a] transition-colors"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <p className="text-center text-[#6b6b6b] text-sm mt-8">
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="text-[#c8102e] hover:underline font-medium">
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
