import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { UserPlus, Search, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { AddMemberModal } from '../components/AddMemberModal'

// ─────────────────────────────────────────────────────────
// MembersListPage — Live Resident & Tenant database.
// ─────────────────────────────────────────────────────────

export default function MembersListPage() {
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState('ALL')
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false)

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/users')
      setUsers(res.data)
    } catch (err) {
      console.error('Failed to load users:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  // Filter Logic
  const filtered = users.filter((u: any) => {
    const matchSearch = String(u.name).toLowerCase().includes(search.toLowerCase()) || 
                        String(u.email).toLowerCase().includes(search.toLowerCase()) ||
                        String(u.phone).includes(search)
    const matchRole = filterRole === 'ALL' || u.role === filterRole
    return matchSearch && matchRole
  })

  const roles = ['ALL', 'FLAT_OWNER', 'TENANT', 'SECURITY_GUARD', 'SECRETARY', 'SUPERVISOR', 'PRESIDENT']

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-heading)' }}>Members Directory</h1>
          <p className="text-sm" style={{ color: 'var(--color-tertiary)' }}>Live registry of residents, tenants, and staff.</p>
        </div>
        <button 
          onClick={() => setIsAddMemberOpen(true)}
          className="px-4 py-2 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 transition-colors duration-[330ms]"
          style={{ background: 'var(--color-electric-blue)' }}
        >
          <UserPlus size={16} /> Register Member
        </button>
      </div>

      <Card noPadding>
        {/* Filters */}
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input
              type="text"
              placeholder="Search by name, email or phone..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px] transition-all duration-[330ms]"
              style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
             <select 
               className="px-3 py-2 text-sm rounded-[4px] cursor-pointer outline-none" 
               style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)', background: 'var(--color-light-ash)' }}
               value={filterRole}
               onChange={(e) => setFilterRole(e.target.value)}
             >
               {roles.map(r => <option key={r} value={r}>{r.replace('_', ' ')}</option>)}
             </select>
          </div>
        </div>

        {/* Database Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['Name', 'Email Address', 'Phone', 'Role', 'Status', 'Assigned Flat'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={24} style={{ color: 'var(--color-electric-blue)' }} />
                      Loading global member registry...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No members found.</td>
                </tr>
              ) : (
                filtered.map((u: any) => (
                  <tr key={u.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4]" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{u.name}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{u.email}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{u.phone}</td>
                    <td className="px-4 py-3">
                      <Badge variant={u.role === 'SUPERVISOR' || u.role === 'SECRETARY' ? 'info' : 'neutral'}>
                        {u.role.replace('_', ' ')}
                      </Badge>
                    </td>
                    <td className="px-4 py-3">
                       <Badge variant={u.isActive ? 'success' : 'danger'}>
                         {u.isActive ? 'ACTIVE' : 'INACTIVE'}
                       </Badge>
                    </td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>
                      {u.unit ? `${u.unit.building?.name} - ${u.unit.flatNumber}` : <span style={{ color: 'var(--color-placeholder)' }}>—</span>}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AddMemberModal 
        isOpen={isAddMemberOpen} 
        onClose={() => setIsAddMemberOpen(false)} 
        onSuccess={fetchUsers} 
      />
    </DashboardLayout>
  )
}
