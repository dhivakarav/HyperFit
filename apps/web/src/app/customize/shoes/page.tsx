import type { Metadata } from 'next'
import ShoeCustomizer from './ShoeCustomizer'

export const metadata: Metadata = { title: 'Shoe Customizer — Build Your Own' }

export default function ShoeCustomizerPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20 bg-[#ffffff]">
      <ShoeCustomizer />
    </div>
  )
}
