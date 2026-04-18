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
// DashboardPage — Tesla-inspired President dashboard.
// ─────────────────────────────────────────────────────────

const MOCK_STATS = [
  { title: 'Total residents', value: '486', icon: <Users size={20} />, iconColor: '#3E6AE1', trend: 3, description: '12 pending approvals' },
  { title: 'Maintenance dues', value: '₹2.4L', icon: <Wallet size={20} />, iconColor: '#f59e0b', trend: -8, description: '34 defaulters this month' },
  { title: 'Open complaints', value: '18', icon: <AlertTriangle size={20} />, iconColor: '#ef4444', trend: 12, description: '3 SLA breaches today' },
  { title: 'Active gate passes', value: '7', icon: <ShieldAlert size={20} />, iconColor: '#10b981', trend: 0, description: 'Last 24 hours' },
  { title: 'Edge server status', value: 'Online', icon: <Cpu size={20} />, iconColor: '#8b5cf6', description: 'Last ping 42s ago' },
  { title: "Today's collections", value: '₹84,500', icon: <TrendingUp size={20} />, iconColor: '#06b6d4', trend: 22, description: '12 payments received' },
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
  { type: 'Move-in approval', detail: 'Priya Sharma — Flat B-404', time: '2h ago' },
  { type: 'Expense sign-off', detail: '₹1,20,000 — Lift AMC Repair', time: '4h ago' },
  { type: 'Vendor contract', detail: 'SwachBharat Cleaning Pvt Ltd', time: '1d ago' },
]

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'

export default function DashboardPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const user = useAuthStore((s) => s.user)
  
  // Real API state for helpdesk
  const [complaints, setComplaints] = useState<any[]>([])
  const [loadingComplaints, setLoadingComplaints] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const res = await apiClient.get('/complaints');
        // Take the top 5 most recent complaints
        setComplaints(res.data.slice(0, 5));
      } catch (err) {
        console.error('Failed to fetch complaints:', err);
      } finally {
        setLoadingComplaints(false);
      }
    };
    fetchDashboardData();
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>
          Welcome back, {user?.name?.split(' ')[0] || 'President'}
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>
          {tenantId} System · Live view as of {new Date().toLocaleTimeString('en-IN')}
        </p>
      </div>

      {/* KPI grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mb-8" style={{ background: 'var(--color-light-ash)', borderRadius: '12px', padding: '4px' }}>
        {MOCK_STATS.map((s) => (
          <StatCard key={s.title} {...s} />
        ))}
      </div>

      {/* Lower row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* SLA Complaints (Live Data) */}
        <Card title="Active helpdesk tickets" subtitle="Live feed from backend">
          <div className="space-y-2">
            {loadingComplaints ? (
              <p className="text-sm text-gray-500 p-2">Loading live tickets...</p>
            ) : complaints.length === 0 ? (
              <p className="text-sm text-gray-500 p-2">No active tickets found.</p>
            ) : complaints.map((t) => (
              <div
                key={t.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between py-3 px-3 rounded-[4px] transition-colors duration-[330ms] cursor-pointer gap-3 hover:bg-[#F4F4F4]"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="flex items-center justify-center w-8 h-8 rounded-[4px] text-xs font-medium text-white"
                    style={{
                      background: t.priority === 'HIGH' ? '#ef4444'
                                : t.priority === 'MEDIUM' ? '#f59e0b' : '#8E8E8E',
                    }}
                  >
                    TK
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{t.title || t.category}</p>
                    <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>{t.raisedBy?.name || 'Resident'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-right">
                  <div>
                    <Badge variant={TICKET_STATUS_MAP[t.status] ?? 'neutral'}>{(t.status || 'PENDING').replace('_', ' ')}</Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Pending Approvals */}
        <Card title="Pending approvals" subtitle="Awaiting your sign-off">
          <div className="space-y-2">
            {MOCK_PENDING.map((item, i) => (
              <div
                key={i}
                className="flex items-start gap-3 py-3 px-3 rounded-[4px] transition-colors duration-[330ms] cursor-pointer hover:bg-[#F4F4F4]"
              >
                <div
                  className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5"
                  style={{ background: '#3E6AE114' }}
                >
                  <CheckCircle size={14} style={{ color: 'var(--color-electric-blue)' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{item.type}</p>
                  <p className="text-xs truncate" style={{ color: 'var(--color-tertiary)' }}>{item.detail}</p>
                </div>
                <span className="text-[10px] shrink-0" style={{ color: 'var(--color-placeholder)' }}>{item.time}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </DashboardLayout>
  )
}
