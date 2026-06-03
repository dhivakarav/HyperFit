import { db } from '@hyperfit/db'
import OrdersClient from './OrdersClient'

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    include: {
      user: { select: { name: true, email: true } },
      items: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider">Orders</h1>
        <p className="text-[#888888] text-sm">{orders.length} total orders</p>
      </div>
      <OrdersClient orders={orders} />
    </div>
  )
}
