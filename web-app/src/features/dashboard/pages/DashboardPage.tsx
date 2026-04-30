import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { StatCard } from '@/components/data-display/StatCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Users, Wallet, AlertTriangle,
  CheckCircle, TrendingUp, RefreshCw, Loader2,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { useApiQuery } from '@/hooks/useApiQuery'
import { formatCompactCurrency, formatPercentage, formatRelativeTime } from '@/lib/format'
import type {
  FinancialSummary,
  UserCounts,
  ComplaintRecord,
  PendingUser,
} from '@/types/api-contracts'

// ─────────────────────────────────────────────────────────
// DashboardPage — Tesla-inspired President dashboard.
// All data sourced from live backend APIs.
// ─────────────────────────────────────────────────────────

const TICKET_STATUS_MAP: Record<string, 'danger' | 'warning' | 'info' | 'neutral' | 'success'> = {
  ESCALATED: 'danger',
  IN_PROGRESS: 'warning',
  ASSIGNED: 'info',
  PENDING: 'neutral',
  RESOLVED: 'success',
  CLOSED: 'success',
}

export default function DashboardPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const user = useAuthStore((s) => s.user)

  // ── Live API queries ───────────────────────────────────
  const summary = useApiQuery<FinancialSummary>('/finance/reports/summary')
  const userCounts = useApiQuery<UserCounts>('/users/count')
  const complaints = useApiQuery<ComplaintRecord[]>('/complaints')
  const pendingUsers = useApiQuery<PendingUser[]>('/users/pending')

  // ── Computed KPI values (safe fallbacks) ─────────────────
  const openTickets = complaints.data
    ? complaints.data.filter(t => !['RESOLVED', 'CLOSED'].includes(t.status)).length
    : 0
  const escalatedTickets = complaints.data
    ? complaints.data.filter(t => t.status === 'ESCALATED').length
    : 0

  const kpiCards = [
    {
      title: 'Total residents',
      value: userCounts.data?.active?.toString() ?? '—',
      icon: <Users size={20} />,
      iconColor: '#3E6AE1',
      description: userCounts.data ? `${userCounts.data.pending} pending approvals` : 'Loading…',
    },
    {
      title: 'Outstanding dues',
      value: summary.data ? formatCompactCurrency(summary.data.income.pending) : '—',
      icon: <Wallet size={20} />,
      iconColor: '#f59e0b',
      description: summary.data ? `${summary.data.income.pendingCount} unpaid invoices` : 'Loading…',
    },
    {
      title: 'Open complaints',
      value: openTickets.toString(),
      icon: <AlertTriangle size={20} />,
      iconColor: '#ef4444',
      description: escalatedTickets > 0 ? `${escalatedTickets} SLA breaches` : 'No escalations',
    },
    {
      title: 'Collection rate',
      value: summary.data ? formatPercentage(summary.data.collectionRate) : '—',
      icon: <TrendingUp size={20} />,
      iconColor: '#10b981',
      description: summary.data ? `${summary.data.income.paidCount} payments this year` : 'Loading…',
    },
  ]

  const isAnyLoading = summary.isLoading || userCounts.isLoading || complaints.isLoading || pendingUsers.isLoading

  const handleRefresh = () => {
    summary.refetch()
    userCounts.refetch()
    complaints.refetch()
    pendingUsers.refetch()
  }

  // Recent 5 complaints for the live feed
  const recentTickets = complaints.data?.slice(0, 5) ?? []
  // Pending approvals
  const pendingList = pendingUsers.data?.slice(0, 5) ?? []

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>
            Welcome back, {user?.name?.split(' ')[0] || 'President'}
          </h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>
            {tenantId} System · Live view as of {new Date().toLocaleTimeString('en-IN')}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isAnyLoading}
          className="px-4 py-2 rounded-[4px] text-sm font-medium flex items-center gap-1.5 transition-colors duration-[330ms] self-start sm:self-auto disabled:opacity-50"
          style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
        >
          {isAnyLoading ? <Loader2 size={14} className="animate-spin" /> : <RefreshCw size={14} />}
          Refresh
        </button>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-8" style={{ background: 'var(--color-light-ash)', borderRadius: '12px', padding: '4px' }}>
        {summary.isLoading || userCounts.isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="p-5 rounded-[12px] animate-pulse" style={{ background: 'var(--color-white)' }}>
              <div className="h-4 bg-gray-200 rounded-[4px] w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded-[4px] w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded-[4px] w-2/3" />
            </div>
          ))
        ) : (
          kpiCards.map((s) => (
            <StatCard key={s.title} {...s} />
          ))
        )}
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Active Helpdesk Tickets */}
        <Card title="Active helpdesk tickets" subtitle="Live feed from database">
          <div className="space-y-2">
            {complaints.isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3 py-3 px-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-[4px]" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-[4px] w-1/2 mb-1" />
                    <div className="h-3 bg-gray-200 rounded-[4px] w-1/3" />
                  </div>
                </div>
              ))
            ) : complaints.error ? (
              <div className="py-4 text-center">
                <p className="text-sm" style={{ color: 'var(--color-danger)' }}>Failed to load tickets</p>
                <button
                  onClick={() => complaints.refetch()}
                  className="text-xs font-medium mt-2"
                  style={{ color: 'var(--color-electric-blue)' }}
                >
                  Retry
                </button>
              </div>
            ) : recentTickets.length === 0 ? (
              <p className="text-sm p-2" style={{ color: 'var(--color-placeholder)' }}>No active tickets found.</p>
            ) : recentTickets.map((t) => (
              <div
                key={t.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-3 rounded-[4px] transition-colors duration-[330ms] cursor-pointer gap-3 hover:bg-[#F4F4F4]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-[4px] text-xs font-medium text-white shrink-0"
                    style={{
                      background: t.priority === 'CRITICAL' || t.priority === 'HIGH' ? '#ef4444'
                                : t.priority === 'MEDIUM' ? '#f59e0b' : '#8E8E8E',
                    }}
                  >
                    TK
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{t.title || t.category}</p>
                    <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>
                      {t.raisedBy?.name || 'Resident'} · {formatRelativeTime(t.createdAt)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <Badge variant={TICKET_STATUS_MAP[t.status] ?? 'neutral'}>{(t.status || 'PENDING').replace('_', ' ')}</Badge>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card title="Pending approvals" subtitle="Awaiting your sign-off">
          <div className="space-y-2">
            {pendingUsers.isLoading ? (
              Array.from({ length: 3 }).map((_, idx) => (
                <div key={idx} className="flex items-center gap-3 py-3 px-3 animate-pulse">
                  <div className="w-8 h-8 bg-gray-200 rounded-[4px]" />
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded-[4px] w-1/2 mb-1" />
                    <div className="h-3 bg-gray-200 rounded-[4px] w-1/3" />
                  </div>
                </div>
              ))
            ) : pendingUsers.error ? (
              <div className="py-4 text-center">
                <p className="text-sm" style={{ color: 'var(--color-danger)' }}>Failed to load approvals</p>
                <button
                  onClick={() => pendingUsers.refetch()}
                  className="text-xs font-medium mt-2"
                  style={{ color: 'var(--color-electric-blue)' }}
                >
                  Retry
                </button>
              </div>
            ) : pendingList.length === 0 ? (
              <p className="text-sm p-2" style={{ color: 'var(--color-placeholder)' }}>No pending approvals.</p>
            ) : pendingList.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 py-3 px-3 rounded-[4px] transition-colors duration-[330ms] cursor-pointer hover:bg-[#F4F4F4]"
              >
                <div
                  className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#3E6AE114' }}
                >
                  <CheckCircle size={14} style={{ color: 'var(--color-electric-blue)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>Move-in approval</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-tertiary)' }}>
                    {item.name} — {item.unit ? `${item.unit.building?.name ?? ''} ${item.unit.flatNumber}` : 'No unit assigned'}
                  </p>
                </div>
                <span className="text-[10px] shrink-0" style={{ color: 'var(--color-placeholder)' }}>
                  {formatRelativeTime(item.createdAt)}
                </span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
