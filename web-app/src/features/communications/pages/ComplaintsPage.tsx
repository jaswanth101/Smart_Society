import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/data-display/StatCard'
import { AlertTriangle, Clock, Camera, RefreshCw } from 'lucide-react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// ComplaintsPage — Full helpdesk ticket master view.
// Role access: President, Secretary, Supervisor.
// ─────────────────────────────────────────────────────────

const STATUS_VARIANT: Record<string, 'danger'|'warning'|'info'|'neutral'|'success'> = {
  ESCALATED:   'danger',
  IN_PROGRESS: 'warning',
  ASSIGNED:    'info',
  PENDING:     'neutral',
  RESOLVED:    'success',
}

export default function ComplaintsPage() {
  const [tickets, setTickets] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const fetchTickets = async () => {
    setLoading(true)
    try {
      const { data } = await apiClient.get('/complaints')
      setTickets(data)
    } catch (e) {
      console.error('Fetch complaints failed', e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTickets()
  }, [])

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Helpdesk & Complaints</h1>
          <p className="text-sm text-slate-500">Monitor all tickets, SLAs, and escalations</p>
        </div>
        <Button onClick={fetchTickets} variant="outline" icon={<RefreshCw size={15} />}>Refresh</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Open Tickets"    value={tickets.length.toString()} icon={<AlertTriangle size={18} />} iconColor="#ef4444" />
        <StatCard title="SLA Breaches"    value="0"  icon={<Clock size={18} />}         iconColor="#f59e0b" />
        <StatCard title="Resolved Today"  value={tickets.filter(t => t.status === 'RESOLVED').length.toString()}  icon={<RefreshCw size={18} />}     iconColor="#10b981" />
        <StatCard title="Avg Resolution"  value="4.2h" icon={<Camera size={18} />}      iconColor="#3b82f6" />
      </div>

      <Card title="All Tickets" subtitle="Live feed from PostgreSQL">
        <div className="table-wrapper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Ticket ID', 'Title', 'Category', 'Raised By', 'Status', 'SLA Deadline', 'Params'].map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">Loading live helpdesk tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-500">No active complaints found in this society.</td>
                </tr>
              ) : (
                tickets.map((t) => (
                  <tr key={t.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                    <td className="py-3 px-2"><code className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{t.ticketId.substring(0,8)}</code></td>
                    <td className="py-3 px-2 font-medium text-slate-800">{t.title}</td>
                    <td className="py-3 px-2 text-slate-600">{t.category}</td>
                    <td className="py-3 px-2 text-slate-600">{t.raisedBy?.name || 'Resident'}</td>
                    <td className="py-3 px-2"><Badge variant={STATUS_VARIANT[t.status] || 'neutral'} dot>{t.status}</Badge></td>
                    <td className="py-3 px-2">
                      <span className={`text-xs font-medium text-slate-500`}>
                        {t.slaDeadline ? new Date(t.slaDeadline).toLocaleDateString() : 'None'}
                      </span>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button className="text-xs text-blue-600 hover:underline">Update</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
