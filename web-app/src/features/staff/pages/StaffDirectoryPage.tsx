import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Plus, Phone, Mail, MoreVertical } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// StaffDirectoryPage — Tesla-inspired staff profiles
// ─────────────────────────────────────────────────────────

type StaffMember = {
  id: string
  name: string
  role: string
  department: string
  phone: string
  shift: string
  status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED'
  joinDate: string
  rating: number
}

const MOCK_STAFF: StaffMember[] = [
  { id: 's1', name: 'Ramesh Kumar', role: 'Security guard', department: 'Security', phone: '+91 98765 00001', shift: 'Day (6AM–6PM)', status: 'ACTIVE', joinDate: '2024-03-15', rating: 4.2 },
  { id: 's2', name: 'Sunita Devi', role: 'Housekeeping', department: 'Cleaning', phone: '+91 98765 00002', shift: 'Morning (6AM–2PM)', status: 'ACTIVE', joinDate: '2023-11-01', rating: 4.8 },
  { id: 's3', name: 'Vikram Singh', role: 'Electrician', department: 'Maintenance', phone: '+91 98765 00003', shift: 'Day (9AM–6PM)', status: 'ON_LEAVE', joinDate: '2024-06-20', rating: 3.9 },
  { id: 's4', name: 'Lakshmi Bai', role: 'Gardener', department: 'Landscaping', phone: '+91 98765 00004', shift: 'Morning (6AM–12PM)', status: 'ACTIVE', joinDate: '2025-01-10', rating: 4.5 },
  { id: 's5', name: 'Ahmed Khan', role: 'Night guard', department: 'Security', phone: '+91 98765 00005', shift: 'Night (6PM–6AM)', status: 'ACTIVE', joinDate: '2024-08-01', rating: 4.0 },
]

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { ACTIVE: 'success', ON_LEAVE: 'warning', TERMINATED: 'danger' }

export default function StaffDirectoryPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_STAFF.filter(s =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.role.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Staff directory</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Digital profiles, shifts, and contact information for all society staff.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total staff', value: '24' },
          { label: 'Active today', value: '19' },
          { label: 'On leave', value: '3' },
          { label: 'Avg. rating', value: '4.3★' },
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
            <input type="text" placeholder="Search staff..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
          <button className="ml-auto px-4 py-2 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0" style={{ background: 'var(--color-electric-blue)' }}>
            <Plus size={16} /> Add staff
          </button>
        </div>

        {/* Cards grid for mobile, table for desktop */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['Name', 'Role', 'Department', 'Shift', 'Phone', 'Rating', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
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
                  <td className="px-4 py-3" style={{ color: 'var(--color-tertiary)' }}>{s.department}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-body)' }}>{s.shift}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{s.phone}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{s.rating.toFixed(1)}★</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_MAP[s.status]}>{s.status.toLowerCase().replace('_', ' ')}</Badge></td>
                  <td className="px-4 py-3"><button className="p-1" style={{ color: 'var(--color-placeholder)' }}><MoreVertical size={14} /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile card view */}
        <div className="md:hidden p-4 space-y-3">
          {filtered.map(s => (
            <div key={s.id} className="p-4 rounded-[4px] flex items-start justify-between gap-3" style={{ background: 'var(--color-light-ash)' }}>
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-[4px] flex items-center justify-center text-white font-medium shrink-0" style={{ background: 'var(--color-electric-blue)' }}>
                  {s.name.charAt(0)}
                </div>
                <div>
                  <p className="font-medium text-sm" style={{ color: 'var(--color-heading)' }}>{s.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{s.role} · {s.department}</p>
                  <p className="text-xs mt-1" style={{ color: 'var(--color-placeholder)' }}>{s.shift}</p>
                </div>
              </div>
              <Badge variant={STATUS_MAP[s.status]}>{s.status.toLowerCase().replace('_', ' ')}</Badge>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  )
}
