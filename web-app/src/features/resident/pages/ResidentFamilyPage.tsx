import { useState, useEffect } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CreditCard, AlertTriangle, Plus, User } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

// ─────────────────────────────────────────────────────────
// ResidentFamilyPage — Live RFID cards for this flat
// ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { ACTIVE: 'success', LOST: 'warning', REVOKED: 'danger', BLOCKED: 'danger' }

export default function ResidentFamilyPage() {
  const [cards, setCards] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/access-control/rfid')
      .then(res => {
        // Filter to only show cards for the current user's flat
        setCards(res.data || [])
      })
      .catch(err => console.error('Failed to load RFID data', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ResidentLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Family & RFID</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Manage family members and RFID card status.</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-20 bg-gray-200 rounded-[8px] animate-pulse" />)}</div>
      ) : cards.length === 0 ? (
        <div className="py-16 text-center">
          <CreditCard size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No RFID cards assigned to your flat. Contact the Secretary.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {cards.map((c: any) => (
            <Card key={c.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[4px] flex items-center justify-center text-white font-medium" style={{ background: 'var(--color-electric-blue)' }}>
                    {(c.holderName || c.uid || '?').charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{c.holderName || 'Unnamed'}</p>
                    <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{c.holderType?.replace('_', ' ')}{c.unitLabel ? ` · ${c.unitLabel}` : ''}</p>
                    <p className="text-[11px] mt-1" style={{ color: 'var(--color-placeholder)' }}>Issued: {new Date(c.issuedAt).toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-mono text-xs px-2 py-1 rounded-[4px]" style={{ background: 'var(--color-light-ash)', color: 'var(--color-body)' }}>{c.uid}</span>
                  <Badge variant={STATUS_MAP[c.status] || 'neutral'}>{c.status?.toLowerCase()}</Badge>
                  {c.status === 'ACTIVE' && (
                    <button className="text-xs font-medium px-3 py-1.5 rounded-[4px] transition-colors duration-[330ms]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-danger)' }}>
                      Report lost
                    </button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </ResidentLayout>
  )
}
