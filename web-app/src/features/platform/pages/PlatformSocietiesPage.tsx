import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Plus, Building2, Users, Wifi, WifiOff } from 'lucide-react'
import { useState } from 'react'

// ─────────────────────────────────────────────────────────
// PlatformSocietiesPage — Super Admin society list
// ─────────────────────────────────────────────────────────

type Society = { id: string; name: string; city: string; units: number; plan: 'STANDARD' | 'PREMIUM'; edgeStatus: 'ONLINE' | 'OFFLINE'; activeUsers: number; createdAt: string }

const MOCK: Society[] = [
  { id: 's1', name: 'Alpha Society', city: 'Bangalore', units: 486, plan: 'PREMIUM', edgeStatus: 'ONLINE', activeUsers: 412, createdAt: 'Jan 2024' },
  { id: 's2', name: 'Green Meadows', city: 'Mumbai', units: 320, plan: 'STANDARD', edgeStatus: 'ONLINE', activeUsers: 285, createdAt: 'Mar 2024' },
  { id: 's3', name: 'Sunrise Township', city: 'Hyderabad', units: 1200, plan: 'PREMIUM', edgeStatus: 'OFFLINE', activeUsers: 980, createdAt: 'Jun 2024' },
  { id: 's4', name: 'Lake View Residency', city: 'Pune', units: 180, plan: 'STANDARD', edgeStatus: 'ONLINE', activeUsers: 156, createdAt: 'Sep 2024' },
]

export default function PlatformSocietiesPage() {
  const [search, setSearch] = useState('')
  const filtered = MOCK.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Societies</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>All onboarded societies across the platform.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> Onboard society
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[{ label: 'Total societies', value: '4' }, { label: 'Total units', value: '2,186' }, { label: 'Active users', value: '1,833' }, { label: 'Edge servers online', value: '3/4' }].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
            <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <Card noPadding>
        <div className="p-4" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input type="text" placeholder="Search society..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
              {['Society', 'City', 'Units', 'Active users', 'Plan', 'Edge server', 'Since'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3"><div className="flex items-center gap-2"><Building2 size={16} style={{ color: 'var(--color-electric-blue)' }} /><span className="font-medium" style={{ color: 'var(--color-heading)' }}>{s.name}</span></div></td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{s.city}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{s.units}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-heading)' }}>{s.activeUsers}</td>
                  <td className="px-4 py-3"><Badge variant={s.plan === 'PREMIUM' ? 'info' : 'neutral'}>{s.plan.toLowerCase()}</Badge></td>
                  <td className="px-4 py-3">
                    <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: s.edgeStatus === 'ONLINE' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                      {s.edgeStatus === 'ONLINE' ? <Wifi size={12} /> : <WifiOff size={12} />}{s.edgeStatus.toLowerCase()}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-placeholder)' }}>{s.createdAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
