import { db } from '@hyperfit/db'
import OverviewClient from './OverviewClient'

async function getStats() {
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const [ordersToday, totalRevenue, newUsers, recentOrders, lowStock] = await Promise.all([
    db.order.count({ where: { createdAt: { gte: today } } }),
    db.order.aggregate({
      where: { status: { not: 'CANCELLED' } },
      _sum: { total: true },
    }),
    db.user.count({ where: { createdAt: { gte: today } } }),
    db.order.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } }, items: true },
    }),
    db.productVariant.findMany({
      where: { stock: { lte: 10 } },
      include: { product: { select: { name: true } } },
      take: 5,
    }),
  ])

  // Mock 30-day revenue data
  const revenueData = Array.from({ length: 30 }, (_, i) => {
    const date = new Date()
    date.setDate(date.getDate() - (29 - i))
    return {
      date: date.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
      revenue: Math.floor(Math.random() * 50000) + 10000,
    }
  })

  return {
    ordersToday,
    totalRevenue: totalRevenue._sum.total ?? 0,
    newUsers,
    recentOrders,
    lowStock,
    revenueData,
  }
}

export default async function AdminDashboard() {
  const stats = await getStats()
  return <OverviewClient stats={stats} />
}
