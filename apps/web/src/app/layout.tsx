import type { Metadata, Viewport } from 'next'
import { Bebas_Neue, DM_Sans } from 'next/font/google'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Providers } from './providers'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import CartDrawer from '@/components/CartDrawer'
import ChatWidget from '@/components/ChatWidget'
import './globals.css'

const bebasNeue = Bebas_Neue({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

export const metadata: Metadata = {
  title: { default: 'HyperFit — Performance Meets Luxury', template: '%s | HyperFit' },
  description: 'Next-generation AI-powered fashion e-commerce. Custom shoes, apparel, and accessories engineered for the streets.',
  keywords: ['fashion', 'sneakers', 'custom shoes', 'athletic wear', 'streetwear', 'HyperFit'],
  openGraph: {
    title: 'HyperFit — Performance Meets Luxury',
    description: 'Next-generation AI-powered fashion e-commerce.',
    siteName: 'HyperFit',
    type: 'website',
  },
  twitter: { card: 'summary_large_image' },
  robots: { index: true, follow: true },
  manifest: '/manifest.json',
}

// This app is request-driven (auth session, cart, live DB), so render dynamically
// instead of statically prerendering — avoids DYNAMIC_SERVER_USAGE + useSearchParams
// prerender errors during the production build.
export const dynamic = 'force-dynamic'

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Never let a session-fetch failure crash every page; fall back to no session.
  let session = null
  try {
    session = await getServerSession(authOptions)
  } catch (e) {
    console.error('getServerSession failed in RootLayout:', e)
  }

  return (
    <html lang="en" suppressHydrationWarning className={`${bebasNeue.variable} ${dmSans.variable}`}>
      <body className="bg-[#ffffff] text-[#0a0a0a] font-body antialiased">
        <Providers session={session}>
          <Navbar />
          <main>{children}</main>
          <Footer />
          <CartDrawer />
          <ChatWidget />
        </Providers>
      </body>
    </html>
  )
}
