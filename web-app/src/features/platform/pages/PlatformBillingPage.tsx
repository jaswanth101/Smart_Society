import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { CreditCard, TrendingUp, Download } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// PlatformBillingPage — Super Admin revenue & billing
// ─────────────────────────────────────────────────────────

export default function PlatformBillingPage() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Platform billing</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>SaaS subscriptions, revenue, and payment gateway logs.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}>
          <Download size={16} /> Export ledger
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'MRR', value: '₹4.2L', trend: '+12%' },
          { label: 'Active subscriptions', value: '4' },
          { label: 'Pending invoices', value: '1' },
          { label: 'Lifetime revenue', value: '₹38.6L' },
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-5" style={{ background: 'var(--color-white)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
            <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{s.value}</p>
            {s.trend && <p className="text-xs font-medium mt-1 flex items-center gap-1" style={{ color: 'var(--color-success)' }}><TrendingUp size={12} />{s.trend}</p>}
          </div>
        ))}
      </div>

      <Card title="Subscription history" subtitle="Last 6 months">
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm">
            <thead><tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
              {['Invoice', 'Society', 'Plan', 'Amount', 'Date', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {[
                { inv: 'INV-2026-04', society: 'Alpha Society', plan: 'Premium', amount: '₹1,20,000', date: 'Apr 1, 2026', status: 'Paid' },
                { inv: 'INV-2026-04', society: 'Green Meadows', plan: 'Standard', amount: '₹45,000', date: 'Apr 1, 2026', status: 'Paid' },
                { inv: 'INV-2026-04', society: 'Sunrise Township', plan: 'Premium', amount: '₹2,40,000', date: 'Apr 1, 2026', status: 'Overdue' },
                { inv: 'INV-2026-04', society: 'Lake View', plan: 'Standard', amount: '₹25,000', date: 'Apr 1, 2026', status: 'Paid' },
              ].map((r, i) => (
                <tr key={i} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms]" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--color-placeholder)' }}>{r.inv}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{r.society}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{r.plan}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{r.amount}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{r.date}</td>
                  <td className="px-4 py-3"><span className="text-xs font-medium" style={{ color: r.status === 'Paid' ? 'var(--color-success)' : 'var(--color-danger)' }}>{r.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
