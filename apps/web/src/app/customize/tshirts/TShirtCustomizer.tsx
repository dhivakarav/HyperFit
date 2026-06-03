'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { motion } from 'framer-motion'
import { ShoppingBag, Save } from 'lucide-react'
import { Button } from '@hyperfit/ui'
import { useCartStore } from '@/store/cartStore'
import { snapshotCanvas } from '@/lib/canvasSnapshot'
import { useToast } from '@hyperfit/ui'

const TShirtViewer = dynamic(() => import('@/components/three/TShirtViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#f4f4f4] flex items-center justify-center text-[#6b6b6b]">Loading 3D viewer...</div>,
})

const FIT_OPTIONS = ['Regular', 'Oversized', 'Slim', 'Cropped']
const FABRIC_OPTIONS = ['Cotton', 'Polyester Blend', 'Bamboo', 'Dry-fit']

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

export default function TShirtCustomizer() {
  const [fit, setFit] = useState('Regular')
  const [fabric, setFabric] = useState('Cotton')
  const [baseColor, setBaseColor] = useState('#f8f8f8')
  const [frontText, setFrontText] = useState('')
  const [backText, setBackText] = useState('')
  const [font, setFont] = useState('Bebas')
  const [size, setSize] = useState('M')

  const BASE_PRICE = 2999
  const addOns =
    (fabric === 'Bamboo' ? 400 : fabric === 'Dry-fit' ? 300 : 0) +
    (fit === 'Oversized' ? 200 : 0) +
    (frontText || backText ? 199 : 0)
  const customizedCount =
    (fabric === 'Bamboo' || fabric === 'Dry-fit' ? 1 : 0) +
    (fit === 'Oversized' ? 1 : 0) +
    (frontText || backText ? 1 : 0)
  const totalPrice = BASE_PRICE + addOns

  const { addItem, openCart } = useCartStore()
  const { toast } = useToast()

  function addToCart() {
    const image = snapshotCanvas()
    addItem({
      id: `custom-tshirt-${Date.now()}`,
      productId: 'custom-tshirt',
      name: `Custom ${fit} Tee`,
      price: totalPrice,
      quantity: 1,
      size,
      isCustom: true,
      image,
    })
    openCart()
    toast('Custom tee added to cart!', 'success')
  }

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-80px)]">
      {/* Controls */}
      <div className="w-full lg:w-[40%] lg:overflow-y-auto bg-[#ffffff] border-r border-[#f2f2f2] flex flex-col">
        <div className="p-8 border-b border-[#f2f2f2]">
          <h1 className="font-display text-6xl text-[#0a0a0a]">T-SHIRT STUDIO</h1>
          <p className="text-[#6b6b6b] text-lg mt-2">Design your perfect tee.</p>
        </div>

        <div className="lg:flex-1 lg:overflow-y-auto p-8 space-y-7">
          <OptionGroup label="Fit" options={FIT_OPTIONS} value={fit} onChange={setFit} />
          <OptionGroup label="Fabric" options={FABRIC_OPTIONS} value={fabric} onChange={setFabric} />

          <div>
            <p className="text-[#6b6b6b] text-sm font-bold uppercase tracking-wider mb-2">Base Color</p>
            <input
              type="color"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="w-10 h-10 cursor-pointer bg-transparent border-0 p-0 mr-3"
            />
            <input
              type="text"
              value={baseColor}
              onChange={(e) => setBaseColor(e.target.value)}
              className="h-10 w-32 bg-[#f2f2f2] border border-[#d8d8d8] text-[#0a0a0a] text-sm px-3 outline-none focus:border-[#c8102e] font-mono"
            />
          </div>

          <div>
            <p className="text-[#6b6b6b] text-sm font-bold uppercase tracking-wider mb-2">Front Text</p>
            <input
              type="text"
              value={frontText}
              onChange={(e) => setFrontText(e.target.value)}
              placeholder="Enter text for front print..."
              className="w-full h-10 bg-[#f2f2f2] border border-[#d8d8d8] text-[#0a0a0a] text-sm px-3 outline-none focus:border-[#c8102e]"
              maxLength={24}
            />
          </div>

          <div>
            <p className="text-[#6b6b6b] text-sm font-bold uppercase tracking-wider mb-2">Back Text</p>
            <input
              type="text"
              value={backText}
              onChange={(e) => setBackText(e.target.value)}
              placeholder="Enter text for back print..."
              className="w-full h-10 bg-[#f2f2f2] border border-[#d8d8d8] text-[#0a0a0a] text-sm px-3 outline-none focus:border-[#c8102e]"
              maxLength={24}
            />
          </div>

          <div>
            <p className="text-[#6b6b6b] text-sm font-bold uppercase tracking-wider mb-2">Text Font</p>
            <div className="flex flex-wrap gap-2">
              {[
                { id: 'Bebas', label: 'Bebas' },
                { id: 'Anton', label: 'Anton' },
                { id: 'Pacifico', label: 'Script' },
              ].map((f) => (
                <button
                  key={f.id}
                  onClick={() => setFont(f.id)}
                  className={`px-4 py-2.5 text-sm font-bold uppercase tracking-wider border transition-colors ${
                    font === f.id ? 'border-[#c8102e] bg-[#c8102e] text-[#ffffff]' : 'border-[#d8d8d8] text-[#6b6b6b] hover:border-[#c8102e] hover:text-[#c8102e]'
                  }`}
                >
                  {f.label}
                </button>
              ))}
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
          <div className="flex gap-2 mb-3">
            <Button variant="outline" size="sm" className="flex-1 flex items-center gap-2 justify-center">
              <Save size={14} /> Save
            </Button>
          </div>
          <Button variant="primary" size="lg" className="w-full" onClick={addToCart}>
            <ShoppingBag size={18} /> Add to Cart
          </Button>
        </div>
      </div>

      {/* 3D Viewer */}
      <div className="flex-1 h-[55vh] lg:h-auto bg-[#eeeeee]">
        <TShirtViewer
          baseColor={baseColor}
          frontText={frontText}
          backText={backText}
          font={font}
          fit={fit}
          fabric={fabric}
        />
      </div>
    </div>
  )
}
