import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session || (session.user as { role?: string }).role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 403 })
  }

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [ordersToday, totalRevenue, newUsersToday, ordersByStatus] = await Promise.all([
    db.order.count({ where: { createdAt: { gte: today } } }),
    db.order.aggregate({ where: { status: { not: 'CANCELLED' } }, _sum: { total: true } }),
    db.user.count({ where: { createdAt: { gte: today } } }),
    db.order.groupBy({ by: ['status'], _count: { status: true } }),
  ])

  return NextResponse.json({
    ordersToday,
    totalRevenue: totalRevenue._sum.total ?? 0,
    newUsersToday,
    ordersByStatus: ordersByStatus.map((o) => ({ status: o.status, count: o._count.status })),
  })
}
