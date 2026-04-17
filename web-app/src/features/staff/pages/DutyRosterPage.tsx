import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Clock, Users } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// DutyRosterPage — Tesla-inspired shift planning
// ─────────────────────────────────────────────────────────

type Shift = { id: string; name: string; role: string; day: string; time: string; zone: string; status: 'PRESENT' | 'ABSENT' | 'LATE' | 'UPCOMING' }

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const MOCK_ROSTER: Shift[] = [
  { id: 'r1', name: 'Ramesh Kumar', role: 'Guard', day: 'Mon', time: '6AM–6PM', zone: 'Main gate', status: 'PRESENT' },
  { id: 'r2', name: 'Ahmed Khan', role: 'Guard', day: 'Mon', time: '6PM–6AM', zone: 'Main gate', status: 'UPCOMING' },
  { id: 'r3', name: 'Sunita Devi', role: 'Cleaning', day: 'Mon', time: '6AM–2PM', zone: 'Tower A', status: 'PRESENT' },
  { id: 'r4', name: 'Vikram Singh', role: 'Electrician', day: 'Mon', time: '9AM–6PM', zone: 'All zones', status: 'ABSENT' },
  { id: 'r5', name: 'Lakshmi Bai', role: 'Gardener', day: 'Mon', time: '6AM–12PM', zone: 'Landscape', status: 'LATE' },
  { id: 'r6', name: 'Ramesh Kumar', role: 'Guard', day: 'Tue', time: '6AM–6PM', zone: 'Main gate', status: 'UPCOMING' },
  { id: 'r7', name: 'Sunita Devi', role: 'Cleaning', day: 'Tue', time: '6AM–2PM', zone: 'Tower B', status: 'UPCOMING' },
]

const STATUS_MAP: Record<string, 'success' | 'danger' | 'warning' | 'neutral'> = { PRESENT: 'success', ABSENT: 'danger', LATE: 'warning', UPCOMING: 'neutral' }

export default function DutyRosterPage() {
  const [selectedDay, setSelectedDay] = useState('Mon')

  const filtered = MOCK_ROSTER.filter(r => r.day === selectedDay)

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Duty roster</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Shift planning, attendance tracking, and zone assignments.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'On duty today', value: '14', icon: <Users size={18} /> },
          { label: 'Absent', value: '2', icon: <Clock size={18} /> },
          { label: 'Late arrivals', value: '1', icon: <Clock size={18} /> },
          { label: 'Open shifts', value: '3', icon: <Calendar size={18} /> },
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

      {/* Day selector */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {DAYS.map(d => (
          <button
            key={d}
            onClick={() => setSelectedDay(d)}
            className="px-5 py-2.5 rounded-[4px] text-sm font-medium transition-colors duration-[330ms] shrink-0"
            style={{
              background: selectedDay === d ? 'var(--color-electric-blue)' : 'var(--color-white)',
              color: selectedDay === d ? 'white' : 'var(--color-body)',
            }}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Roster */}
      <Card title={`${selectedDay} schedule`} subtitle={`${filtered.length} shifts assigned`}>
        <div className="space-y-0 mt-2">
          {filtered.map(r => (
            <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] flex items-center justify-center text-white text-xs font-medium shrink-0" style={{ background: 'var(--color-electric-blue)' }}>
                  {r.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{r.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{r.role} · {r.zone}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-xs font-medium px-2 py-1 rounded-[4px]" style={{ background: 'var(--color-light-ash)', color: 'var(--color-body)' }}>
                  <Clock size={12} className="inline mr-1" />{r.time}
                </span>
                <Badge variant={STATUS_MAP[r.status]}>{r.status.toLowerCase()}</Badge>
              </div>
            </div>
          ))}
          {filtered.length === 0 && (
            <p className="text-sm py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No shifts scheduled for {selectedDay}.</p>
          )}
        </div>
      </Card>
    </DashboardLayout>
  )
}
