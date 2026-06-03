import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import DesignsClient from './DesignsClient'

export default async function DesignsPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as { id: string }).id

  const designs = await db.customDesign.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-5xl text-[#0a0a0a] mb-8">MY DESIGNS</h1>
        <DesignsClient designs={designs} />
      </div>
    </div>
  )
}
