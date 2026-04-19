import { useState, useEffect } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { QrCode, User, ShieldCheck } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { AddVisitorModal } from '@/features/access-control/components/AddVisitorModal'

// ─────────────────────────────────────────────────────────
// ResidentVisitorsPage — Live visitor data from PostgreSQL
// ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, 'neutral' | 'warning' | 'success' | 'info'> = {
  UPCOMING: 'neutral', CHECKED_IN: 'warning', COMPLETED: 'success', EXPIRED: 'info'
}

export default function ResidentVisitorsPage() {
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchVisitors = () => {
    apiClient.get('/visitors')
      .then(res => setVisitors(res.data))
      .catch(err => console.error('Failed to load visitors', err))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchVisitors() }, [])

  return (
    <ResidentLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Visitors</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Generate passes, pre-approve guests, and view history.</p>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <QrCode size={16} /> Generate pass
        </button>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-[8px] animate-pulse" />)}</div>
      ) : visitors.length === 0 ? (
        <div className="py-16 text-center">
          <ShieldCheck size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No visitors in history. Generate a pass to get started.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {visitors.map((v: any) => (
            <Card key={v.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms]">
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}><User size={18} /></div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{v.name}</p>
                    <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>
                      {v.purpose} · {new Date(v.scheduledAt).toLocaleString([], { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                    {v.qrCode && <p className="text-[11px] font-mono mt-0.5" style={{ color: 'var(--color-placeholder)' }}>Pass: {v.qrCode.split('-')[0].toUpperCase()}</p>}
                  </div>
                </div>
                <Badge variant={STATUS_MAP[v.status] || 'neutral'}>{v.status?.toLowerCase().replace('_', ' ')}</Badge>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AddVisitorModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSuccess={fetchVisitors} />
    </ResidentLayout>
  )
}
