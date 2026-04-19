import { useState, useEffect } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Vote, ShoppingBag, FileText, ThumbsUp, Inbox } from 'lucide-react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// ResidentCommunityPage — Polls, Marketplace, Documents
// Polls & Marketplace backends are not yet built (Tier 3).
// Documents are pulled from the Notices API (category filter).
// ─────────────────────────────────────────────────────────

type Tab = 'polls' | 'marketplace' | 'documents'

export default function ResidentCommunityPage() {
  const [tab, setTab] = useState<Tab>('documents')
  const [documents, setDocuments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/communications/notices')
      .then(res => {
        // Use notices that contain attachments or are categorized as documents
        setDocuments(res.data || [])
      })
      .catch(err => console.error('Failed to load documents', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ResidentLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Community</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Polls, marketplace, and society documents.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {([['documents', 'Documents', <FileText size={16} key="d" />], ['polls', 'Polls & voting', <Vote size={16} key="v" />], ['marketplace', 'Marketplace', <ShoppingBag size={16} key="m" />]] as const).map(([key, label, icon]) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-sm font-medium shrink-0 transition-colors duration-[330ms]"
            style={{ background: tab === key ? 'var(--color-electric-blue)' : 'var(--color-white)', color: tab === key ? 'white' : 'var(--color-body)' }}>
            {icon}{label}
          </button>
        ))}
      </div>

      {/* Documents Tab — Wired to live notices */}
      {tab === 'documents' && (
        loading ? (
          <div className="space-y-3">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-[4px] animate-pulse" />)}</div>
        ) : documents.length === 0 ? (
          <div className="py-16 text-center">
            <FileText size={32} className="mx-auto mb-3 opacity-30" />
            <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No society documents shared yet.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documents.map((doc: any) => (
              <div key={doc.id} className="flex items-center justify-between p-4 rounded-[4px] hover:bg-[#F4F4F4] transition-colors cursor-pointer" style={{ background: 'var(--color-white)' }}>
                <div className="flex items-center gap-3">
                  <FileText size={18} style={{ color: 'var(--color-electric-blue)' }} />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{doc.title}</p>
                    <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>{doc.category || 'General'} · {new Date(doc.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Polls Tab — Backend not built yet, graceful empty state */}
      {tab === 'polls' && (
        <div className="py-16 text-center">
          <Vote size={40} className="mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--color-heading)' }}>Polls coming soon</h3>
          <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>
            The society committee will create polls here for community decisions.
          </p>
        </div>
      )}

      {/* Marketplace Tab — Backend not built yet, graceful empty state */}
      {tab === 'marketplace' && (
        <div className="py-16 text-center">
          <Inbox size={40} className="mx-auto mb-4 opacity-20" />
          <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--color-heading)' }}>Marketplace coming soon</h3>
          <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>
            Buy, sell, and exchange within your community. This feature is under development.
          </p>
        </div>
      )}
    </ResidentLayout>
  )
}
