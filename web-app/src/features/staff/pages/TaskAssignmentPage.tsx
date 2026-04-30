import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { ClipboardList, Plus, Camera, Clock, AlertCircle, Loader2, RefreshCcw } from 'lucide-react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { formatRelativeTime } from '@/lib/format'
import { CreateTaskModal } from '../components/CreateTaskModal'
import type { TaskRecord } from '@/types/api-contracts'

// ─────────────────────────────────────────────────────────
// TaskAssignmentPage — Live API + Create Task Flow
// ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, 'danger' | 'warning' | 'info' | 'success' | 'neutral'> = {
  PENDING: 'neutral', IN_PROGRESS: 'warning', PHOTO_UPLOADED: 'info', COMPLETED: 'success',
}
const PRIORITY_COLOR: Record<string, string> = { HIGH: '#ef4444', MEDIUM: '#f59e0b', LOW: '#8E8E8E', CRITICAL: '#dc2626' }

type FilterType = 'ALL' | 'PENDING' | 'IN_PROGRESS' | 'COMPLETED'

export default function TaskAssignmentPage() {
  const [filter, setFilter] = useState<FilterType>('ALL')
  const [isCreateOpen, setIsCreateOpen] = useState(false)

  const { data: tasks, isLoading, error, refetch } = useApiQuery<TaskRecord[]>('/staff/tasks')

  const list = tasks ?? []
  const filtered = filter === 'ALL' ? list : list.filter(t => t.status === filter)

  // ── Loading ─────────────────────────────────────────────
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-3" />
        </div>
        <div className="flex gap-2 mb-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-9 w-24 bg-gray-200 rounded-[4px] animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-[12px] animate-pulse" />
          ))}
        </div>
      </DashboardLayout>
    )
  }

  // ── Error ───────────────────────────────────────────────
  if (error) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Task assignment</h1>
        </div>
        <Card className="text-center py-12">
          <AlertCircle className="mx-auto mb-3" size={32} style={{ color: 'var(--color-danger)' }} />
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-heading)' }}>Failed to load tasks</p>
          <p className="text-xs mb-4" style={{ color: 'var(--color-tertiary)' }}>{error}</p>
          <Button onClick={refetch} variant="primary" size="sm">Retry</Button>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Task assignment</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>
            {list.length} tasks · {list.filter(t => t.status === 'PENDING').length} pending · {list.filter(t => t.status === 'COMPLETED').length} completed
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={refetch} className="p-2.5 rounded-[4px] transition-colors hover:bg-[#F4F4F4]" style={{ color: 'var(--color-tertiary)' }}>
            <RefreshCcw size={16} />
          </button>
          <button onClick={() => setIsCreateOpen(true)} className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5" style={{ background: 'var(--color-electric-blue)' }}>
            <Plus size={16} /> New task
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {(['ALL', 'PENDING', 'IN_PROGRESS', 'COMPLETED'] as FilterType[]).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-2 rounded-[4px] text-sm font-medium transition-colors duration-[330ms] shrink-0"
            style={{
              background: filter === f ? 'var(--color-electric-blue)' : 'var(--color-white)',
              color: filter === f ? 'white' : 'var(--color-body)',
            }}
          >
            {f === 'ALL' ? `All tasks (${list.length})` : `${f.toLowerCase().replace('_', ' ')} (${list.filter(t => t.status === f).length})`}
          </button>
        ))}
      </div>

      {/* Task cards */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <ClipboardList className="mx-auto mb-3 opacity-20" size={32} />
          <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>
            {list.length === 0 ? 'No tasks created yet' : 'No tasks match this filter'}
          </p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>
            {list.length === 0 ? 'Click "New task" to create your first work order.' : 'Try a different filter.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map(t => (
            <Card key={t.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms] cursor-pointer">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ background: PRIORITY_COLOR[t.priority] }} />
                  <span className="text-xs font-medium" style={{ color: 'var(--color-placeholder)' }}>{t.priority}</span>
                </div>
                <Badge variant={STATUS_MAP[t.status]}>{t.status.toLowerCase().replace('_', ' ')}</Badge>
              </div>

              <h3 className="text-sm font-medium mb-3" style={{ color: 'var(--color-heading)' }}>{t.title}</h3>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs" style={{ color: 'var(--color-tertiary)' }}>
                <span className="flex items-center gap-1">
                  <ClipboardList size={12} />{t.staff?.name || 'Unassigned'}
                </span>
                {t.zone && <span>{t.zone}</span>}
                {t.dueBy && (
                  <span className="flex items-center gap-1">
                    <Clock size={12} />Due: {new Date(t.dueBy).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                  </span>
                )}
                <span className="flex items-center gap-1">
                  <Clock size={12} />{formatRelativeTime(t.createdAt)}
                </span>
              </div>

              {t.status === 'PHOTO_UPLOADED' && (
                <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-[4px] text-xs font-medium" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>
                  <Camera size={14} /> Photo proof uploaded — awaiting verification
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      {/* Create Task Modal */}
      <CreateTaskModal isOpen={isCreateOpen} onClose={() => setIsCreateOpen(false)} onSuccess={refetch} />
    </DashboardLayout>
  )
}
