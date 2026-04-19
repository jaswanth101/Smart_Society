import { useState, useEffect } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CreditCard, Download, CheckCircle, AlertCircle, Clock } from 'lucide-react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// ResidentFinancePage — Live invoices from PostgreSQL
// ─────────────────────────────────────────────────────────

export default function ResidentFinancePage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/finance/invoices')
      .then(res => setInvoices(res.data))
      .catch(err => console.error('Failed to load invoices', err))
      .finally(() => setLoading(false))
  }, [])

  const pending = invoices.find(i => i.status === 'PENDING' || i.status === 'OVERDUE')
  const paid = invoices.filter(i => i.status === 'PAID')

  return (
    <ResidentLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Payments</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Maintenance dues, receipts, and payment history.</p>
      </div>

      {/* Current dues */}
      <Card className="mb-6">
        {loading ? (
          <div className="h-16 bg-gray-200 rounded animate-pulse" />
        ) : pending ? (
          <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
            <div>
              <p className="text-sm" style={{ color: 'var(--color-tertiary)' }}>Current dues — {pending.month} {pending.year}</p>
              <p className="text-3xl font-medium mt-1" style={{ color: 'var(--color-heading)' }}>₹{pending.amount?.toLocaleString()}</p>
              <p className="text-xs mt-1 flex items-center gap-1" style={{ color: pending.status === 'OVERDUE' ? 'var(--color-danger)' : '#f59e0b' }}>
                {pending.status === 'OVERDUE' ? <AlertCircle size={12} /> : <Clock size={12} />}
                {pending.status === 'OVERDUE' ? 'Overdue!' : `Due by ${new Date(pending.dueDate).toLocaleDateString()}`}
              </p>
            </div>
            <button className="px-6 py-2.5 rounded-[4px] text-sm font-medium text-white transition-colors" style={{ background: 'var(--color-electric-blue)' }}>
              <CreditCard size={16} className="inline mr-1.5" />Pay now
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <CheckCircle size={20} style={{ color: '#10b981' }} />
            <p className="text-sm font-medium" style={{ color: '#10b981' }}>All dues are cleared. You're up to date!</p>
          </div>
        )}
      </Card>

      {/* Payment history */}
      <Card title="Payment history">
        {loading ? (
          <div className="space-y-3 mt-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-12 bg-gray-200 rounded animate-pulse" />)}</div>
        ) : paid.length === 0 ? (
          <p className="text-sm py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No payment history yet.</p>
        ) : (
          <div className="space-y-0 mt-4">
            {paid.map((p: any) => (
              <div key={p.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-[4px] flex items-center justify-center" style={{ background: '#10b98114', color: '#10b981' }}><CheckCircle size={16} /></div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{p.month} {p.year}</p>
                    <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>Paid {p.paidAt ? new Date(p.paidAt).toLocaleDateString() : ''}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>₹{p.amount?.toLocaleString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </ResidentLayout>
  )
}
