import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { StatCard } from '@/components/data-display/StatCard'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import {
  Users, Wallet, ShieldAlert, Cpu, AlertTriangle,
  CheckCircle, Clock, TrendingUp,
} from 'lucide-react'

// ─────────────────────────────────────────────────────────
// DashboardPage — Main landing page for society admins (President,
// Secretary, Treasurer, Supervisor). Shows real-time KPIs,
// SLA breach alerts, and pending approvals queue.
// ─────────────────────────────────────────────────────────

// Mock data — replace with real API calls via dashboard.api.ts
const MOCK_STATS = [
  { title: 'Total Residents', value: '486', icon: <Users size={20} />, iconColor: '#3b82f6', trend: 3, description: '12 pending approvals' },
  { title: 'Maintenance Dues', value: '₹2.4L', icon: <Wallet size={20} />, iconColor: '#f59e0b', trend: -8, description: '34 defaulters this month' },
  { title: 'Open Complaints', value: '18', icon: <AlertTriangle size={20} />, iconColor: '#ef4444', trend: 12, description: '3 SLA breaches today' },
  { title: 'Active Gate Passes', value: '7', icon: <ShieldAlert size={20} />, iconColor: '#10b981', trend: 0, description: 'Last 24 hours' },
  { title: 'Edge Server Status', value: 'Online', icon: <Cpu size={20} />, iconColor: '#8b5cf6', description: 'Last ping 42s ago' },
  { title: 'Today\'s Collections', value: '₹84,500', icon: <TrendingUp size={20} />, iconColor: '#06b6d4', trend: 22, description: '12 payments received' },
]

const MOCK_COMPLAINTS = [
  { id: 'TK-0012', category: 'Plumbing', unit: 'A-304', status: 'ESCALATED', sla: '2h overdue', priority: 'high' },
  { id: 'TK-0011', category: 'Electrical', unit: 'B-201', status: 'IN_PROGRESS', sla: '1h remaining', priority: 'medium' },
  { id: 'TK-0009', category: 'CCTV', unit: 'Gate-1', status: 'ASSIGNED', sla: '3h remaining', priority: 'low' },
  { id: 'TK-0007', category: 'Lift', unit: 'Tower C', status: 'PENDING', sla: '30m remaining', priority: 'high' },
]

const TICKET_STATUS_MAP: Record<string, 'danger' | 'warning' | 'info' | 'neutral'> = {
  ESCALATED: 'danger',
  IN_PROGRESS: 'warning',
  ASSIGNED: 'info',
  PENDING: 'neutral',
}

const MOCK_PENDING = [
  { type: 'Move-In Approval', detail: 'Priya Sharma — Flat B-404', time: '2h ago' },
  { type: 'Expense Sign-off', detail: '₹1,20,000 — Lift AMC Repair', time: '4h ago' },
  { type: 'Vendor Contract', detail: 'SwachBharat Cleaning Pvt Ltd', time: '1d ago' },
]

export default function DashboardPage() {
  const { tenantId } = useParams<{ tenantId: string }>()

  return (
    <DashboardLayout>
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-xl font-bold text-slate-900">Society Dashboard</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {tenantId ?? 'Alpha Society'} · Live view as of {new Date().toLocaleTimeString('en-IN')}
        </p>
      </div>

      {/* KPI grid — responsive 1→2→3 cols */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
        {MOCK_STATS.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Lower row: SLA breaches + Pending approvals */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* SLA Complaints */}
        <Card title="Active Helpdesk Tickets" subtitle="Sorted by SLA urgency">
          <div className="space-y-2.5">
            {MOCK_COMPLAINTS.map((t) => (
              <div
                key={t.id}
                className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer group"
                style={{ border: '1px solid var(--color-surface-100)' }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-lg text-xs font-bold text-white"
                    style={{
                      background: t.priority === 'high' ? '#ef4444'
                        : t.priority === 'medium' ? '#f59e0b' : '#94a3b8',
                    }}
                  >
                    {t.id.split('-')[1]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-slate-800">{t.category}</p>
                    <p className="text-xs text-slate-500">{t.unit}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <div>
                    <Badge variant={TICKET_STATUS_MAP[t.status] ?? 'neutral'}>{t.status}</Badge>
                    <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1 justify-end">
                      <Clock size={10} />{t.sla}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card title="Pending Approvals" subtitle="Awaiting your sign-off">
          <div className="space-y-3">
            {MOCK_PENDING.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 px-3 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ border: '1px solid var(--color-surface-100)' }}
              >
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#dbeafe' }}
                >
                  <CheckCircle size={14} color="#2563eb" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{item.type}</p>
                  <p className="text-xs text-slate-500 truncate">{item.detail}</p>
                </div>
                <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
