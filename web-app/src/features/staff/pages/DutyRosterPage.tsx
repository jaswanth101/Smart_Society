import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Calendar, Clock, Users, AlertCircle, RefreshCcw } from 'lucide-react'
import { useApiQuery } from '@/hooks/useApiQuery'
import type { RosterEntry, AttendanceSummary } from '@/types/api-contracts'

// ─────────────────────────────────────────────────────────
// DutyRosterPage — Live attendance from backend
// ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, 'success' | 'danger' | 'warning' | 'neutral'> = {
  PRESENT: 'success', ABSENT: 'danger', LATE: 'warning', UPCOMING: 'neutral',
}

export default function DutyRosterPage() {
  const { data: roster, isLoading: rosterLoading, error: rosterError, refetch: refetchRoster } = useApiQuery<RosterEntry[]>('/staff/roster')
  const { data: summary, isLoading: summaryLoading } = useApiQuery<AttendanceSummary>('/staff/roster/summary')

  const list = roster ?? []
  const sum = summary ?? { totalStaff: 0, onDuty: 0, absent: 0, late: 0, notLoggedYet: 0 }

  // ── Loading ─────────────────────────────────────────────
  if (rosterLoading || summaryLoading) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <div className="h-10 w-56 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-3" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-[12px] animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-16 bg-gray-200 rounded-[8px] animate-pulse" />
          ))}
        </div>
      </DashboardLayout>
    )
  }

  // ── Error ───────────────────────────────────────────────
  if (rosterError) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Duty roster</h1>
        </div>
        <Card className="text-center py-12">
          <AlertCircle className="mx-auto mb-3" size={32} style={{ color: 'var(--color-danger)' }} />
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-heading)' }}>Failed to load roster</p>
          <p className="text-xs mb-4" style={{ color: 'var(--color-tertiary)' }}>{rosterError}</p>
          <Button onClick={refetchRoster} variant="primary" size="sm">Retry</Button>
        </Card>
      </DashboardLayout>
    )
  }

  // Group roster by shift type
  const byShift = list.reduce<Record<string, RosterEntry[]>>((acc, entry) => {
    const key = `${entry.shift} — ${entry.shiftTime}`
    if (!acc[key]) acc[key] = []
    acc[key].push(entry)
    return acc
  }, {})

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Duty roster</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>
            Today's shift planning, attendance tracking, and zone assignments.
          </p>
        </div>
        <button onClick={refetchRoster} className="p-2.5 rounded-[4px] transition-colors hover:bg-[#F4F4F4] shrink-0" style={{ color: 'var(--color-tertiary)' }}>
          <RefreshCcw size={16} />
        </button>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'On duty today', value: sum.onDuty.toString(), icon: <Users size={18} /> },
          { label: 'Absent', value: sum.absent.toString(), icon: <Clock size={18} /> },
          { label: 'Late arrivals', value: sum.late.toString(), icon: <Clock size={18} /> },
          { label: 'Not logged yet', value: sum.notLoggedYet.toString(), icon: <Calendar size={18} /> },
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

      {/* Roster grouped by shift */}
      {list.length === 0 ? (
        <Card className="text-center py-16">
          <Users className="mx-auto mb-3 opacity-20" size={32} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>No staff members registered</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>Add staff via the Staff Directory page to see them here.</p>
        </Card>
      ) : (
        <div className="space-y-6">
          {Object.entries(byShift).map(([shiftKey, entries]) => (
            <Card key={shiftKey} title={shiftKey} subtitle={`${entries.length} staff members`}>
              <div className="space-y-0 mt-2">
                {entries.map(r => (
                  <div key={r.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-[4px] flex items-center justify-center text-white text-xs font-medium shrink-0" style={{ background: 'var(--color-electric-blue)' }}>
                        {r.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{r.name}</p>
                        <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{r.role} · {r.department}{r.zone ? ` · ${r.zone}` : ''}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xs font-medium px-2 py-1 rounded-[4px]" style={{ background: 'var(--color-light-ash)', color: 'var(--color-body)' }}>
                        <Clock size={12} className="inline mr-1" />{r.shiftTime}
                      </span>
                      <Badge variant={STATUS_MAP[r.status]}>{r.status.toLowerCase()}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      )}
    </DashboardLayout>
  )
}
