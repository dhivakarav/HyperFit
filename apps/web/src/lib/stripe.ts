import Stripe from 'stripe'

// Fallback to an empty string so importing this module never throws at build
// time when STRIPE_SECRET_KEY is unset (payments aren't wired up in production).
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder_unused', {
  apiVersion: '2024-12-18.acacia',
  typescript: true,
})
