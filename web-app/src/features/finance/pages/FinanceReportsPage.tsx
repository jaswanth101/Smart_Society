import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { BarChart3, TrendingUp, TrendingDown, Download, Calendar } from 'lucide-react'
import { useState } from 'react'

// ─────────────────────────────────────────────────────────
// FinanceReportsPage — Tesla-inspired analytics dashboard
// ─────────────────────────────────────────────────────────

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
const MOCK_MONTHLY = [
  { month: 'Jan', income: 820000, expense: 560000 },
  { month: 'Feb', income: 780000, expense: 490000 },
  { month: 'Mar', income: 910000, expense: 620000 },
  { month: 'Apr', income: 845000, expense: 580000 },
]

export default function FinanceReportsPage() {
  const [period, setPeriod] = useState('FY 2025-26')
  const maxVal = Math.max(...MOCK_MONTHLY.map(m => Math.max(m.income, m.expense)))

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Financial reports</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Custom report builder, P&L, and audit-ready exports.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-colors duration-[330ms]"
          style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}>
          <Download size={16} /> Export PDF
        </button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total income', value: '₹33.5L', trend: '+8%', up: true },
          { label: 'Total expenses', value: '₹22.5L', trend: '+3%', up: false },
          { label: 'Net surplus', value: '₹11.0L', trend: '+18%', up: true },
          { label: 'Collection rate', value: '92%', trend: '+2%', up: true },
        ].map(k => (
          <div key={k.label} className="rounded-[12px] p-5" style={{ background: 'var(--color-white)' }}>
            <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-tertiary)' }}>{k.label}</p>
            <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{k.value}</p>
            <div className="flex items-center gap-1 mt-1 text-xs font-medium" style={{ color: k.up ? 'var(--color-success)' : 'var(--color-danger)' }}>
              {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />} {k.trend}
              <span style={{ color: 'var(--color-placeholder)' }}>vs prev yr</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart area */}
        <div className="col-span-1 lg:col-span-2">
          <Card title="Monthly income vs expenses" subtitle={period}>
            <div className="mt-4 space-y-4">
              {MOCK_MONTHLY.map(m => (
                <div key={m.month}>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="font-medium w-8" style={{ color: 'var(--color-heading)' }}>{m.month}</span>
                    <span style={{ color: 'var(--color-placeholder)' }}>₹{(m.income/100000).toFixed(1)}L / ₹{(m.expense/100000).toFixed(1)}L</span>
                  </div>
                  <div className="flex gap-1.5">
                    <div className="h-5 rounded-[4px] transition-all duration-[330ms]" style={{ width: `${(m.income / maxVal) * 100}%`, background: 'var(--color-electric-blue)' }} />
                    <div className="h-5 rounded-[4px] transition-all duration-[330ms]" style={{ width: `${(m.expense / maxVal) * 100}%`, background: 'var(--color-cloud)' }} />
                  </div>
                </div>
              ))}
              <div className="flex items-center gap-6 pt-2 text-xs" style={{ color: 'var(--color-placeholder)' }}>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-[2px]" style={{ background: 'var(--color-electric-blue)' }} /> Income</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-[2px]" style={{ background: 'var(--color-cloud)' }} /> Expenses</span>
              </div>
            </div>
          </Card>
        </div>

        {/* Breakdown */}
        <div className="col-span-1">
          <Card title="Expense breakdown" subtitle="Current month">
            <div className="space-y-3 mt-4">
              {[
                { category: 'Staff salaries', amount: '₹2,80,000', pct: 48 },
                { category: 'Electricity (common)', amount: '₹1,20,000', pct: 21 },
                { category: 'Water supply', amount: '₹65,000', pct: 11 },
                { category: 'Lift AMC', amount: '₹45,000', pct: 8 },
                { category: 'Garden & landscaping', amount: '₹35,000', pct: 6 },
                { category: 'Miscellaneous', amount: '₹35,000', pct: 6 },
              ].map(e => (
                <div key={e.category}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span style={{ color: 'var(--color-heading)' }}>{e.category}</span>
                    <span className="font-medium" style={{ color: 'var(--color-heading)' }}>{e.amount}</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--color-light-ash)' }}>
                    <div className="h-1.5 rounded-full transition-all duration-[330ms]" style={{ width: `${e.pct}%`, background: 'var(--color-electric-blue)' }} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
