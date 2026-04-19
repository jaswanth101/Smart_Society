import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Wallet, AlertCircle, FileText, CheckCircle, Package, Clock, Users } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

// ─────────────────────────────────────────────────────────
// ResidentHomePage — Live dashboard pulling from PostgreSQL
// ─────────────────────────────────────────────────────────

export default function ResidentHomePage() {
  const user = useAuthStore(s => s.user)
  const [dues, setDues] = useState<any>(null)
  const [tickets, setTickets] = useState<any[]>([])
  const [notices, setNotices] = useState<any[]>([])
  const [visitors, setVisitors] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const [invRes, tickRes, notRes, visRes] = await Promise.allSettled([
          apiClient.get('/finance/invoices'),
          apiClient.get('/complaints'),
          apiClient.get('/communications/notices'),
          apiClient.get('/visitors'),
        ])
        if (invRes.status === 'fulfilled') {
          const pending = invRes.value.data.find((i: any) => i.status === 'PENDING' || i.status === 'OVERDUE')
          setDues(pending || null)
        }
        if (tickRes.status === 'fulfilled') setTickets(invRes.status === 'fulfilled' ? tickRes.value.data.slice(0, 3) : [])
        if (notRes.status === 'fulfilled') setNotices(notRes.value.data.slice(0, 3))
        if (visRes.status === 'fulfilled') setVisitors(visRes.value.data.filter((v: any) => v.status === 'UPCOMING' || v.status === 'CHECKED_IN'))
      } catch (e) { console.error(e) }
      finally { setLoading(false) }
    }
    load()
  }, [])

  const STATUS_MAP: Record<string, 'warning' | 'neutral' | 'success' | 'danger'> = {
    PENDING: 'neutral', ASSIGNED: 'neutral', IN_PROGRESS: 'warning', RESOLVED: 'success', CLOSED: 'success', ESCALATED: 'danger'
  }

  if (loading) {
    return (
      <ResidentLayout>
        <div className="mb-8"><div className="h-10 w-60 bg-gray-200 rounded animate-pulse" /><div className="h-4 w-40 bg-gray-200 rounded animate-pulse mt-3" /></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="col-span-2 h-32 bg-gray-200 rounded-[8px] animate-pulse" />
          <div className="h-32 bg-gray-200 rounded-[8px] animate-pulse" />
        </div>
      </ResidentLayout>
    )
  }

  return (
    <ResidentLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Welcome, {user?.name?.split(' ')[0] || 'Resident'}</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>{user?.role === 'FLAT_OWNER' ? 'Flat Owner' : 'Tenant'}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Dues */}
        <div className="col-span-1 md:col-span-2">
          <Card noPadding className="h-full">
            <div className="p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-tertiary)' }}>Maintenance dues</p>
                {dues ? (
                  <>
                    <div className="flex items-baseline gap-2">
                      <h2 className="text-3xl font-medium" style={{ color: 'var(--color-heading)' }}>₹{dues.amount?.toLocaleString()}</h2>
                      <span className="text-sm" style={{ color: 'var(--color-placeholder)' }}>/ {dues.month} {dues.year}</span>
                    </div>
                    <p className="text-xs mt-1.5 flex items-center gap-1 font-medium" style={{ color: dues.status === 'OVERDUE' ? 'var(--color-danger)' : '#f59e0b' }}>
                      <AlertCircle size={12} /> {dues.status === 'OVERDUE' ? 'Overdue!' : `Due by ${new Date(dues.dueDate).toLocaleDateString()}`}
                    </p>
                  </>
                ) : (
                  <p className="text-lg font-medium mt-1" style={{ color: '#10b981' }}>All dues cleared ✓</p>
                )}
              </div>
              {dues && (
                <button className="w-full sm:w-auto px-6 py-2.5 text-white font-medium rounded-[4px] text-sm" style={{ background: 'var(--color-electric-blue)' }}>
                  Pay now
                </button>
              )}
            </div>
          </Card>
        </div>

        {/* Active visitors */}
        <div className="col-span-1">
          <Card className="h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>
                <Users size={20} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{visitors.length} active visitor{visitors.length !== 1 ? 's' : ''}</p>
                <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{visitors.length > 0 ? visitors[0]?.name : 'No expected guests'}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets */}
        <Card title="My helpdesk tickets">
          {tickets.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: 'var(--color-placeholder)' }}>No tickets raised.</p>
          ) : (
            <div className="space-y-2 mt-1">
              {tickets.map((t: any) => (
                <div key={t.id} className="flex items-center justify-between p-3 rounded-[4px] hover:bg-[#F4F4F4] transition-colors">
                  <div className="flex items-center gap-3">
                    <span className="p-2 rounded-[4px]" style={{ background: t.status === 'RESOLVED' ? '#10b98114' : '#f59e0b14', color: t.status === 'RESOLVED' ? '#10b981' : '#f59e0b' }}>
                      {t.status === 'RESOLVED' ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                    </span>
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{t.description?.slice(0, 40) || t.category}</p>
                      <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>{t.ticketId || t.id?.slice(0, 8)} • {new Date(t.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <Badge variant={STATUS_MAP[t.status] || 'neutral'}>{t.status?.toLowerCase().replace('_', ' ')}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Notices */}
        <Card title="Society notices">
          {notices.length === 0 ? (
            <p className="text-sm py-6 text-center" style={{ color: 'var(--color-placeholder)' }}>No notices posted.</p>
          ) : (
            <div className="space-y-2 mt-1">
              {notices.map((n: any) => (
                <div key={n.id} className="flex items-start gap-3 p-3 rounded-[4px] hover:bg-[#F4F4F4] transition-colors cursor-pointer">
                  <div className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5" style={{ background: n.isPinned ? '#3E6AE114' : 'var(--color-light-ash)', color: n.isPinned ? 'var(--color-electric-blue)' : 'var(--color-tertiary)' }}>
                    <FileText size={14} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{n.title}</p>
                    <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--color-tertiary)' }}>{n.body}</p>
                    <div className="flex items-center gap-2 mt-2 text-[10px] font-medium" style={{ color: 'var(--color-placeholder)' }}>
                      <span>{n.category}</span> • <span>{new Date(n.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </ResidentLayout>
  )
}
