import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/data-display/StatCard'
import { Search, ShieldCheck, LogIn, LogOut, UserPlus, Clock, Plus, RefreshCw } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'
import { AddVisitorModal } from '../components/AddVisitorModal'

// ─────────────────────────────────────────────────────────
// VisitorManagementPage — Enterprise Digital Gate Pass
// Roles: President, Secretary, Supervisor, Security Guard
// ─────────────────────────────────────────────────────────

const STATUS_BADGE: Record<string, { variant: 'warning'|'success'|'info'|'neutral'|'danger'; label: string }> = {
  UPCOMING:   { variant: 'warning', label: 'Expected' },
  CHECKED_IN: { variant: 'success', label: 'Inside' },
  COMPLETED:  { variant: 'info',    label: 'Departed' },
  EXPIRED:    { variant: 'neutral', label: 'Expired' },
  REJECTED:   { variant: 'danger',  label: 'Rejected' },
}

export default function VisitorManagementPage() {
  const { tenantId } = useParams()
  const user = useAuthStore(s => s.user)
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isModalOpen, setIsModalOpen] = useState(false)

  const fetchVisitors = async () => {
    setLoading(true)
    try {
      const { data } = await apiClient.get('/visitors')
      setVisitors(data)
    } catch (e) {
      console.error('Failed to load visitors', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVisitors()
  }, [tenantId])

  const handleCheckIn = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await apiClient.patch(`/visitors/${id}/checkin`)
      // Optimistic update
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'CHECKED_IN', checkinAt: new Date().toISOString() } : v))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Check-in failed')
    }
  }

  const handleCheckOut = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    try {
      await apiClient.patch(`/visitors/${id}/checkout`)
      // Optimistic update
      setVisitors(prev => prev.map(v => v.id === id ? { ...v, status: 'COMPLETED', checkoutAt: new Date().toISOString() } : v))
    } catch (err: any) {
      alert(err.response?.data?.message || 'Check-out failed')
    }
  }

  const filtered = visitors.filter(v =>
    v.name?.toLowerCase().includes(search.toLowerCase()) ||
    v.purpose?.toLowerCase().includes(search.toLowerCase())
  )

  const isGuard = [UserRole.SECURITY_GUARD, UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY].includes(user?.role as UserRole)

  // Stats
  const upcoming  = visitors.filter(v => v.status === 'UPCOMING').length
  const insideNow = visitors.filter(v => v.status === 'CHECKED_IN').length
  const departed  = visitors.filter(v => v.status === 'COMPLETED').length

  return (
    <DashboardLayout>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Digital gate pass</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Pre-approve guests, track check-ins, and monitor departures in real-time.</p>
        </div>
        <div className="flex gap-3 self-start sm:self-auto">
          <Button onClick={fetchVisitors} variant="outline" icon={<RefreshCw size={15} />}>Refresh</Button>
          <Button onClick={() => setIsModalOpen(true)} variant="primary" icon={<Plus size={15} />}>Pre-Approve Guest</Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
        <StatCard title="Expected Today"   value={upcoming.toString()}  icon={<Clock size={18} />}      iconColor="#f59e0b" />
        <StatCard title="Currently Inside"  value={insideNow.toString()} icon={<LogIn size={18} />}     iconColor="#10b981" />
        <StatCard title="Departed"          value={departed.toString()}  icon={<LogOut size={18} />}     iconColor="#3b82f6" />
      </div>

      <Card title="Visitor Registry" subtitle="Live feed from PostgreSQL" noPadding>
        {/* Search */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--color-cloud)' }}>
          <div className="relative max-w-sm w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input type="text" placeholder="Search by name or purpose..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px] focus:outline-none focus:ring-2 focus:ring-[#3E6AE1]/20" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b" style={{ borderColor: 'var(--color-cloud)' }}>
                {['Status', 'Visitor', 'Purpose', 'Vehicle', 'Scheduled', 'Pass Code', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-4 text-xs font-semibold uppercase tracking-wide" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ divideColor: 'var(--color-cloud)' }}>
              {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                    {Array.from({ length: 7 }).map((_, cIdx) => (
                      <td key={cIdx} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded-[4px] animate-pulse w-full"></div>
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center" style={{ color: 'var(--color-placeholder)' }}>
                    <ShieldCheck size={32} className="mx-auto mb-3 opacity-30" />
                    <p className="text-sm font-medium">No visitors in the registry</p>
                    <p className="text-xs mt-1">Pre-approve a guest to get started.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const badge = STATUS_BADGE[v.status] || { variant: 'neutral' as const, label: v.status }
                  return (
                    <tr key={v.id} className="hover:bg-[#F4F4F4] transition-colors">
                      <td className="py-3 px-4">
                        <Badge variant={badge.variant} dot>{badge.label}</Badge>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-medium" style={{ color: 'var(--color-heading)' }}>{v.name}</p>
                        {v.phone && <p className="text-xs mt-0.5" style={{ color: 'var(--color-placeholder)' }}>{v.phone}</p>}
                      </td>
                      <td className="py-3 px-4" style={{ color: 'var(--color-body)' }}>{v.purpose}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--color-tertiary)' }}>{v.vehicleNo || '—'}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--color-tertiary)' }}>
                        <span className="text-xs">
                          {new Date(v.scheduledAt).toLocaleString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' })}
                        </span>
                        {v.checkinAt && <span className="block text-[11px] text-green-600 mt-0.5">In: {new Date(v.checkinAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                        {v.checkoutAt && <span className="block text-[11px] text-blue-600 mt-0.5">Out: {new Date(v.checkoutAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>}
                      </td>
                      <td className="py-3 px-4">
                        <code className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded" style={{ color: 'var(--color-body)' }}>
                          {v.qrCode ? v.qrCode.split('-')[0].toUpperCase() : 'N/A'}
                        </code>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          {v.status === 'UPCOMING' && isGuard && (
                            <button
                              onClick={(e) => handleCheckIn(v.id, e)}
                              className="px-3 py-1.5 text-xs font-medium rounded-[4px] text-white transition-colors"
                              style={{ background: '#10b981' }}
                            >
                              Check In
                            </button>
                          )}
                          {v.status === 'CHECKED_IN' && isGuard && (
                            <button
                              onClick={(e) => handleCheckOut(v.id, e)}
                              className="px-3 py-1.5 text-xs font-medium rounded-[4px] text-white transition-colors"
                              style={{ background: 'var(--color-electric-blue)' }}
                            >
                              Check Out
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="md:hidden flex flex-col gap-3 p-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="border p-4 rounded-[8px] bg-white shadow-sm animate-pulse" style={{ borderColor: 'var(--color-cloud)' }}>
                <div className="h-4 bg-gray-200 rounded-[4px] w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded-[4px] w-2/3"></div>
              </div>
            ))
          ) : filtered.length === 0 ? (
            <div className="py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No visitors in the registry.</div>
          ) : (
            filtered.map((v) => {
              const badge = STATUS_BADGE[v.status] || { variant: 'neutral' as const, label: v.status }
              return (
                <div key={v.id} className="border p-4 rounded-[8px] bg-white shadow-sm" style={{ borderColor: 'var(--color-cloud)' }}>
                  <div className="flex justify-between items-start gap-2 mb-3">
                    <div>
                      <p className="font-semibold text-sm" style={{ color: 'var(--color-heading)' }}>{v.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-tertiary)' }}>{v.purpose}</p>
                    </div>
                    <Badge variant={badge.variant} dot>{badge.label}</Badge>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: 'var(--color-cloud)' }}>
                    <code className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{v.qrCode ? v.qrCode.split('-')[0].toUpperCase() : 'N/A'}</code>
                    <div className="flex gap-2">
                      {v.status === 'UPCOMING' && isGuard && (
                        <button onClick={(e) => handleCheckIn(v.id, e)} className="px-3 py-1.5 text-xs font-medium rounded-[4px] text-white" style={{ background: '#10b981' }}>Check In</button>
                      )}
                      {v.status === 'CHECKED_IN' && isGuard && (
                        <button onClick={(e) => handleCheckOut(v.id, e)} className="px-3 py-1.5 text-xs font-medium rounded-[4px] text-white" style={{ background: 'var(--color-electric-blue)' }}>Check Out</button>
                      )}
                    </div>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </Card>

      <AddVisitorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchVisitors}
      />
    </DashboardLayout>
  )
}
