import { useState } from 'react'
import { Loader2, X } from 'lucide-react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useApiMutation } from '@/hooks/useApiMutation'
import type { TaskRecord, CreateTaskPayload, StaffMemberRecord } from '@/types/api-contracts'

// ─────────────────────────────────────────────────────────
// CreateTaskModal — Validated form with staff dropdown
// ─────────────────────────────────────────────────────────

interface Props {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const

export function CreateTaskModal({ isOpen, onClose, onSuccess }: Props) {
  const [form, setForm] = useState<CreateTaskPayload>({ title: '' })
  const [error, setError] = useState('')

  const { data: staffList } = useApiQuery<StaffMemberRecord[]>('/staff')
  const { mutate, isLoading } = useApiMutation<TaskRecord, CreateTaskPayload>(
    '/staff/tasks', 'POST', {
      onSuccess: () => { setForm({ title: '' }); setError(''); onSuccess(); onClose() },
      onError: (err) => setError(err),
    }
  )

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) { setError('Task title is required'); return }
    setError('')
    mutate(form)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.4)' }} onClick={onClose}>
      <div className="w-full max-w-lg rounded-[12px] p-6 shadow-xl" style={{ background: 'var(--color-white)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-medium" style={{ color: 'var(--color-heading)' }}>Create new task</h2>
          <button onClick={onClose} className="p-1 rounded hover:bg-[#F4F4F4] transition-colors"><X size={18} style={{ color: 'var(--color-tertiary)' }} /></button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div>
            <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-tertiary)' }}>Task title *</label>
            <input type="text" placeholder="Clean lobby mirrors — Tower A" value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>

          {/* Zone + Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-tertiary)' }}>Zone</label>
              <input type="text" placeholder="Tower A" value={form.zone || ''}
                onChange={e => setForm(f => ({ ...f, zone: e.target.value || undefined }))}
                className="w-full px-3 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-tertiary)' }}>Priority</label>
              <select value={form.priority || 'MEDIUM'}
                onChange={e => setForm(f => ({ ...f, priority: e.target.value as CreateTaskPayload['priority'] }))}
                className="w-full px-3 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
              </select>
            </div>
          </div>

          {/* Assignee + Due Date */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-tertiary)' }}>Assign to</label>
              <select value={form.staffId || ''}
                onChange={e => setForm(f => ({ ...f, staffId: e.target.value || undefined }))}
                className="w-full px-3 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}>
                <option value="">Unassigned</option>
                {(staffList ?? []).filter(s => s.isActive).map(s => (
                  <option key={s.id} value={s.id}>{s.name} — {s.role}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-tertiary)' }}>Due by</label>
              <input type="datetime-local" value={form.dueBy ? form.dueBy.slice(0, 16) : ''}
                onChange={e => setForm(f => ({ ...f, dueBy: e.target.value ? new Date(e.target.value).toISOString() : undefined }))}
                className="w-full px-3 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="px-3 py-2 rounded-[4px] text-xs font-medium" style={{ background: '#ef444414', color: '#ef4444' }}>
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 pt-2">
            <button type="submit" disabled={isLoading || !form.title.trim()}
              className="px-5 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 disabled:opacity-50"
              style={{ background: 'var(--color-electric-blue)' }}>
              {isLoading ? <><Loader2 size={14} className="animate-spin" /> Creating…</> : 'Create task'}
            </button>
            <button type="button" onClick={onClose} className="px-4 py-2.5 text-sm font-medium rounded-[4px]" style={{ color: 'var(--color-body)' }}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
