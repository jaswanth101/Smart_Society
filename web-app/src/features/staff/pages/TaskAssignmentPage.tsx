import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ClipboardList, Plus, Camera, CheckCircle, Clock, AlertTriangle } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// TaskAssignmentPage — Tesla-inspired task module
// ─────────────────────────────────────────────────────────

type Task = {
  id: string
  title: string
  assignedTo: string
  zone: string
  priority: 'HIGH' | 'MEDIUM' | 'LOW'
  status: 'PENDING' | 'IN_PROGRESS' | 'PHOTO_UPLOADED' | 'COMPLETED'
  createdAt: string
  dueBy: string
}

const MOCK_TASKS: Task[] = [
  { id: 'T-001', title: 'Clean lobby mirrors — Tower A', assignedTo: 'Sunita Devi', zone: 'Tower A', priority: 'MEDIUM', status: 'IN_PROGRESS', createdAt: '10:30 AM', dueBy: '12:00 PM' },
  { id: 'T-002', title: 'Replace broken bulb — Stairwell B3', assignedTo: 'Vikram Singh', zone: 'Tower B', priority: 'HIGH', status: 'PENDING', createdAt: '9:00 AM', dueBy: '11:00 AM' },
  { id: 'T-003', title: 'Trim hedges — front lawn', assignedTo: 'Lakshmi Bai', zone: 'Landscape', priority: 'LOW', status: 'PHOTO_UPLOADED', createdAt: '7:00 AM', dueBy: '1:00 PM' },
  { id: 'T-004', title: 'Fix leaking tap — C-102', assignedTo: 'Vikram Singh', zone: 'Tower C', priority: 'HIGH', status: 'COMPLETED', createdAt: 'Yesterday', dueBy: 'Yesterday' },
]

const STATUS_MAP: Record<string, 'danger' | 'warning' | 'info' | 'success' | 'neutral'> = {
  PENDING: 'neutral', IN_PROGRESS: 'warning', PHOTO_UPLOADED: 'info', COMPLETED: 'success',
}
const PRIORITY_COLOR: Record<string, string> = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#8E8E8E' }

export default function TaskAssignmentPage() {
  const [filter, setFilter] = useState<'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'>('ALL')

  const filtered = filter === 'ALL' ? MOCK_TASKS : MOCK_TASKS.filter(t => t.status === filter)

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Task assignment</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Assign tasks to staff and track photo-verified completions.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> New task
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-[4px] text-sm font-medium transition-colors duration-[330ms] shrink-0"
            style={{
              background: filter === f ? 'var(--color-electric-blue)' : 'var(--color-white)',
              color: filter === f ? 'white' : 'var(--color-body)',
            }}
          >
            {f === 'ALL' ? 'All tasks' : f.toLowerCase().replace('_', ' ')}
          </button>
        ))}
      </div>

      {/* Task cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map(t => (
          <Card key={t.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms] cursor-pointer">
            <div className="flex items-start justify-between gap-3 mb-3">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PRIORITY_COLOR[t.priority] }} />
                <span className="text-xs font-medium" style={{ color: 'var(--color-placeholder)' }}>{t.id}</span>
              </div>
              <Badge variant={STATUS_MAP[t.status]}>{t.status.toLowerCase().replace('_', ' ')}</Badge>
            </div>

            <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-heading)' }}>{t.title}</h3>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs" style={{ color: 'var(--color-tertiary)' }}>
              <span className="flex items-center gap-1"><ClipboardList size={12} />{t.assignedTo}</span>
              <span>{t.zone}</span>
              <span className="flex items-center gap-1"><Clock size={12} />Due: {t.dueBy}</span>
            </div>

            {t.status === 'PHOTO_UPLOADED' && (
              <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-[4px] text-xs font-medium" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>
                <Camera size={14} /> Photo proof uploaded — awaiting verification
              </div>
            )}
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-16">
          <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No tasks match this filter.</p>
        </div>
      )}
    </DashboardLayout>
  )
}
