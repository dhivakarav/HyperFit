'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { ShoppingBag, Save } from 'lucide-react'
import { Button } from '@hyperfit/ui'
import { useCartStore } from '@/store/cartStore'
import { snapshotCanvas } from '@/lib/canvasSnapshot'
import { useToast } from '@hyperfit/ui'

const PantsViewer = dynamic(() => import('@/components/three/PantsViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#f4f4f4] flex items-center justify-center text-[#6b6b6b]">Loading 3D viewer...</div>,
})

function OptionGroup({ label, options, value, onChange }: { label: string; options: string[]; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <p className="text-[#6b6b6b] text-sm font-bold uppercase tracking-wider mb-2">{label}</p>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`px-4 py-2.5 text-sm font-bold uppercase tracking-wider border transition-colors ${
              value === opt ? 'border-[#c8102e] bg-[#c8102e] text-[#ffffff]' : 'border-[#d8d8d8] text-[#6b6b6b] hover:border-[#c8102e] hover:text-[#c8102e]'
            }`}
          >
            {opt}
          </button>
        ))}
      </div>
    </div>
  )
}

export default function PantsCustomizer() {
  const [fit, setFit] = useState('Slim')
  const [art, setArt] = useState('None')
  const [fabric, setFabric] = useState('Cotton Twill')
  const [primaryColor, setPrimaryColor] = useState('#f8f8f8')
  const [size, setSize] = useState('M')

  const BASE_PRICE = 3999
  const addOns =
    (fabric === 'Denim' ? 300 : fabric === 'Linen' ? 150 : 0) +
    (fit === 'Wide-Leg' ? 200 : 0) +
    (art !== 'None' ? 250 : 0)
  const customizedCount =
    (fabric === 'Denim' || fabric === 'Linen' ? 1 : 0) +
    (fit === 'Wide-Leg' ? 1 : 0) +
    (art !== 'None' ? 1 : 0)
  const totalPrice = BASE_PRICE + addOns

  const { addItem, openCart } = useCartStore()
  const { toast } = useToast()

  function addToCart() {
    const image = snapshotCanvas()
    addItem({
      id: `custom-pants-${Date.now()}`,
      productId: 'custom-pants',
      name: `Custom ${fit} Pants`,
      price: totalPrice,
      quantity: 1,
      size,
      isCustom: true,
      image,
    })
    openCart()
    toast('Custom pants added to cart!', 'success')
  }

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-80px)]">
      {/* Controls */}
      <div className="w-full lg:w-[40%] lg:overflow-y-auto bg-[#ffffff] border-r border-[#f2f2f2] flex flex-col">
        <div className="p-8 border-b border-[#f2f2f2]">
          <h1 className="font-display text-6xl text-[#0a0a0a]">PANTS DESIGNER</h1>
          <p className="text-[#6b6b6b] text-lg mt-2">Every detail, your way.</p>
        </div>

        <div className="lg:flex-1 lg:overflow-y-auto p-8 space-y-7">
          <OptionGroup label="Fit" options={['Slim', 'Regular', 'Wide-Leg']} value={fit} onChange={setFit} />
          <OptionGroup label="Art" options={['None', 'Floral', 'Camo', 'Geometric']} value={art} onChange={setArt} />
          <OptionGroup label="Fabric" options={['Cotton Twill', 'Denim', 'Polyester', 'Linen']} value={fabric} onChange={setFabric} />

          <div>
            <p className="text-[#6b6b6b] text-sm font-bold uppercase tracking-wider mb-2">Primary Color</p>
            <div className="flex items-center gap-2 max-w-xs">
              <input type="color" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="w-10 h-10 cursor-pointer bg-transparent border-0 p-0" />
              <input type="text" value={primaryColor} onChange={(e) => setPrimaryColor(e.target.value)} className="flex-1 h-10 bg-[#f2f2f2] border border-[#d8d8d8] text-[#0a0a0a] text-xs px-2 outline-none font-mono" />
            </div>
          </div>

          <div>
            <p className="text-[#6b6b6b] text-sm font-bold uppercase tracking-wider mb-2">Size</p>
            <div className="flex flex-wrap gap-2">
              {['S', 'M', 'L', 'XL', 'XXL'].map((s) => (
                <button
                  key={s}
                  onClick={() => setSize(s)}
                  className={`min-w-[56px] px-4 py-2.5 text-base font-bold border transition-colors ${
                    size === s ? 'border-[#c8102e] bg-[#c8102e] text-[#ffffff]' : 'border-[#d8d8d8] text-[#0a0a0a] hover:border-[#c8102e] hover:text-[#c8102e]'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

        </div>

        <div className="p-8 border-t border-[#f2f2f2]">
          <div className="flex items-center justify-between text-sm text-[#6b6b6b] mb-1">
            <span>Base price</span>
            <span>₹{BASE_PRICE.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between text-sm text-[#6b6b6b] mb-3">
            <span>Customizations ({customizedCount})</span>
            <span>+₹{addOns.toLocaleString()}</span>
          </div>
          <div className="flex items-center justify-between mb-4 pt-3 border-t border-[#f2f2f2]">
            <span className="text-[#0a0a0a] text-lg uppercase tracking-wider font-bold">Total</span>
            <span className="font-display text-4xl text-[#c8102e]">₹{totalPrice.toLocaleString()}</span>
          </div>
          <Button variant="primary" size="lg" className="w-full" onClick={addToCart}>
            <ShoppingBag size={18} /> Add to Cart
          </Button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 h-[55vh] lg:h-auto bg-[#eeeeee]">
        <PantsViewer
          primaryColor={primaryColor}
          secondaryColor={primaryColor}
          fabric={fabric}
          fit={fit}
          art={art}
        />
      </div>
    </div>
  )
}
