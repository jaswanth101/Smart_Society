import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText, Pin, Clock } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ResidentNoticesPage — Society notice board
// ─────────────────────────────────────────────────────────

const MOCK = [
  { id: 'n1', title: 'AGM meeting — April 30, 2026', body: 'All flat owners are requested to attend. Quorum requires 50%.', author: 'President', pinned: true, time: '2 hours ago' },
  { id: 'n2', title: 'Scheduled power cut — Tower B', body: 'Bescom maintenance from 2 PM to 5 PM tomorrow.', author: 'Secretary', pinned: false, time: '1 day ago' },
  { id: 'n3', title: 'Swimming pool closed for cleaning', body: 'Pool closed April 20–22 for deep cleaning.', author: 'Supervisor', pinned: false, time: '3 days ago' },
  { id: 'n4', title: 'New RFID cards available', body: 'Collect replacement cards from management office 10 AM–1 PM.', author: 'Secretary', pinned: false, time: '1 week ago' },
]

export default function ResidentNoticesPage() {
  return (
    <ResidentLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Notices</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Society circulars, documents, and announcements.</p>
      </div>

      <div className="space-y-4">
        {MOCK.map(n => (
          <Card key={n.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms] cursor-pointer">
            <div className="flex items-start gap-3 mb-2">
              {n.pinned && <Pin size={14} style={{ color: 'var(--color-electric-blue)' }} />}
              <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--color-placeholder)' }}><Clock size={10} />{n.time}</span>
            </div>
            <h3 className="text-[17px] font-medium mb-1" style={{ color: 'var(--color-heading)' }}>{n.title}</h3>
            <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--color-tertiary)' }}>{n.body}</p>
            <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>By {n.author}</p>
          </Card>
        ))}
      </div>
    </ResidentLayout>
  )
}
