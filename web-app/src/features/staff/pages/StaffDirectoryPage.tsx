import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Plus, Phone, Mail, MoreVertical } from 'lucide-react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// StaffDirectoryPage — Tesla-inspired staff profiles
// ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { ACTIVE: 'success', ON_LEAVE: 'warning', TERMINATED: 'danger' }

export default function StaffDirectoryPage() {
  const [search, setSearch] = useState('')
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await apiClient.get('/staff')
        setStaff(data)
      } catch (err) {
        console.error('Failed to load staff list', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStaff()
  }, [])

  const filtered = staff.filter((s: any) =>
    s.name?.toLowerCase().includes(search.toLowerCase()) || s.role?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Staff directory</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Digital profiles, shifts, and contact information for all society staff.</p>
        </div>
        <button className="ml-auto px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> Add staff
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total staff', value: loading ? '-' : staff.length.toString() },
          { label: 'Active today', value: loading ? '-' : staff.filter(s => s.status === 'ACTIVE').length.toString() },
          { label: 'On leave', value: loading ? '-' : staff.filter(s => s.status === 'ON_LEAVE').length.toString() },
          { label: 'Avg. Rating', value: '4.8★' },
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
            <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input type="text" placeholder="Search staff name or role..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
        </div>

        {/* Cards grid for mobile, table for desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['Name', 'Role', 'Shift Hours', 'Phone', 'Hourly Rate', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">Loading staff database...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">No staff members found for this society.</td></tr>
              ) : filtered.map((s: any) => (
                <tr key={s.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-[4px] flex items-center justify-center text-white text-xs font-medium" style={{ background: 'var(--color-electric-blue)' }}>
                        {s.name.charAt(0)}
                      </div>
                      <span className="font-medium" style={{ color: 'var(--color-heading)' }}>{s.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{s.role}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-body)' }}>{s.shiftHours || '09:00 - 18:00'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{s.phone}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>₹{s.hourlyRate?.toString() || '150'}/hr</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_MAP[s.status] || 'neutral'}>{s.status.toLowerCase().replace('_', ' ')}</Badge></td>
                  <td className="px-4 py-3"><button className="p-1" style={{ color: 'var(--color-placeholder)' }}><MoreVertical size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
