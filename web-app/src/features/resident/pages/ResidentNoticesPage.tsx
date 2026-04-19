import { useState, useEffect } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Pin, Clock, FileText } from 'lucide-react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// ResidentNoticesPage — Live notices from PostgreSQL
// ─────────────────────────────────────────────────────────

export default function ResidentNoticesPage() {
  const [notices, setNotices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/communications/notices')
      .then(res => setNotices(res.data))
      .catch(err => console.error('Failed to load notices', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ResidentLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Notices</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Society circulars, documents, and announcements.</p>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-24 bg-gray-200 rounded-[8px] animate-pulse" />)}</div>
      ) : notices.length === 0 ? (
        <div className="py-16 text-center">
          <FileText size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No notices posted yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {notices.map((n: any) => (
            <Card key={n.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms] cursor-pointer">
              <div className="flex items-start gap-3 mb-2">
                {n.isPinned && <Pin size={14} style={{ color: 'var(--color-electric-blue)' }} />}
                <span className="text-[11px] flex items-center gap-1" style={{ color: 'var(--color-placeholder)' }}><Clock size={10} />{new Date(n.createdAt).toLocaleDateString()}</span>
              </div>
              <h3 className="text-[17px] font-medium mb-1" style={{ color: 'var(--color-heading)' }}>{n.title}</h3>
              <p className="text-sm mb-2 line-clamp-2" style={{ color: 'var(--color-tertiary)' }}>{n.body}</p>
              <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>By {n.authorName || n.category || 'Admin'}</p>
            </Card>
          ))}
        </div>
      )}
    </ResidentLayout>
  )
}
