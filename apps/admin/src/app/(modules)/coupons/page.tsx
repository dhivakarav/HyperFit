import { db } from '@hyperfit/db'
import CouponsClient from './CouponsClient'

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold uppercase tracking-wider mb-6">Coupons</h1>
      <CouponsClient coupons={coupons} />
    </div>
  )
}
