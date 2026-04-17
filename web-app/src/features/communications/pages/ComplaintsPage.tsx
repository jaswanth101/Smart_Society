import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/data-display/StatCard'
import { AlertTriangle, Clock, Camera, RefreshCw } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ComplaintsPage — Full helpdesk ticket master view.
// Role access: President, Secretary, Supervisor.
// ─────────────────────────────────────────────────────────
const MOCK_TICKETS = [
  { id:'TK-0012', category:'Plumbing',   unit:'A-304', status:'ESCALATED',   sla:'2h overdue',   assignee:'Ravi Kumar',  photos:2 },
  { id:'TK-0011', category:'Electrical', unit:'B-201', status:'IN_PROGRESS', sla:'1h remaining', assignee:'Sanjay M',    photos:1 },
  { id:'TK-0009', category:'CCTV Repair',unit:'Gate-1',status:'ASSIGNED',    sla:'3h remaining', assignee:'IT Vendor',   photos:0 },
  { id:'TK-0007', category:'Lift Fault', unit:'Tower C',status:'PENDING',    sla:'30m remaining',assignee:'Unassigned',  photos:0 },
  { id:'TK-0005', category:'Waterlog',   unit:'B-Basement',status:'RESOLVED',sla:'Done',         assignee:'Mohan Singh', photos:3 },
]

const STATUS_VARIANT: Record<string, 'danger'|'warning'|'info'|'neutral'|'success'> = {
  ESCALATED:   'danger',
  IN_PROGRESS: 'warning',
  ASSIGNED:    'info',
  PENDING:     'neutral',
  RESOLVED:    'success',
}

export default function ComplaintsPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Helpdesk & Complaints</h1>
          <p className="text-sm text-slate-500">Monitor all tickets, SLAs, and escalations</p>
        </div>
        <Button variant="outline" icon={<RefreshCw size={15} />}>Refresh</Button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Open Tickets"    value="18" icon={<AlertTriangle size={18} />} iconColor="#ef4444" />
        <StatCard title="SLA Breaches"    value="3"  icon={<Clock size={18} />}         iconColor="#f59e0b" />
        <StatCard title="Resolved Today"  value="7"  icon={<RefreshCw size={18} />}     iconColor="#10b981" />
        <StatCard title="Avg Resolution"  value="4.2h" icon={<Camera size={18} />}      iconColor="#3b82f6" />
      </div>

      <Card title="All Tickets" subtitle="Sorted by SLA urgency">
        <div className="table-wrapper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Ticket ID', 'Category', 'Unit', 'Assignee', 'Status', 'SLA', 'Photos'].map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_TICKETS.map((t) => (
                <tr key={t.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-3 px-2"><code className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{t.id}</code></td>
                  <td className="py-3 px-2 font-medium text-slate-800">{t.category}</td>
                  <td className="py-3 px-2 text-slate-600">{t.unit}</td>
                  <td className="py-3 px-2 text-slate-600">{t.assignee}</td>
                  <td className="py-3 px-2"><Badge variant={STATUS_VARIANT[t.status]} dot>{t.status}</Badge></td>
                  <td className="py-3 px-2">
                    <span className={`text-xs font-medium ${t.sla.includes('overdue') ? 'text-red-500' : 'text-slate-500'}`}>
                      {t.sla}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    {t.photos > 0 ? (
                      <span className="flex items-center gap-1 text-xs text-slate-500">
                        <Camera size={12} /> {t.photos}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
