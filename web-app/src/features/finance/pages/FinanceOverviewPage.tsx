import { DashboardLayout } from '@/layouts/DashboardLayout'
import { StatCard } from '@/components/data-display/StatCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Wallet, TrendingDown, TrendingUp, AlertOctagon } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// FinanceOverviewPage — Society Fund Balance & P&L.
// Role access: President, Treasurer.
// ─────────────────────────────────────────────────────────
export default function FinanceOverviewPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Finance Overview</h1>
          <p className="text-sm text-slate-500">Society fund balance, income and expenditure</p>
        </div>
        <Button variant="outline">Export Report</Button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Corpus Fund Balance"  value="₹14.2L" icon={<Wallet size={20} />}       iconColor="#10b981" description="As on today" />
        <StatCard title="This Month Income"    value="₹2.84L" icon={<TrendingUp size={20} />}   iconColor="#3b82f6" trend={8} />
        <StatCard title="This Month Expenses"  value="₹1.12L" icon={<TrendingDown size={20} />} iconColor="#f59e0b" trend={-3} />
        <StatCard title="Outstanding Dues"     value="₹1.76L" icon={<AlertOctagon size={20} />} iconColor="#ef4444" description="34 flats" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Monthly P&L Trend" subtitle="Last 6 months">
          <div className="skeleton h-48 w-full" />
        </Card>
        <Card title="Budget vs Actuals" subtitle="Current financial year">
          <div className="skeleton h-48 w-full" />
        </Card>
      </div>
    </DashboardLayout>
  )
}
