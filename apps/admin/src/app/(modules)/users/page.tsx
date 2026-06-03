import { db } from '@hyperfit/db'

export default async function AdminUsersPage() {
  const users = await db.user.findMany({
    include: { _count: { select: { orders: true } } },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold uppercase tracking-wider">Users</h1>
        <p className="text-[#888888] text-sm">{users.length} registered users</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[#2a2a2a] text-[#888888] text-xs uppercase tracking-wider">
              <th className="text-left py-3 pr-4">User</th>
              <th className="text-left py-3 pr-4">Email</th>
              <th className="text-center py-3 pr-4">Role</th>
              <th className="text-center py-3 pr-4">Orders</th>
              <th className="text-left py-3 pr-4">Joined</th>
              <th className="text-right py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b border-[#1c1c1c] hover:bg-[#1c1c1c] transition-colors">
                <td className="py-3 pr-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-[#2a2a2a] overflow-hidden shrink-0">
                      {user.avatar && <img src={user.avatar} alt="" className="w-full h-full object-cover" />}
                    </div>
                    <span className="font-medium text-[#f8f8f8]">{user.name}</span>
                  </div>
                </td>
                <td className="py-3 pr-4 text-[#888888]">{user.email}</td>
                <td className="py-3 pr-4 text-center">
                  <span className={`text-xs font-bold px-2 py-0.5 uppercase ${user.role === 'ADMIN' ? 'bg-[#e8ff47] text-[#0a0a0a]' : 'bg-[#1c1c1c] border border-[#444444] text-[#888888]'}`}>
                    {user.role}
                  </span>
                </td>
                <td className="py-3 pr-4 text-center text-[#888888]">{user._count.orders}</td>
                <td className="py-3 pr-4 text-[#888888] text-xs">{new Date(user.createdAt).toLocaleDateString('en-IN')}</td>
                <td className="py-3 text-right">
                  <button className="text-xs text-[#888888] hover:text-[#e8ff47] transition-colors border border-[#444444] px-2 py-1 hover:border-[#e8ff47]">
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
