import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from '@/lib/auth'
import { db } from '@/lib/db'
import AccountDashboard from './AccountDashboard'

export default async function AccountPage() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect('/login')

  const userId = (session.user as { id: string }).id
  const user = await db.user.findUnique({
    where: { id: userId },
    include: { addresses: true },
  })

  if (!user) redirect('/login')

  return <AccountDashboard user={user} />
}
