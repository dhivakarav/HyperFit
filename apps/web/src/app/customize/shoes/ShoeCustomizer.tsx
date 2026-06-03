'use client'

import { useState, Suspense } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, Sparkles, Save, Share2, ShoppingBag } from 'lucide-react'
import { Button } from '@hyperfit/ui'
import { useCartStore } from '@/store/cartStore'
import { snapshotCanvas } from '@/lib/canvasSnapshot'
import { useToast } from '@hyperfit/ui'

const ShoeViewer = dynamic(() => import('@/components/three/ShoeViewer'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-[#f4f4f4] flex items-center justify-center"><div className="text-[#6b6b6b] text-sm">Loading 3D viewer...</div></div>,
})

const ZONES = [
  // IDs match the 3D model's material parts exactly, so each control maps 1:1.
  { id: 'mesh', label: 'Upper Mesh', surcharge: 599 },
  { id: 'laces', label: 'Laces', surcharge: 299 },
  { id: 'caps', label: 'Toe Cap', surcharge: 199 },
  { id: 'stripes', label: 'Side Stripes', surcharge: 349 },
  { id: 'sole', label: 'Sole', surcharge: 0 },
  { id: 'band', label: 'Heel Band', surcharge: 199 },
  { id: 'patch', label: 'Logo Patch', surcharge: 499 },
  { id: 'inner', label: 'Inner Lining', surcharge: 149 },
]

const PRESET_COLORS = ['#0a0a0a', '#f8f8f8', '#e8ff47', '#ff3c3c', '#1a237e', '#4a148c', '#1b5e20', '#e65100', '#880e4f', '#37474f', '#795548', '#ffd600']
const MATERIALS = ['Leather', 'Mesh', 'Suede', 'Knit', 'Synthetic']

type ZoneConfig = { color: string; material: string }
type ZoneMap = Record<string, ZoneConfig>

// A tasteful default colorway — each part starts with a distinct color so the
// initial shoe looks designed and every control's effect is immediately visible.
const DEFAULT_COLORS: Record<string, string> = {
  mesh: '#f8f8f8',
  laces: '#0a0a0a',
  caps: '#0a0a0a',
  stripes: '#e8ff47',
  sole: '#ffffff',
  band: '#0a0a0a',
  patch: '#e8ff47',
  inner: '#1c1c1c',
}
const defaultZones: ZoneMap = ZONES.reduce((acc, z) => {
  acc[z.id] = { color: DEFAULT_COLORS[z.id] ?? '#f8f8f8', material: 'Leather' }
  return acc
}, {} as ZoneMap)

export default function ShoeCustomizer() {
  const [zones, setZones] = useState<ZoneMap>(defaultZones)
  const [activeZone, setActiveZone] = useState<string | null>('mesh')
  const [aiLoading, setAiLoading] = useState(false)
  const [aiColors, setAiColors] = useState<string[]>([])
  const BASE_PRICE = 8999

  // Only charge a part's surcharge once it's actually been customized (color or
  // material changed from the default), so the total responds live to choices.
  const customizedCount = ZONES.reduce((n, z) => {
    const cur = zones[z.id]
    const def = defaultZones[z.id]
    return n + (cur && def && (cur.color !== def.color || cur.material !== def.material) ? 1 : 0)
  }, 0)
  const addOns = ZONES.reduce((sum, z) => {
    const cur = zones[z.id]
    const def = defaultZones[z.id]
    const changed = !!cur && !!def && (cur.color !== def.color || cur.material !== def.material)
    return sum + (changed ? z.surcharge : 0)
  }, 0)
  const totalPrice = BASE_PRICE + addOns

  const updateZone = (zoneId: string, update: Partial<ZoneConfig>) => {
    setZones((prev) => ({ ...prev, [zoneId]: { ...prev[zoneId], ...update } }))
  }

  const { addItem, openCart } = useCartStore()
  const { toast } = useToast()

  async function suggestColors() {
    const activeColor = zones[activeZone ?? 'sole']?.color ?? '#0a0a0a'
    setAiLoading(true)
    try {
      const res = await fetch('/api/ai/color-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseColor: activeColor }),
      })
      const data = await res.json()
      setAiColors(data.colors ?? [])
    } catch {
      toast('AI unavailable, try again later', 'error')
    } finally {
      setAiLoading(false)
    }
  }

  async function generateDesign() {
    setAiLoading(true)
    try {
      // Ask the AI for a harmonious palette, then distribute it across the real parts.
      const seed = PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]
      const res = await fetch('/api/ai/color-match', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ baseColor: seed }),
      })
      const data = await res.json()
      const palette: string[] = data.colors?.length ? data.colors : ['#0a0a0a', '#f8f8f8', '#e8ff47', '#ff3c3c', '#1a237e']
      const materials = ['Leather', 'Mesh', 'Suede', 'Knit', 'Synthetic']

      setZones(() => {
        const next: ZoneMap = {}
        ZONES.forEach((z, i) => {
          next[z.id] = {
            color: palette[i % palette.length],
            material: materials[i % materials.length],
          }
        })
        return next
      })
      toast('AI design applied!', 'success')
    } catch {
      toast('AI design unavailable, try again', 'error')
    } finally {
      setAiLoading(false)
    }
  }

  async function saveDesign() {
    try {
      const res = await fetch('/api/designs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productType: 'SHOES',
          name: 'Custom Shoe',
          config: { zones, basePrice: BASE_PRICE, totalPrice },
        }),
      })
      if (res.status === 401) {
        toast('Please sign in to save designs', 'error')
        return
      }
      if (!res.ok) throw new Error()
      toast('Design saved to your account!', 'success')
    } catch {
      toast('Could not save design', 'error')
    }
  }

  async function shareDesign() {
    const encoded = btoa(encodeURIComponent(JSON.stringify(zones)))
    const url = `${window.location.origin}/customize/shoes?d=${encoded}`
    try {
      await navigator.clipboard.writeText(url)
      toast('Share link copied to clipboard!', 'success')
    } catch {
      toast('Could not copy link', 'error')
    }
  }

  function addToCart() {
    const image = snapshotCanvas()
    addItem({
      id: `custom-shoe-${Date.now()}`,
      productId: 'custom-shoe',
      name: 'Custom HyperFit Shoe',
      price: totalPrice,
      quantity: 1,
      isCustom: true,
      image,
    })
    openCart()
    toast('Custom shoe added to cart!', 'success')
  }

  const zoneColors = Object.entries(zones).reduce((acc, [k, v]) => { acc[k] = v.color; return acc }, {} as Record<string, string>)
  const zoneMaterials = Object.entries(zones).reduce((acc, [k, v]) => { acc[k] = v.material; return acc }, {} as Record<string, string>)

  return (
    <div className="flex flex-col lg:flex-row lg:h-[calc(100vh-80px)]">
      {/* Left Panel — Controls */}
      <div className="w-full lg:w-[40%] lg:overflow-y-auto bg-[#ffffff] border-r border-[#f2f2f2] flex flex-col">
        <div className="p-8 border-b border-[#f2f2f2]">
          <h1 className="font-display text-6xl text-[#0a0a0a]">SHOE BUILDER</h1>
          <p className="text-[#6b6b6b] text-lg mt-2">Customize every detail. Build your perfect pair.</p>
        </div>

        {/* Zone accordions */}
        <div className="lg:flex-1 lg:overflow-y-auto flex flex-col">
          {ZONES.map((zone) => (
            <div key={zone.id} className="border-b border-[#f2f2f2] flex-1 flex flex-col justify-center">
              <button
                onClick={() => setActiveZone(activeZone === zone.id ? null : zone.id)}
                className="flex items-center justify-between w-full px-8 py-5 text-lg font-bold uppercase tracking-wider text-[#0a0a0a] hover:bg-[#f2f2f2] transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span
                    className="w-7 h-7 rounded-full border border-[#d8d8d8] shrink-0"
                    style={{ backgroundColor: zones[zone.id]?.color }}
                  />
                  {zone.label}
                  {zone.surcharge > 0 && <span className="text-[#6b6b6b] font-normal text-sm">+₹{zone.surcharge}</span>}
                </div>
                <motion.div animate={{ rotate: activeZone === zone.id ? 180 : 0 }}>
                  <ChevronDown size={22} className="text-[#6b6b6b]" />
                </motion.div>
              </button>

              <AnimatePresence>
                {activeZone === zone.id && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: 'auto' }}
                    exit={{ height: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-6 space-y-5">
                      {/* Color picker */}
                      <div>
                        <p className="text-[#6b6b6b] text-xs font-bold uppercase tracking-wider mb-3">Color</p>
                        <div className="flex flex-wrap gap-2 mb-3">
                          {PRESET_COLORS.map((hex) => (
                            <button
                              key={hex}
                              onClick={() => updateZone(zone.id, { color: hex })}
                              className="w-7 h-7 rounded-full border-2 transition-all"
                              style={{
                                backgroundColor: hex,
                                borderColor: zones[zone.id]?.color === hex ? '#e8ff47' : 'transparent',
                              }}
                              aria-label={hex}
                            />
                          ))}
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="color"
                            value={zones[zone.id]?.color ?? '#000000'}
                            onChange={(e) => updateZone(zone.id, { color: e.target.value })}
                            className="w-10 h-10 cursor-pointer bg-transparent border-0 p-0"
                            aria-label="Custom color"
                          />
                          <input
                            type="text"
                            value={zones[zone.id]?.color ?? ''}
                            onChange={(e) => updateZone(zone.id, { color: e.target.value })}
                            className="flex-1 h-10 bg-[#f2f2f2] border border-[#d8d8d8] text-[#0a0a0a] text-sm px-3 outline-none focus:border-[#c8102e] font-mono"
                            placeholder="#000000"
                          />
                        </div>
                      </div>

                      {/* Material */}
                      <div>
                        <p className="text-[#6b6b6b] text-xs font-bold uppercase tracking-wider mb-3">Material</p>
                        <div className="flex flex-wrap gap-2">
                          {MATERIALS.map((m) => (
                            <button
                              key={m}
                              onClick={() => updateZone(zone.id, { material: m })}
                              className={`px-3 py-1.5 text-xs font-bold uppercase tracking-wider border transition-colors ${
                                zones[zone.id]?.material === m
                                  ? 'border-[#c8102e] bg-[#c8102e] text-[#ffffff]'
                                  : 'border-[#d8d8d8] text-[#6b6b6b] hover:border-[#c8102e] hover:text-[#c8102e]'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* AI section */}
        <div className="p-6 border-t border-[#f2f2f2] space-y-3">
          <p className="text-[#6b6b6b] text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-[#c8102e]" /> AI Assistant
          </p>
          <div className="flex gap-2">
            <Button variant="dark" size="sm" className="flex-1" onClick={suggestColors} loading={aiLoading}>
              Suggest Colors
            </Button>
            <Button variant="dark" size="sm" className="flex-1" onClick={generateDesign} loading={aiLoading}>
              Generate Design
            </Button>
          </div>
          {aiColors.length > 0 && (
            <div className="flex gap-2">
              {aiColors.map((hex) => (
                <button
                  key={hex}
                  onClick={() => activeZone && updateZone(activeZone, { color: hex })}
                  className="w-8 h-8 rounded-full border-2 border-transparent hover:border-[#c8102e] transition-colors"
                  style={{ backgroundColor: hex }}
                  title={hex}
                />
              ))}
            </div>
          )}
        </div>

        {/* Pricing + actions */}
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
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm" className="flex items-center gap-2 justify-center" onClick={saveDesign}>
              <Save size={14} /> Save
            </Button>
            <Button variant="outline" size="sm" className="flex items-center gap-2 justify-center" onClick={shareDesign}>
              <Share2 size={14} /> Share
            </Button>
          </div>
          <Button variant="primary" size="lg" className="w-full mt-3" onClick={addToCart}>
            <ShoppingBag size={18} /> Add to Cart
          </Button>
        </div>
      </div>

      {/* Right Panel — 3D Viewer */}
      <div className="flex-1 h-[55vh] lg:h-auto bg-[#eeeeee]">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><div className="text-[#6b6b6b]">Loading 3D...</div></div>}>
          <ShoeViewer zoneColors={zoneColors} zoneMaterials={zoneMaterials} />
        </Suspense>
      </div>
    </div>
  )
}
