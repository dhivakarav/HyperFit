import type { Metadata } from 'next'
import TShirtCustomizer from './TShirtCustomizer'

export const metadata: Metadata = { title: 'T-Shirt Studio — Design Your Own' }

export default function TShirtPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20 bg-[#ffffff]">
      <TShirtCustomizer />
    </div>
  )
}
