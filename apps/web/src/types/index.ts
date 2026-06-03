export type ProductType = 'SHOES' | 'TSHIRT' | 'PANTS' | 'ACCESSORIES'
export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'RETURNED' | 'CANCELLED'
export type Role = 'USER' | 'ADMIN'

export interface Category {
  id: string
  slug: string
  name: string
  description?: string
  image?: string
}

export interface ProductVariant {
  id: string
  productId: string
  size: string
  color: string
  colorHex?: string
  price: number
  salePrice?: number
  stock: number
  sku: string
  images: string[]
  weight?: number
}

export interface Review {
  id: string
  userId: string
  productId: string
  rating: number
  title?: string
  body: string
  verified: boolean
  images: string[]
  createdAt: string
  user?: { name: string; avatar?: string }
}

export interface Product {
  id: string
  slug: string
  name: string
  description: string
  type: ProductType
  categoryId: string
  tags: string[]
  isFeatured: boolean
  isPublished: boolean
  variants: ProductVariant[]
  reviews: Review[]
  category: Category
  createdAt: string
  _count?: { reviews: number }
}

export interface CartItem {
  id: string
  productId: string
  variantId?: string
  customDesignId?: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image?: string
  isCustom?: boolean
  designPreview?: string
}

export interface Address {
  id: string
  label: string
  line1: string
  line2?: string
  city: string
  state: string
  pincode: string
  country: string
  isDefault: boolean
}

export interface OrderItem {
  id: string
  name: string
  price: number
  quantity: number
  size?: string
  color?: string
  image?: string
}

export interface Order {
  id: string
  orderNumber: string
  status: OrderStatus
  subtotal: number
  discount: number
  shipping: number
  tax: number
  total: number
  address: Address
  couponCode?: string
  paymentMethod?: string
  items: OrderItem[]
  createdAt: string
}

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
  phone?: string
  wishlist: string[]
}

export interface CustomDesign {
  id: string
  productType: ProductType
  config: ShoeCustomizerConfig | TShirtCustomizerConfig | PantsCustomizerConfig
  previewUrl?: string
  name: string
  status: string
  price?: number
  createdAt: string
}

// Customizer configs
export interface ShoeZoneConfig {
  color: string
  material: string
  texture?: string
}

export interface ShoeCustomizerConfig {
  zones: {
    sole: ShoeZoneConfig
    lace: ShoeZoneConfig
    upper: ShoeZoneConfig
    midsole: ShoeZoneConfig
    outsole: ShoeZoneConfig
    heel: ShoeZoneConfig
    toeCap: ShoeZoneConfig
    stitching: ShoeZoneConfig
    logo: ShoeZoneConfig
    sideDesign: ShoeZoneConfig
  }
  text?: { content: string; font: string; placement: string }
  uploadedLogoUrl?: string
  basePrice: number
  totalPrice: number
}

export interface TShirtCustomizerConfig {
  fit: string
  sleeve: string
  collar: string
  fabric: string
  baseColor: string
  frontPrint?: { type: string; url?: string; text?: string; font?: string; placement?: string }
  backPrint?: { type: string; url?: string; text?: string }
  pocket: string
  basePrice: number
  totalPrice: number
}

export interface PantsCustomizerConfig {
  fit: string
  length: string
  waistband: string
  pockets: string
  fabric: string
  primaryColor: string
  secondaryColor: string
  stitchingColor: string
  zipper: string
  sideStripe: boolean
  stripeColor?: string
  inseam: number
  basePrice: number
  totalPrice: number
}

// API types
export interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface CheckoutFormData {
  name: string
  email: string
  phone: string
  address: {
    line1: string
    line2?: string
    city: string
    state: string
    pincode: string
    country: string
  }
  shippingMethod: 'standard' | 'express' | 'sameday'
  saveAddress?: boolean
}
