'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, ChevronDown } from 'lucide-react'
import { RatingStars, ProductCard, useToast } from '@hyperfit/ui'
import { useCartStore } from '@/store/cartStore'

interface ProductDetailProps {
  product: {
    id: string; slug: string; name: string; description: string
    variants: Array<{ id: string; size: string; color: string; colorHex?: string | null; price: number; salePrice?: number | null; stock: number; images: string[] }>
    reviews: Array<{ id: string; rating: number; title?: string | null; body: string; verified: boolean; user?: { name: string; avatar?: string | null } | null; createdAt: Date }>
    category: { name: string; slug: string }
    _count: { reviews: number }
  }
  related: Array<{ id: string; slug: string; name: string; variants: Array<{ price: number; salePrice?: number | null; images: string[] }> }>
}

const ACCORDION_ITEMS = [
  { title: 'Size & Fit', key: 'size' },
  { title: 'Free Delivery & Returns', key: 'shipping' },
  { title: 'Materials & Care', key: 'materials' },
  { title: 'Reviews', key: 'reviews' },
]

const FALLBACK = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=1200'

export default function ProductDetail({ product, related }: ProductDetailProps) {
  // Unique colorways with a representative image for each (Nike-style thumbnails).
  const colorways = [
    ...new Map(
      product.variants.map((v) => [v.color, { value: v.color, hex: v.colorHex ?? '#888', image: v.images[0] ?? FALLBACK, available: product.variants.some((x) => x.color === v.color && x.stock > 0) }])
    ).values(),
  ]
  const [selectedColor, setSelectedColor] = useState(colorways[0]?.value ?? '')
  const colorVariants = product.variants.filter((v) => v.color === selectedColor)
  const [selectedSize, setSelectedSize] = useState('')
  const [activeImage, setActiveImage] = useState(0)
  const [wishlisted, setWishlisted] = useState(false)
  const [sizeError, setSizeError] = useState(false)
  const [activeAccordion, setActiveAccordion] = useState<string | null>('size')

  const selectedVariant = colorVariants.find((v) => v.size === selectedSize) ?? colorVariants[0]
  const images = (colorVariants[0]?.images?.length ? colorVariants[0].images : [FALLBACK])
  const price = selectedVariant?.salePrice ?? selectedVariant?.price ?? 0
  const hasSale = !!selectedVariant?.salePrice

  const { addItem } = useCartStore()
  const { toast } = useToast()

  const avgRating = product.reviews.length > 0 ? product.reviews.reduce((s, r) => s + r.rating, 0) / product.reviews.length : 0

  function handleAddToCart() {
    const variant = colorVariants.find((v) => v.size === selectedSize)
    if (!variant) { setSizeError(true); return }
    addItem({
      id: `${variant.id}-${Date.now()}`,
      productId: product.id,
      variantId: variant.id,
      name: product.name,
      price: variant.salePrice ?? variant.price,
      quantity: 1,
      size: variant.size,
      color: variant.color,
      image: images[0],
    })
    toast(`${product.name} added to bag`, 'success')
  }

  return (
    <div className="min-h-screen pt-20 bg-[#ffffff]">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-10 py-6">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-[#6b6b6b] mb-6">
          <Link href="/" className="hover:text-[#0a0a0a]">Home</Link>
          <span>/</span>
          <Link href={`/shop/${product.category.slug}`} className="hover:text-[#0a0a0a]">{product.category.name}</Link>
          <span>/</span>
          <span className="text-[#0a0a0a]">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-[1.35fr_1fr] gap-8 lg:gap-14 mb-24">
          {/* ── Gallery ── */}
          <div className="flex flex-col-reverse sm:flex-row gap-3">
            {/* Thumbnail rail */}
            <div className="flex sm:flex-col gap-3 shrink-0">
              {images.slice(0, 5).map((img, i) => (
                <button
                  key={i}
                  onMouseEnter={() => setActiveImage(i)}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 bg-[#f4f4f4] transition-colors ${activeImage === i ? 'border-[#c8102e]' : 'border-transparent hover:border-[#d8d8d8]'}`}
                >
                  <img src={img} alt="" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>

            {/* Main image */}
            <div className="relative flex-1 aspect-square rounded-2xl overflow-hidden bg-[#f4f4f4]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={`${activeImage}-${selectedColor}`}
                  src={images[activeImage] || FALLBACK}
                  alt={product.name}
                  className="w-full h-full object-contain p-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>
              <button
                onClick={() => setWishlisted((p) => !p)}
                className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white shadow-md flex items-center justify-center hover:scale-105 transition-transform"
                aria-label="Favourite"
              >
                <Heart size={18} className={wishlisted ? 'fill-[#ff3c3c] stroke-[#ff3c3c]' : 'stroke-[#ffffff]'} />
              </button>
            </div>
          </div>

          {/* ── Info (sticky) ── */}
          <div className="lg:sticky lg:top-24 self-start">
            <p className="text-[#6b6b6b] text-sm mb-1 capitalize">{product.category.name}</p>
            <h1 className="text-3xl sm:text-4xl font-semibold text-[#0a0a0a] leading-tight mb-1">{product.name}</h1>
            <p className="text-[#6b6b6b] text-sm mb-4">{selectedColor}</p>

            {/* Price */}
            <div className="flex items-center gap-3 mb-5">
              <span className="text-2xl font-semibold text-[#0a0a0a]">₹{price.toLocaleString()}</span>
              {hasSale && (
                <>
                  <span className="text-base text-[#6b6b6b] line-through">₹{selectedVariant?.price.toLocaleString()}</span>
                  <span className="text-sm font-bold text-[#c8102e]">
                    {Math.round((1 - (selectedVariant!.salePrice! / selectedVariant!.price)) * 100)}% off
                  </span>
                </>
              )}
            </div>

            {product._count.reviews > 0 && (
              <div className="mb-6"><RatingStars rating={avgRating} count={product._count.reviews} size="sm" /></div>
            )}

            {/* Colourways */}
            {colorways.length > 1 && (
              <div className="mb-6">
                <p className="text-sm font-medium text-[#0a0a0a] mb-2">Select Colour</p>
                <div className="flex flex-wrap gap-2">
                  {colorways.map((c) => (
                    <button
                      key={c.value}
                      onClick={() => { setSelectedColor(c.value); setSelectedSize(''); setActiveImage(0); setSizeError(false) }}
                      className={`w-16 h-16 rounded-lg overflow-hidden border-2 bg-[#f4f4f4] transition-all ${selectedColor === c.value ? 'border-[#c8102e]' : 'border-[#e8e8e8] hover:border-[#666]'}`}
                      title={c.value}
                    >
                      <img src={c.image} alt={c.value} className="w-full h-full object-contain" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Sizes */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <p className={`text-sm font-medium ${sizeError ? 'text-[#ff3c3c]' : 'text-[#0a0a0a]'}`}>
                  {sizeError ? 'Please select a size' : 'Select Size'}
                </p>
                <button className="text-sm text-[#6b6b6b] hover:text-[#0a0a0a] underline">Size Guide</button>
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                {colorVariants.map((v) => {
                  const out = v.stock === 0
                  const active = selectedSize === v.size
                  return (
                    <button
                      key={v.id}
                      disabled={out}
                      onClick={() => { setSelectedSize(v.size); setSizeError(false) }}
                      className={`h-12 rounded-lg border text-sm font-medium transition-colors ${
                        active ? 'border-[#c8102e] bg-[#c8102e] text-[#ffffff]'
                        : out ? 'border-[#f2f2f2] text-[#d8d8d8] line-through cursor-not-allowed'
                        : 'border-[#d8d8d8] text-[#0a0a0a] hover:border-[#0a0a0a]'
                      }`}
                    >
                      {v.size}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Actions — Nike-style rounded pills */}
            <div className="flex flex-col gap-3 mb-8">
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={handleAddToCart}
                disabled={selectedVariant?.stock === 0}
                className="w-full h-14 rounded-full bg-[#c8102e] text-[#ffffff] font-bold text-base hover:brightness-105 transition-all disabled:opacity-40"
              >
                {selectedVariant?.stock === 0 ? 'Out of Stock' : 'Add to Bag'}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setWishlisted((p) => !p)}
                className="w-full h-14 rounded-full border border-[#d8d8d8] text-[#0a0a0a] font-bold text-base flex items-center justify-center gap-2 hover:border-[#0a0a0a] transition-colors"
              >
                Favourite <Heart size={18} className={wishlisted ? 'fill-[#ff3c3c] stroke-[#ff3c3c]' : ''} />
              </motion.button>
            </div>

            <p className="text-[#555555] text-sm leading-relaxed mb-6">{product.description}</p>

            {/* Accordion */}
            <div className="border-t border-[#f2f2f2]">
              {ACCORDION_ITEMS.map(({ title, key }) => (
                <div key={key} className="border-b border-[#f2f2f2]">
                  <button
                    onClick={() => setActiveAccordion(activeAccordion === key ? null : key)}
                    className="flex items-center justify-between w-full py-4 text-base font-medium text-[#0a0a0a] text-left"
                  >
                    {title}
                    <motion.div animate={{ rotate: activeAccordion === key ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown size={18} className="text-[#6b6b6b]" />
                    </motion.div>
                  </button>
                  <AnimatePresence>
                    {activeAccordion === key && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.2 }} className="overflow-hidden">
                        <div className="pb-5 text-sm text-[#6b6b6b] leading-relaxed">
                          {key === 'size' && 'Fits true to size. We recommend ordering your usual size. Between sizes? Size up for a relaxed fit.'}
                          {key === 'shipping' && 'Free standard delivery on orders over ₹999. Express & same-day available at checkout. Free 30-day returns on unworn items.'}
                          {key === 'materials' && 'Crafted from premium materials. Wipe clean with a damp cloth; machine wash cold where applicable. Do not bleach.'}
                          {key === 'reviews' && (product.reviews.length > 0
                            ? `${product._count.reviews} verified reviews · ${avgRating.toFixed(1)} average rating.`
                            : 'No reviews yet — be the first to review this product.')}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Reviews */}
        {product.reviews.length > 0 && (
          <div className="mb-24">
            <h2 className="text-2xl font-semibold text-[#0a0a0a] mb-8">Reviews ({product._count.reviews})</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {product.reviews.map((review) => (
                <div key={review.id} className="bg-[#f4f4f4] rounded-xl p-6 border border-[#f2f2f2]">
                  <div className="flex items-center gap-2 mb-3">
                    <RatingStars rating={review.rating} size="sm" />
                    {review.verified && <span className="text-[10px] font-bold uppercase tracking-wider text-[#c8102e]">Verified</span>}
                  </div>
                  {review.title && <p className="font-semibold text-[#0a0a0a] mb-2">{review.title}</p>}
                  <p className="text-[#6b6b6b] text-sm leading-relaxed">{review.body}</p>
                  <p className="text-[#d8d8d8] text-xs mt-4">{review.user?.name ?? 'Customer'}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Related */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-semibold text-[#0a0a0a] mb-8">You Might Also Like</h2>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {related.map((p) => {
                const variant = p.variants[0]
                return (
                  <ProductCard
                    key={p.id}
                    id={p.id}
                    name={p.name}
                    price={variant?.price ?? 0}
                    salePrice={variant?.salePrice ?? undefined}
                    images={variant?.images ?? []}
                    slug={p.slug}
                  />
                )
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
