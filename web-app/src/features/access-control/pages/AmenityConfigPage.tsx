import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Dumbbell, Waves, Film, Gamepad2, Settings, Lock } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// AmenityConfigPage — Tesla-inspired amenity management
// ─────────────────────────────────────────────────────────

type Amenity = {
  id: string; name: string; icon: React.ReactNode; maxCapacity: number
  quotaPerWeek: number; timings: string; rfidRequired: boolean
  status: 'ACTIVE' | 'MAINTENANCE' | 'BLOCKED'
}

const MOCK_AMENITIES: Amenity[] = [
  { id: 'a1', name: 'Swimming pool', icon: <Waves size={20} />, maxCapacity: 30, quotaPerWeek: 3, timings: '6AM–10AM, 4PM–8PM', rfidRequired: true, status: 'ACTIVE' },
  { id: 'a2', name: 'Gym', icon: <Dumbbell size={20} />, maxCapacity: 20, quotaPerWeek: 7, timings: '5AM–10PM', rfidRequired: true, status: 'ACTIVE' },
  { id: 'a3', name: 'Community hall', icon: <Film size={20} />, maxCapacity: 200, quotaPerWeek: 1, timings: 'By booking only', rfidRequired: false, status: 'ACTIVE' },
  { id: 'a4', name: 'Games room', icon: <Gamepad2 size={20} />, maxCapacity: 12, quotaPerWeek: 5, timings: '10AM–9PM', rfidRequired: true, status: 'MAINTENANCE' },
]

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { ACTIVE: 'success', MAINTENANCE: 'warning', BLOCKED: 'danger' }

export default function AmenityConfigPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Amenity configuration</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Manage time limits, quotas, RFID access, and maintenance blocks.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {MOCK_AMENITIES.map(a => (
          <Card key={a.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms]">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>
                  {a.icon}
                </div>
                <div>
                  <h3 className="text-[17px] font-medium" style={{ color: 'var(--color-heading)' }}>{a.name}</h3>
                  <Badge variant={STATUS_MAP[a.status]}>{a.status.toLowerCase()}</Badge>
                </div>
              </div>
              <button className="p-1.5 rounded-[4px]" style={{ color: 'var(--color-tertiary)' }}><Settings size={16} /></button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              {[
                { label: 'Max capacity', value: `${a.maxCapacity} persons` },
                { label: 'Weekly quota', value: `${a.quotaPerWeek} sessions` },
                { label: 'Timings', value: a.timings },
                { label: 'RFID gate', value: a.rfidRequired ? 'Required' : 'Not required' },
              ].map(d => (
                <div key={d.label} className="p-3 rounded-[4px]" style={{ background: 'var(--color-light-ash)' }}>
                  <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--color-placeholder)' }}>{d.label}</p>
                  <p className="font-medium text-xs" style={{ color: 'var(--color-heading)' }}>{d.value}</p>
                </div>
              ))}
            </div>

            {a.status === 'ACTIVE' && (
              <button className="mt-4 w-full py-2 rounded-[4px] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-[330ms]"
                style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-danger)' }}>
                <Lock size={12} /> Block amenity
              </button>
            )}
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
