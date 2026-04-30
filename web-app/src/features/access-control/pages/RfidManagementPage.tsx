import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PlusCircle, RefreshCcw, Loader2 } from 'lucide-react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { formatRelativeTime } from '@/lib/format'
import type { RfidCard } from '@/types/api-contracts'

// ─────────────────────────────────────────────────────────
// RfidManagementPage — Issue, revoke, and configure RFID cards.
// Role access: President, Secretary, Supervisor.
// Data sourced from GET /access-control/rfid
// ─────────────────────────────────────────────────────────

export default function RfidManagementPage() {
  const { data: cards, isLoading, error, refetch, isRefetching } = useApiQuery<RfidCard[]>('/access-control/rfid')

  const totalCards = cards?.length ?? 0
  const activeCards = cards?.filter(c => c.status === 'ACTIVE').length ?? 0

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold" style={{ color: 'var(--color-heading)' }}>RFID Card Management</h1>
          <p className="text-sm" style={{ color: 'var(--color-tertiary)' }}>Issue, revoke, and configure physical access credentials</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            icon={isRefetching ? <Loader2 size={15} className="animate-spin" /> : <RefreshCcw size={15} />}
            onClick={() => refetch()}
            disabled={isRefetching}
          >
            Sync
          </Button>
          <Button icon={<PlusCircle size={15} />}>Issue New Card</Button>
        </div>
      </div>

      <Card
        title="All RFID Cards"
        subtitle={isLoading ? 'Loading…' : `${totalCards} total credentials registered · ${activeCards} active`}
      >
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  {['Card UID', 'Holder Name', 'Flat / Post', 'Type', 'Issued', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-4 text-xs font-medium" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                      {Array.from({ length: 7 }).map((_, cIdx) => (
                        <td key={cIdx} className="px-4 py-4">
                          <div className="h-4 bg-gray-200 rounded-[4px] animate-pulse w-full" />
                        </td>
                      ))}
                    </tr>
                  ))
                ) : error ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center">
                      <p className="text-sm" style={{ color: 'var(--color-danger)' }}>Failed to load RFID cards</p>
                      <button onClick={() => refetch()} className="text-xs font-medium mt-2" style={{ color: 'var(--color-electric-blue)' }}>Retry</button>
                    </td>
                  </tr>
                ) : !cards || cards.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>
                      No RFID cards registered yet. Click "Issue New Card" to begin.
                    </td>
                  </tr>
                ) : (
                  cards.map((card) => (
                    <tr key={card.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4]" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                      <td className="py-3 px-4">
                        <code className="text-xs px-2 py-0.5 rounded font-mono" style={{ background: 'var(--color-light-ash)', color: 'var(--color-body)' }}>{card.uid}</code>
                      </td>
                      <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-heading)' }}>{card.user?.name ?? '—'}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--color-body)' }}>
                        {card.user?.unit ? `${card.user.unit.building?.name ?? ''} ${card.user.unit.flatNumber}` : '—'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge variant="neutral">{card.type}</Badge>
                      </td>
                      <td className="py-3 px-4 text-xs" style={{ color: 'var(--color-tertiary)' }}>{formatRelativeTime(card.issuedAt)}</td>
                      <td className="py-3 px-4">
                        <Badge variant={card.status === 'ACTIVE' ? 'success' : 'danger'} dot>
                          {card.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-3">
                          <button className="text-xs font-medium transition-colors" style={{ color: 'var(--color-electric-blue)' }}>Edit</button>
                          <button className="text-xs font-medium transition-colors" style={{ color: 'var(--color-danger)' }}>Revoke</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="border p-4 rounded-[8px] shadow-sm flex flex-col gap-3 animate-pulse" style={{ borderColor: 'var(--color-cloud)', background: 'var(--color-white)' }}>
                  <div className="h-4 bg-gray-200 rounded-[4px] w-1/2" />
                  <div className="h-3 bg-gray-200 rounded-[4px] w-3/4" />
                  <div className="h-8 bg-gray-200 rounded-[4px] w-full mt-2" />
                </div>
              ))
            ) : error ? (
              <div className="py-8 text-center">
                <p className="text-sm" style={{ color: 'var(--color-danger)' }}>Failed to load RFID cards</p>
                <button onClick={() => refetch()} className="text-xs font-medium mt-2" style={{ color: 'var(--color-electric-blue)' }}>Retry</button>
              </div>
            ) : !cards || cards.length === 0 ? (
              <div className="py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No RFID cards registered yet.</div>
            ) : (
              cards.map((card) => (
                <div key={card.id} className="border p-4 rounded-[8px] shadow-sm flex flex-col gap-3" style={{ borderColor: 'var(--color-cloud)', background: 'var(--color-white)' }}>
                  <div className="flex justify-between items-start gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm truncate" style={{ color: 'var(--color-heading)' }}>{card.user?.name ?? '—'}</p>
                      <p className="text-xs mt-1 flex items-center gap-1.5 flex-wrap" style={{ color: 'var(--color-tertiary)' }}>
                        <span>{card.user?.unit ? `${card.user.unit.building?.name ?? ''} ${card.user.unit.flatNumber}` : '—'}</span>
                        <span style={{ color: 'var(--color-cloud)' }}>•</span>
                        <code className="px-1 py-0.5 rounded font-mono text-[10px] truncate" style={{ background: 'var(--color-light-ash)' }}>{card.uid}</code>
                      </p>
                    </div>
                    <Badge variant={card.status === 'ACTIVE' ? 'success' : 'danger'} dot>
                      {card.status}
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center mt-1 pt-3" style={{ borderTop: '1px solid var(--color-cloud)' }}>
                    <Badge variant="neutral">{card.type}</Badge>
                    <div className="flex gap-3">
                      <button className="text-xs font-medium px-2 py-1 rounded transition-colors" style={{ color: 'var(--color-electric-blue)', background: '#3E6AE110' }}>Edit</button>
                      <button className="text-xs font-medium px-2 py-1 rounded transition-colors" style={{ color: 'var(--color-danger)', background: '#ef444410' }}>Revoke</button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
}
