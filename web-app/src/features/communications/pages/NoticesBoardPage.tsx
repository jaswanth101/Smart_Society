import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { FileText, Plus, Pin, Clock, Search } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// NoticesBoardPage — Tesla-inspired notice manager
// ─────────────────────────────────────────────────────────

type Notice = {
  id: string
  title: string
  body: string
  author: string
  category: string
  pinned: boolean
  readCount: number
  totalRecipients: number
  createdAt: string
}

const MOCK_NOTICES: Notice[] = [
  { id: 'n1', title: 'AGM meeting — April 30, 2026', body: 'All flat owners are requested to attend the Annual General Meeting at the community hall. Quorum requires 50% attendance.', author: 'President', category: 'AGM', pinned: true, readCount: 312, totalRecipients: 486, createdAt: '2 hours ago' },
  { id: 'n2', title: 'Scheduled power cut — Tower B', body: 'Bescom maintenance from 2 PM to 5 PM tomorrow. DG backup will be available for essential services.', author: 'Secretary', category: 'Maintenance', pinned: false, readCount: 189, totalRecipients: 486, createdAt: '1 day ago' },
  { id: 'n3', title: 'Swimming pool closed for cleaning', body: 'The pool will be closed from April 20–22 for deep cleaning and water treatment. We apologize for the inconvenience.', author: 'Supervisor', category: 'Amenity', pinned: false, readCount: 256, totalRecipients: 486, createdAt: '3 days ago' },
  { id: 'n4', title: 'New RFID cards — collect from office', body: 'Residents who applied for replacement RFID cards can collect them from the management office between 10 AM–1 PM.', author: 'Secretary', category: 'General', pinned: false, readCount: 98, totalRecipients: 486, createdAt: '1 week ago' },
]

export default function NoticesBoardPage() {
  const [search, setSearch] = useState('')

  const filtered = MOCK_NOTICES.filter(n =>
    n.title.toLowerCase().includes(search.toLowerCase()) || n.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Notice board</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Publish circulars, announcements, and scheduled notices.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> New notice
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
        <input type="text" placeholder="Search notices..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
      </div>

      {/* Notices */}
      <div className="space-y-4">
        {filtered.map(n => (
          <Card key={n.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms] cursor-pointer">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex items-center gap-2">
                {n.pinned && <Pin size={14} style={{ color: 'var(--color-electric-blue)' }} />}
                <Badge variant="neutral">{n.category}</Badge>
              </div>
              <span className="text-[11px] shrink-0 flex items-center gap-1" style={{ color: 'var(--color-placeholder)' }}>
                <Clock size={10} />{n.createdAt}
              </span>
            </div>
            <h3 className="text-[17px] font-medium mb-2" style={{ color: 'var(--color-heading)' }}>{n.title}</h3>
            <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--color-tertiary)' }}>{n.body}</p>
            <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-placeholder)' }}>
              <span>By {n.author}</span>
              <span>Read by {n.readCount}/{n.totalRecipients} ({Math.round(n.readCount / n.totalRecipients * 100)}%)</span>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
