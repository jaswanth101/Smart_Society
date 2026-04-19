import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Plus, Phone, Mail, MoreVertical } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { AddStaffModal } from '../components/AddStaffModal'

// ─────────────────────────────────────────────────────────
// StaffDirectoryPage — Tesla-inspired staff profiles
// ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { ACTIVE: 'success', ON_LEAVE: 'warning', TERMINATED: 'danger' }

export default function StaffDirectoryPage() {
  const [search, setSearch] = useState('')
  const [staff, setStaff] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const fetchStaff = async () => {
    setLoading(true)
    try {
      const { data } = await apiClient.get('/staff')
      setStaff(data)
    } catch (err) {
      console.error('Failed to load staff list', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
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
        <button onClick={() => setIsAddOpen(true)} className="ml-auto px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0" style={{ background: 'var(--color-electric-blue)' }}>
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
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  {['Name', 'Role', 'Shift Hours', 'Phone', 'Hourly Rate', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                      <td colSpan={7} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded-[4px] animate-pulse w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No staff members found.</td></tr>
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
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-body)' }}>{s.shiftTime || 'Fixed'}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{s.phone}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>₹{s.hourlyRate?.toString() || '150'}/hr</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_MAP[s.status] || 'neutral'}>{s.status.toLowerCase().replace('_', ' ')}</Badge></td>
                    <td className="px-4 py-3"><button className="p-1 transition-colors hover:bg-white rounded" style={{ color: 'var(--color-placeholder)' }}><MoreVertical size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
             {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="border p-4 rounded-[8px] bg-white flex flex-col gap-3 animate-pulse" style={{ borderColor: 'var(--color-cloud)' }}>
                    <div className="h-4 bg-gray-200 rounded-[4px] w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded-[4px] w-1/2"></div>
                  </div>
                ))
             ) : filtered.length === 0 ? (
                <div className="py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No staff members found.</div>
             ) : (
                filtered.map((s: any) => (
                  <div key={s.id} className="border p-4 rounded-[8px] bg-white flex flex-col gap-3" style={{ borderColor: 'var(--color-cloud)' }}>
                    <div className="flex justify-between items-start gap-2">
                       <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-[4px] flex items-center justify-center text-white text-sm font-medium" style={{ background: 'var(--color-electric-blue)' }}>
                           {s.name.charAt(0)}
                         </div>
                         <div>
                           <p className="font-semibold text-sm" style={{ color: 'var(--color-heading)' }}>{s.name}</p>
                           <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-tertiary)' }}>{s.role}</p>
                         </div>
                       </div>
                       <Badge variant={STATUS_MAP[s.status] || 'neutral'} dot>{s.status.toLowerCase().replace('_', ' ')}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t" style={{ borderColor: 'var(--color-cloud)' }}>
                       <div>
                          <p className="text-[11px] uppercase tracking-wide font-semibold mb-1" style={{ color: 'var(--color-placeholder)' }}>Phone</p>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{s.phone}</p>
                       </div>
                       <div>
                          <p className="text-[11px] uppercase tracking-wide font-semibold mb-1" style={{ color: 'var(--color-placeholder)' }}>Shift hours</p>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{s.shiftTime || 'Fixed'}</p>
                       </div>
                    </div>
                  </div>
                ))
             )}
          </div>
        </div>
      </Card>
      
      {/* Modals */}
      <AddStaffModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSuccess={fetchStaff} 
      />
    </DashboardLayout>
  )
}
