import { useState, useEffect } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Plus, Clock, AlertCircle, CheckCircle } from 'lucide-react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// ResidentComplaintsPage — Live helpdesk tickets
// ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, 'warning' | 'neutral' | 'success' | 'danger'> = {
  PENDING: 'neutral', ASSIGNED: 'neutral', IN_PROGRESS: 'warning', RESOLVED: 'success', CLOSED: 'success', ESCALATED: 'danger'
}

export default function ResidentComplaintsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({ title: '', description: '', category: 'Plumbing' })

  const fetchTickets = () => {
    setLoading(true)
    apiClient.get('/complaints')
      .then(res => setTickets(res.data))
      .catch(err => console.error('Failed to load tickets', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      await apiClient.post('/complaints', form)
      setModalOpen(false)
      setForm({ title: '', description: '', category: 'Plumbing' })
      fetchTickets()
    } catch (err) {
      console.error('Failed to create ticket', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <ResidentLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Helpdesk</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Raise tickets, upload photos, and track resolution.</p>
        </div>
        <button onClick={() => setModalOpen(true)} className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> New ticket
        </button>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-md" noPadding={false}>
            <div className="p-6">
              <h2 className="text-xl font-medium mb-4" style={{ color: 'var(--color-heading)' }}>Raise a Helpdesk Ticket</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Issue Title</label>
                  <input required className="w-full border rounded-[4px] p-2.5 text-sm outline-none focus:border-blue-500" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} placeholder="e.g. Broken elevator" />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Category</label>
                  <select className="w-full border rounded-[4px] p-2.5 text-sm outline-none focus:border-blue-500" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}>
                    <option>Plumbing</option>
                    <option>Electrical</option>
                    <option>Cleaning</option>
                    <option>Security</option>
                    <option>Elevator</option>
                    <option>Other</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
                  <textarea required className="w-full border rounded-[4px] p-2.5 text-sm outline-none focus:border-blue-500" rows={4} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} placeholder="Provide specific details..." />
                </div>
                <div className="flex justify-end gap-3 mt-6">
                  <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2.5 text-sm text-gray-600 font-medium rounded-[4px] hover:bg-gray-100">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2.5 text-sm text-white rounded-[4px] font-medium disabled:opacity-50" style={{ background: 'var(--color-electric-blue)' }}>
                    {submitting ? 'Submitting...' : 'Submit Ticket'}
                  </button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-[8px] animate-pulse" />)}</div>
      ) : tickets.length === 0 ? (
        <div className="py-16 text-center">
          <CheckCircle size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No tickets raised yet. Everything looks great!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {tickets.map((t: any) => (
            <Card key={t.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms] cursor-pointer">
              <div className="flex items-start justify-between gap-3 mb-2">
                <Badge variant={STATUS_MAP[t.status] || 'neutral'}>{t.status?.toLowerCase().replace('_', ' ')}</Badge>
                <span className="text-[11px]" style={{ color: 'var(--color-placeholder)' }}>{t.ticketId || t.id?.slice(0, 8)}</span>
              </div>
              <h3 className="text-sm font-medium mb-2" style={{ color: 'var(--color-heading)' }}>{t.description || t.category}</h3>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--color-tertiary)' }}>
                <Badge variant="neutral">{t.category}</Badge>
                <span className="flex items-center gap-1"><Clock size={10} />{new Date(t.createdAt).toLocaleDateString()}</span>
                {t.slaDeadline && (
                  <span className="font-medium" style={{ color: new Date(t.slaDeadline) < new Date() ? 'var(--color-danger)' : 'var(--color-body)' }}>
                    {new Date(t.slaDeadline) < new Date() ? 'SLA breached' : `SLA: ${new Date(t.slaDeadline).toLocaleDateString()}`}
                  </span>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </ResidentLayout>
  )
}
