import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Building2, Search, Plus, Edit2, ChevronRight } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// PropertyUnitsPage — Tesla-inspired flat/unit management
// ─────────────────────────────────────────────────────────

type Unit = {
  id: string
  flatNo: string
  wing: string
  floor: number
  type: string
  owner: string
  phone: string
  status: 'OCCUPIED' | 'VACANT' | 'RENTED'
  dues: number
}

const MOCK_UNITS: Unit[] = [
  { id: 'u1', flatNo: 'A-101', wing: 'Tower A', floor: 1, type: '2BHK', owner: 'Rajesh Iyer', phone: '+91 98765 43210', status: 'OCCUPIED', dues: 0 },
  { id: 'u2', flatNo: 'A-201', wing: 'Tower A', floor: 2, type: '3BHK', owner: 'Priya Sharma', phone: '+91 87654 32109', status: 'RENTED', dues: 4500 },
  { id: 'u3', flatNo: 'B-304', wing: 'Tower B', floor: 3, type: '2BHK', owner: 'Sanjay Kumar', phone: '+91 76543 21098', status: 'OCCUPIED', dues: 0 },
  { id: 'u4', flatNo: 'B-401', wing: 'Tower B', floor: 4, type: '1BHK', owner: '—', phone: '—', status: 'VACANT', dues: 0 },
  { id: 'u5', flatNo: 'C-102', wing: 'Tower C', floor: 1, type: '3BHK', owner: 'David D', phone: '+91 65432 10987', status: 'OCCUPIED', dues: 9000 },
  { id: 'u6', flatNo: 'C-503', wing: 'Tower C', floor: 5, type: '2BHK', owner: 'Alisha Verma', phone: '+91 54321 09876', status: 'RENTED', dues: 0 },
]

const STATUS_MAP: Record<string, 'success' | 'warning' | 'neutral'> = {
  OCCUPIED: 'success',
  RENTED: 'info' as any,
  VACANT: 'neutral',
}

export default function PropertyUnitsPage() {
  const [search, setSearch] = useState('')
  const [filterWing, setFilterWing] = useState('ALL')

  const wings = ['ALL', ...new Set(MOCK_UNITS.map(u => u.wing))]
  const filtered = MOCK_UNITS.filter(u => {
    const matchSearch = u.flatNo.toLowerCase().includes(search.toLowerCase()) || u.owner.toLowerCase().includes(search.toLowerCase())
    const matchWing = filterWing === 'ALL' || u.wing === filterWing
    return matchSearch && matchWing
  })

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Property & units</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Manage zones, wings, and flat mapping across the society.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total units', value: '486' },
          { label: 'Occupied', value: '412' },
          { label: 'Rented', value: '58' },
          { label: 'Vacant', value: '16' },
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
            <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input
              type="text"
              placeholder="Search flat or owner..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px] transition-all duration-[330ms]"
              style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {wings.map(w => (
              <button
                key={w}
                onClick={() => setFilterWing(w)}
                className="px-3 py-1.5 rounded-[4px] text-xs font-medium transition-colors duration-[330ms]"
                style={{
                  background: filterWing === w ? 'var(--color-electric-blue)' : 'var(--color-light-ash)',
                  color: filterWing === w ? 'white' : 'var(--color-body)',
                }}
              >
                {w === 'ALL' ? 'All wings' : w}
              </button>
            ))}
          </div>
          <button
            className="ml-auto px-4 py-2 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 transition-colors duration-[330ms] shrink-0"
            style={{ background: 'var(--color-electric-blue)' }}
          >
            <Plus size={16} /> Add unit
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['Flat', 'Wing', 'Type', 'Owner', 'Phone', 'Status', 'Dues', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{u.flatNo}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{u.wing}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{u.type}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{u.owner}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-tertiary)' }}>{u.phone}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_MAP[u.status] ?? 'neutral'}>{u.status.toLowerCase()}</Badge></td>
                  <td className="px-4 py-3 font-medium" style={{ color: u.dues > 0 ? 'var(--color-danger)' : 'var(--color-success)' }}>
                    {u.dues > 0 ? `₹${u.dues.toLocaleString()}` : 'Clear'}
                  </td>
                  <td className="px-4 py-3">
                    <button className="p-1.5 rounded-[4px] transition-colors duration-[330ms]" style={{ color: 'var(--color-tertiary)' }}><Edit2 size={14} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
