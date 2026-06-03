import type { Metadata } from 'next'
import { DM_Sans } from 'next/font/google'
import AdminSidebar from '@/components/AdminSidebar'
import './globals.css'

const dmSans = DM_Sans({ subsets: ['latin'], display: 'swap' })

export const metadata: Metadata = {
  title: { default: 'HyperFit Admin', template: '%s | HyperFit Admin' },
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={dmSans.className}>
      <body className="bg-[#0a0a0a] text-[#f8f8f8] antialiased">
        <div className="flex h-screen overflow-hidden">
          <AdminSidebar />
          <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
            {children}
          </main>
        </div>
      </body>
    </html>
  )
}
