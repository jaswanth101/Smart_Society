import { useState } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Plus, Camera, Clock, AlertCircle, CheckCircle } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ResidentComplaintsPage — Raise & track helpdesk tickets
// ─────────────────────────────────────────────────────────

type Ticket = { id: string; title: string; category: string; status: 'OPEN' | 'IN_PROGRESS' | 'RESOLVED'; createdAt: string; sla: string }

const MOCK: Ticket[] = [
  { id: 'TK-0042', title: 'Geyser not working — bathroom 2', category: 'Plumbing', status: 'IN_PROGRESS', createdAt: 'Yesterday', sla: '2 hrs left' },
  { id: 'TK-0038', title: 'Broken window latch — bedroom', category: 'General', status: 'OPEN', createdAt: '3 days ago', sla: 'SLA breached' },
  { id: 'TK-0010', title: 'Lift B stuck between floors', category: 'Electrical', status: 'RESOLVED', createdAt: '2 weeks ago', sla: 'Completed' },
]

const STATUS_MAP: Record<string, 'warning' | 'neutral' | 'success'> = { OPEN: 'neutral', IN_PROGRESS: 'warning', RESOLVED: 'success' }

export default function ResidentComplaintsPage() {
  return (
    <ResidentLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Helpdesk</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Raise tickets, upload photos, and track resolution.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> New ticket
        </button>
      </div>

      <div className="space-y-4">
        {MOCK.map(t => (
          <Card key={t.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms] cursor-pointer">
            <div className="flex items-start justify-between gap-3 mb-2">
              <Badge variant={STATUS_MAP[t.status]}>{t.status.toLowerCase().replace('_', ' ')}</Badge>
              <span className="text-[11px]" style={{ color: 'var(--color-placeholder)' }}>{t.id}</span>
            </div>
            <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-heading)' }}>{t.title}</h3>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--color-tertiary)' }}>
              <Badge variant="neutral">{t.category}</Badge>
              <span className="flex items-center gap-1"><Clock size={10} />{t.createdAt}</span>
              <span className="font-medium" style={{ color: t.sla.includes('breached') ? 'var(--color-danger)' : 'var(--color-body)' }}>{t.sla}</span>
            </div>
          </Card>
        ))}
      </div>
    </ResidentLayout>
  )
}
