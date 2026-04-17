import { useState } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Plus, QrCode, Clock, User, Phone } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ResidentVisitorsPage — Pre-approve visitors, generate QR
// ─────────────────────────────────────────────────────────

type Visit = { id: string; name: string; purpose: string; date: string; time: string; status: 'UPCOMING' | 'CHECKED_IN' | 'COMPLETED' | 'EXPIRED' }
const MOCK: Visit[] = [
  { id: 'v1', name: 'Delivery — Amazon', purpose: 'Parcel drop', date: 'Today', time: '2:00 PM', status: 'UPCOMING' },
  { id: 'v2', name: 'Ramesh (In-laws)', purpose: 'Family visit', date: 'Today', time: '10:00 AM', status: 'CHECKED_IN' },
  { id: 'v3', name: 'Plumber — Ravi', purpose: 'Repair', date: 'Yesterday', time: '3:00 PM', status: 'COMPLETED' },
]
const STATUS_MAP: Record<string, 'neutral' | 'warning' | 'success'> = { UPCOMING: 'neutral', CHECKED_IN: 'warning', COMPLETED: 'success', EXPIRED: 'danger' as any }

export default function ResidentVisitorsPage() {
  return (
    <ResidentLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Visitors</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Generate passes, pre-approve guests, and view history.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <QrCode size={16} /> Generate pass
        </button>
      </div>

      <div className="space-y-4">
        {MOCK.map(v => (
          <Card key={v.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}><User size={18} /></div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{v.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{v.purpose} · {v.date}, {v.time}</p>
                </div>
              </div>
              <Badge variant={STATUS_MAP[v.status]}>{v.status.toLowerCase().replace('_', ' ')}</Badge>
            </div>
          </Card>
        ))}
      </div>
    </ResidentLayout>
  )
}
