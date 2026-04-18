import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/data-display/StatCard'
import { AlertTriangle, Clock, Camera, RefreshCw, Plus } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { AddComplaintModal } from '../components/AddComplaintModal'
import { UpdateComplaintModal } from '../components/UpdateComplaintModal'

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
  
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [selectedTicket, setSelectedTicket] = useState<any>(null)

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
        <div className="flex gap-3">
          <Button onClick={fetchTickets} variant="outline" icon={<RefreshCw size={15} />}>Refresh</Button>
          <Button onClick={() => setIsAddOpen(true)} variant="primary" icon={<Plus size={15} />}>Raise Ticket</Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        <StatCard title="Open Tickets"    value={tickets.length.toString()} icon={<AlertTriangle size={18} />} iconColor="#ef4444" />
        <StatCard title="SLA Breaches"    value="0"  icon={<Clock size={18} />}         iconColor="#f59e0b" />
        <StatCard title="Resolved Today"  value={tickets.filter(t => t.status === 'RESOLVED').length.toString()}  icon={<RefreshCw size={18} />}     iconColor="#10b981" />
        <StatCard title="Avg Resolution"  value="4.2h" icon={<Camera size={18} />}      iconColor="#3b82f6" />
      </div>

      <Card title="All Tickets" subtitle="Live feed from PostgreSQL" noPadding>
        {/* Table/Card Views */}
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b" style={{ borderColor: 'var(--color-cloud)' }}>
                  {['Ticket ID', 'Title', 'Category', 'Raised By', 'Status', 'SLA Deadline', ''].map((h) => (
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
                ) : tickets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No active complaints found in this society.</td>
                  </tr>
                ) : (
                  tickets.map((t) => (
                    <tr key={t.id} className="hover:bg-[#F4F4F4] transition-colors cursor-pointer" onClick={() => setSelectedTicket(t)}>
                      <td className="py-3 px-4"><code className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded" style={{ color: 'var(--color-body)' }}>{t.ticketId.substring(0,8)}</code></td>
                      <td className="py-3 px-4 font-medium" style={{ color: 'var(--color-heading)' }}>{t.title}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--color-body)' }}>{t.category}</td>
                      <td className="py-3 px-4" style={{ color: 'var(--color-body)' }}>{t.raisedBy?.name || 'Resident'}</td>
                      <td className="py-3 px-4"><Badge variant={STATUS_VARIANT[t.status] || 'neutral'} dot>{t.status}</Badge></td>
                      <td className="py-3 px-4">
                        <span className="text-xs font-medium" style={{ color: 'var(--color-tertiary)' }}>
                          {t.slaDeadline ? new Date(t.slaDeadline).toLocaleDateString() : 'None'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button className="text-xs font-medium transition-colors" style={{ color: 'var(--color-electric-blue)' }} onClick={(e) => { e.stopPropagation(); setSelectedTicket(t); }}>Update</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
            {loading ? (
                Array.from({ length: 4 }).map((_, idx) => (
                  <div key={idx} className="border p-4 rounded-[8px] bg-white shadow-sm flex flex-col gap-3 animate-pulse" style={{ borderColor: 'var(--color-cloud)' }}>
                    <div className="h-4 bg-gray-200 rounded-[4px] w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded-[4px] w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded-[4px] w-full mt-2"></div>
                  </div>
                ))
            ) : tickets.length === 0 ? (
                <div className="py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No active complaints found in this society.</div>
            ) : (
                tickets.map((t) => (
                  <div key={t.id} className="border p-4 rounded-[8px] bg-white shadow-sm flex flex-col gap-3" style={{ borderColor: 'var(--color-cloud)' }}>
                    <div className="flex justify-between items-start gap-2">
                       <div className="flex-1">
                          <p className="font-semibold text-sm" style={{ color: 'var(--color-heading)' }}>{t.title}</p>
                          <p className="text-xs mt-1 font-medium" style={{ color: 'var(--color-tertiary)' }}>{t.category} <span className="mx-1">•</span> <span className="font-mono bg-slate-100 rounded px-1 text-[10px]">{t.ticketId.substring(0,8)}</span></p>
                       </div>
                       <Badge variant={STATUS_VARIANT[t.status] || 'neutral'} dot>{t.status}</Badge>
                    </div>
                    <div className="flex justify-between items-center mt-1 pt-3 border-t" style={{ borderColor: 'var(--color-cloud)' }}>
                       <div className="flex-1">
                          <p className="text-[11px] uppercase tracking-wide font-semibold mb-1" style={{ color: 'var(--color-placeholder)' }}>Raised By</p>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{t.raisedBy?.name || 'Resident'}</p>
                       </div>
                       <Button variant="outline" className="flex-shrink-0" onClick={() => setSelectedTicket(t)}>Update Status</Button>
                    </div>
                  </div>
                ))
            )}
          </div>
        </div>
      </Card>

      {/* Modals */}
      <AddComplaintModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSuccess={fetchTickets} 
      />
      <UpdateComplaintModal 
        isOpen={!!selectedTicket} 
        onClose={() => setSelectedTicket(null)} 
        onSuccess={fetchTickets} 
        ticket={selectedTicket} 
      />
    </DashboardLayout>
  )
}
