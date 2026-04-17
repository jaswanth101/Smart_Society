import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Car, Zap, Search, Plus } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ParkingManagementPage — Tesla-inspired parking config
// ─────────────────────────────────────────────────────────

type ParkingSlot = {
  id: string
  slotNo: string
  zone: string
  type: 'CAR' | 'BIKE' | 'EV'
  assignedTo: string
  vehicle: string
  status: 'ASSIGNED' | 'AVAILABLE' | 'GUEST'
}

const MOCK_SLOTS: ParkingSlot[] = [
  { id: 'p1', slotNo: 'B1-001', zone: 'Basement 1', type: 'CAR', assignedTo: 'A-101 Rajesh', vehicle: 'KA-01-AB-1234', status: 'ASSIGNED' },
  { id: 'p2', slotNo: 'B1-002', zone: 'Basement 1', type: 'CAR', assignedTo: 'A-201 Priya', vehicle: 'KA-05-CD-5678', status: 'ASSIGNED' },
  { id: 'p3', slotNo: 'B1-003', zone: 'Basement 1', type: 'EV', assignedTo: '—', vehicle: '—', status: 'AVAILABLE' },
  { id: 'p4', slotNo: 'B2-010', zone: 'Basement 2', type: 'CAR', assignedTo: 'Guest', vehicle: 'AP-09-XY-9999', status: 'GUEST' },
  { id: 'p5', slotNo: 'B2-011', zone: 'Basement 2', type: 'BIKE', assignedTo: 'C-102 David', vehicle: 'KA-03-EF-1111', status: 'ASSIGNED' },
  { id: 'p6', slotNo: 'B2-012', zone: 'Basement 2', type: 'CAR', assignedTo: '—', vehicle: '—', status: 'AVAILABLE' },
]

const STATUS_MAP: Record<string, 'success' | 'warning' | 'neutral'> = { ASSIGNED: 'success', AVAILABLE: 'neutral', GUEST: 'warning' }

export default function ParkingManagementPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_SLOTS.filter(s =>
    s.slotNo.toLowerCase().includes(search.toLowerCase()) ||
    s.assignedTo.toLowerCase().includes(search.toLowerCase()) ||
    s.vehicle.toLowerCase().includes(search.toLowerCase())
  )

  const totalSlots = MOCK_SLOTS.length
  const assigned = MOCK_SLOTS.filter(s => s.status === 'ASSIGNED').length
  const evSlots = MOCK_SLOTS.filter(s => s.type === 'EV').length

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Parking management</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Assigned slots, EV bays, and guest parking configuration.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total slots', value: totalSlots, icon: <Car size={18} /> },
          { label: 'Assigned', value: assigned, icon: <Car size={18} /> },
          { label: 'Available', value: totalSlots - assigned, icon: <Car size={18} /> },
          { label: 'EV bays', value: evSlots, icon: <Zap size={18} /> },
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 flex items-center gap-3" style={{ background: 'var(--color-white)' }}>
            <div className="w-10 h-10 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>{s.icon}</div>
            <div>
              <p className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input type="text" placeholder="Search slot, flat, or vehicle..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
          <button className="ml-auto px-4 py-2 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0" style={{ background: 'var(--color-electric-blue)' }}>
            <Plus size={16} /> Assign slot
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['Slot', 'Zone', 'Type', 'Assigned to', 'Vehicle', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{s.slotNo}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{s.zone}</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-0.5 rounded-[4px] text-xs font-medium" style={{
                      background: s.type === 'EV' ? '#10b98114' : 'var(--color-light-ash)',
                      color: s.type === 'EV' ? '#10b981' : 'var(--color-body)',
                    }}>{s.type}</span>
                  </td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-heading)' }}>{s.assignedTo}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--color-tertiary)' }}>{s.vehicle}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_MAP[s.status]}>{s.status.toLowerCase()}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
