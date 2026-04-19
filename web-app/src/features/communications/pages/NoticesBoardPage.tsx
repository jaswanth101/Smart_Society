import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { FileText, Plus, Pin, Clock, Search } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { AddNoticeModal } from '../components/AddNoticeModal'

// ─────────────────────────────────────────────────────────
// NoticesBoardPage — Tesla-inspired notice manager
// ─────────────────────────────────────────────────────────

export default function NoticesBoardPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [notices, setNotices] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)

  const fetchNotices = async () => {
    try {
      if (!tenantId) return
      const { data } = await apiClient.get('/communications/notices')
      setNotices(data)
    } catch (e) {
      console.error('Fetch notices failed', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotices()
  }, [tenantId])


  const filtered = notices.filter(n =>
    n.title?.toLowerCase().includes(search.toLowerCase()) || n.category?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Notice board</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Publish circulars, announcements, and scheduled notices.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> Publish notice
        </button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm mb-6">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
        <input type="text" placeholder="Search notices by title or category..." value={search} onChange={e => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
      </div>

      {/* Notices */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading notices...</p>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-slate-500">No notices published yet.</p>
        ) : (
          filtered.map(n => (
            <Card key={n.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms] cursor-pointer">
              <div className="flex items-start justify-between gap-4 mb-2">
                <div className="flex items-center gap-2">
                  {n.isPinned && <Pin size={14} style={{ color: 'var(--color-electric-blue)' }} />}
                  <Badge variant="neutral">{n.category}</Badge>
                </div>
                <span className="text-[11px] shrink-0 flex items-center gap-1" style={{ color: 'var(--color-placeholder)' }}>
                  <Clock size={10} />{new Date(n.createdAt).toLocaleDateString()}
                </span>
              </div>
              <h3 className="text-[17px] font-medium mb-2" style={{ color: 'var(--color-heading)' }}>{n.title}</h3>
              <p className="text-sm leading-relaxed line-clamp-2 mb-3" style={{ color: 'var(--color-tertiary)' }}>{n.body}</p>
              <div className="flex items-center justify-between text-xs" style={{ color: 'var(--color-placeholder)' }}>
                <span>By {n.authorName}</span>
                <span>Views: {n.readCount}</span>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Add Notice Modal */}
      <AddNoticeModal 
        isOpen={showModal} 
        onClose={() => setShowModal(false)} 
        onSuccess={fetchNotices} 
      />

    </DashboardLayout>
  )
}
