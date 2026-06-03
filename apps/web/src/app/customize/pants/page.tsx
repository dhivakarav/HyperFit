import type { Metadata } from 'next'
import PantsCustomizer from './PantsCustomizer'

export const metadata: Metadata = { title: 'Pants Designer — Customize Your Fit' }

export default function PantsPage() {
  return (
    <div className="min-h-screen pt-16 lg:pt-20 bg-[#ffffff]">
      <PantsCustomizer />
    </div>
  )
}
