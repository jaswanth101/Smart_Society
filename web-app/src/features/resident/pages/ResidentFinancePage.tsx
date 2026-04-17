import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CreditCard, Download, CheckCircle } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ResidentFinancePage — Pay dues, view receipts
// ─────────────────────────────────────────────────────────

export default function ResidentFinancePage() {
  return (
    <ResidentLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Payments</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Maintenance dues, receipts, and payment history.</p>
      </div>

      {/* Current dues */}
      <Card className="mb-6">
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
          <div>
            <p className="text-sm" style={{ color: 'var(--color-tertiary)' }}>Current dues — April 2026</p>
            <p className="text-3xl font-medium mt-1" style={{ color: 'var(--color-heading)' }}>₹4,500</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-danger)' }}>Due by April 5</p>
          </div>
          <button className="px-6 py-2.5 rounded-[4px] text-sm font-medium text-white transition-colors duration-[330ms]" style={{ background: 'var(--color-electric-blue)' }}>
            <CreditCard size={16} className="inline mr-1.5" />Pay now
          </button>
        </div>
      </Card>

      {/* Payment history */}
      <Card title="Payment history">
        <div className="space-y-0 mt-4">
          {[
            { month: 'March 2026', amount: '₹4,500', date: 'Mar 3, 2026', method: 'UPI', txn: 'TXN-8847291' },
            { month: 'February 2026', amount: '₹4,500', date: 'Feb 5, 2026', method: 'Net Banking', txn: 'TXN-7736182' },
            { month: 'January 2026', amount: '₹4,500', date: 'Jan 4, 2026', method: 'UPI', txn: 'TXN-6625073' },
          ].map((p, i) => (
            <div key={i} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-[4px] flex items-center justify-center" style={{ background: '#10b98114', color: 'var(--color-success)' }}><CheckCircle size={16} /></div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{p.month}</p>
                  <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>{p.txn} · {p.method} · {p.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{p.amount}</span>
                <button className="p-1.5 rounded-[4px]" style={{ color: 'var(--color-electric-blue)' }}><Download size={14} /></button>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </ResidentLayout>
  )
}
