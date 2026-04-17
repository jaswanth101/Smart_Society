import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, XCircle, Clock, User, Home, FileText } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// MembersApprovalsPage — Tesla-inspired KYC / move-in approvals
// ─────────────────────────────────────────────────────────

type Approval = {
  id: string; name: string; flat: string; type: 'MOVE_IN' | 'KYC' | 'TENANT_ADD'
  submittedAt: string; documents: number; status: 'PENDING'
}

const MOCK_APPROVALS: Approval[] = [
  { id: 'ap1', name: 'Ananya Gupta', flat: 'B-404', type: 'MOVE_IN', submittedAt: '2 hours ago', documents: 4, status: 'PENDING' },
  { id: 'ap2', name: 'Rohit Menon', flat: 'A-102', type: 'KYC', submittedAt: '1 day ago', documents: 3, status: 'PENDING' },
  { id: 'ap3', name: 'Fatima Syed', flat: 'C-205', type: 'TENANT_ADD', submittedAt: '3 days ago', documents: 5, status: 'PENDING' },
  { id: 'ap4', name: 'Karthik R', flat: 'B-301', type: 'MOVE_IN', submittedAt: '5 days ago', documents: 4, status: 'PENDING' },
]

const TYPE_LABEL: Record<string, string> = { MOVE_IN: 'Move-in', KYC: 'KYC update', TENANT_ADD: 'Tenant addition' }

export default function MembersApprovalsPage() {
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Pending approvals</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>KYC verifications, tenant move-ins, and member onboarding requests.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending', value: '4', color: '#f59e0b' },
          { label: 'Approved this month', value: '12', color: 'var(--color-success)' },
          { label: 'Rejected this month', value: '1', color: 'var(--color-danger)' },
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
            <p className="text-2xl font-medium" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Approval cards */}
      <div className="space-y-4">
        {MOCK_APPROVALS.map(a => (
          <Card key={a.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-[4px] flex items-center justify-center text-white font-medium shrink-0"
                  style={{ background: 'var(--color-electric-blue)' }}>
                  {a.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-[17px] font-medium" style={{ color: 'var(--color-heading)' }}>{a.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs" style={{ color: 'var(--color-tertiary)' }}>
                    <span className="flex items-center gap-1"><Home size={12} />{a.flat}</span>
                    <Badge variant="neutral">{TYPE_LABEL[a.type]}</Badge>
                    <span className="flex items-center gap-1"><FileText size={12} />{a.documents} documents</span>
                    <span className="flex items-center gap-1"><Clock size={12} />{a.submittedAt}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button className="px-4 py-2 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 transition-colors duration-[330ms]"
                  style={{ background: 'var(--color-electric-blue)' }}>
                  <CheckCircle size={14} /> Approve
                </button>
                <button className="px-4 py-2 rounded-[4px] text-sm font-medium flex items-center gap-1.5 transition-colors duration-[330ms]"
                  style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-danger)' }}>
                  <XCircle size={14} /> Reject
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  )
}
