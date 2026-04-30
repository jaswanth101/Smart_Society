import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { TrendingUp, TrendingDown, Download } from 'lucide-react'
import { useState } from 'react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { formatCompactCurrency, formatCurrency, formatPercentage, MONTH_ORDER, MONTH_SHORT } from '@/lib/format'
import type { FinancialSummary } from '@/types/api-contracts'

// ─────────────────────────────────────────────────────────
// FinanceReportsPage — Tesla-inspired analytics dashboard
// All data sourced from GET /finance/reports/summary
// ─────────────────────────────────────────────────────────

const currentYear = new Date().getFullYear()
const YEAR_OPTIONS = [currentYear, currentYear - 1, currentYear - 2]

export default function FinanceReportsPage() {
  const [selectedYear, setSelectedYear] = useState(currentYear)

  const { data: summary, isLoading, error, refetch } = useApiQuery<FinancialSummary>(
    '/finance/reports/summary',
    { params: { year: selectedYear } }
  )

  // Merge income + expense into a unified monthly dataset, sorted by calendar order
  const monthlyData = summary
    ? MONTH_ORDER
        .map(month => {
          const income = summary.monthlyTrend.find(m => m.month === month)?.collected ?? 0
          const expense = summary.monthlyExpenseTrend.find(m => m.month === month)?.spent ?? 0
          return { month, income, expense }
        })
        .filter(m => m.income > 0 || m.expense > 0)
    : []

  const maxVal = monthlyData.length > 0
    ? Math.max(...monthlyData.map(m => Math.max(m.income, m.expense)))
    : 1

  // Compute KPIs from real data
  const totalIncome = summary?.income.collected ?? 0
  const totalExpenses = summary?.expenses.approved ?? 0
  const netSurplus = summary?.profitLoss ?? 0
  const collectionRate = summary?.collectionRate ?? 0

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Financial reports</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>P&L analytics, expense breakdown — live from database.</p>
        </div>
        <div className="flex gap-3 self-start sm:self-auto">
          {/* Year selector */}
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            className="px-3 py-2.5 rounded-[4px] text-sm font-medium transition-colors duration-[330ms]"
            style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)', background: 'var(--color-white)' }}
          >
            {YEAR_OPTIONS.map(y => (
              <option key={y} value={y}>FY {y}-{(y + 1).toString().slice(-2)}</option>
            ))}
          </select>
          <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium flex items-center gap-1.5 shrink-0 transition-colors duration-[330ms]"
            style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}>
            <Download size={16} /> Export PDF
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="rounded-[12px] p-5 animate-pulse" style={{ background: 'var(--color-white)' }}>
              <div className="h-3 bg-gray-200 rounded-[4px] w-1/2 mb-3" />
              <div className="h-7 bg-gray-200 rounded-[4px] w-2/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded-[4px] w-1/3" />
            </div>
          ))
        ) : error ? (
          <div className="col-span-4 py-6 text-center">
            <p className="text-sm" style={{ color: 'var(--color-danger)' }}>Failed to load report data</p>
            <button onClick={() => refetch()} className="text-xs font-medium mt-2" style={{ color: 'var(--color-electric-blue)' }}>Retry</button>
          </div>
        ) : (
          [
            { label: 'Total income', value: formatCompactCurrency(totalIncome), up: true },
            { label: 'Total expenses', value: formatCompactCurrency(totalExpenses), up: false },
            { label: 'Net surplus', value: formatCompactCurrency(netSurplus), up: netSurplus >= 0 },
            { label: 'Collection rate', value: formatPercentage(collectionRate), up: true },
          ].map(k => (
            <div key={k.label} className="rounded-[12px] p-5" style={{ background: 'var(--color-white)' }}>
              <p className="text-xs font-medium mb-2" style={{ color: 'var(--color-tertiary)' }}>{k.label}</p>
              <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{k.value}</p>
              <div className="flex items-center gap-1 mt-1 text-xs font-medium" style={{ color: k.up ? 'var(--color-success)' : 'var(--color-danger)' }}>
                {k.up ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                <span style={{ color: 'var(--color-placeholder)' }}>FY {selectedYear}</span>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chart area */}
        <div className="col-span-1 lg:col-span-2">
          <Card title="Monthly income vs expenses" subtitle={`FY ${selectedYear}-${(selectedYear + 1).toString().slice(-2)}`}>
            {isLoading ? (
              <div className="h-48 w-full animate-pulse bg-gray-100 rounded-[4px] mt-4" />
            ) : monthlyData.length === 0 ? (
              <div className="h-48 flex items-center justify-center mt-4">
                <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No transaction data for FY {selectedYear}</p>
              </div>
            ) : (
              <div className="mt-4 space-y-4">
                {monthlyData.map(m => (
                  <div key={m.month}>
                    <div className="flex items-center justify-between text-xs mb-1.5">
                      <span className="font-medium w-8" style={{ color: 'var(--color-heading)' }}>{MONTH_SHORT[m.month] || m.month.slice(0, 3)}</span>
                      <span style={{ color: 'var(--color-placeholder)' }}>
                        {formatCompactCurrency(m.income)} / {formatCompactCurrency(m.expense)}
                      </span>
                    </div>
                    <div className="flex gap-1.5">
                      <div
                        className="h-5 rounded-[4px] transition-all duration-[330ms]"
                        style={{ width: `${(m.income / maxVal) * 100}%`, background: 'var(--color-electric-blue)', minWidth: m.income > 0 ? '4px' : '0' }}
                      />
                      <div
                        className="h-5 rounded-[4px] transition-all duration-[330ms]"
                        style={{ width: `${(m.expense / maxVal) * 100}%`, background: 'var(--color-cloud)', minWidth: m.expense > 0 ? '4px' : '0' }}
                      />
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-6 pt-2 text-xs" style={{ color: 'var(--color-placeholder)' }}>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-[2px]" style={{ background: 'var(--color-electric-blue)' }} /> Income</span>
                  <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-[2px]" style={{ background: 'var(--color-cloud)' }} /> Expenses</span>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Expense Breakdown */}
        <div className="col-span-1">
          <Card title="Expense breakdown" subtitle="Approved by category">
            {isLoading ? (
              <div className="h-48 w-full animate-pulse bg-gray-100 rounded-[4px] mt-4" />
            ) : !summary || summary.expenses.byCategory.length === 0 ? (
              <div className="h-48 flex items-center justify-center mt-4">
                <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No approved expenses yet</p>
              </div>
            ) : (
              <div className="space-y-3 mt-4">
                {summary.expenses.byCategory.map(e => {
                  const pct = summary.expenses.approved > 0
                    ? Math.round((e.amount / summary.expenses.approved) * 100)
                    : 0
                  return (
                    <div key={e.category}>
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span style={{ color: 'var(--color-heading)' }}>{e.category}</span>
                        <span className="font-medium" style={{ color: 'var(--color-heading)' }}>{formatCurrency(e.amount)}</span>
                      </div>
                      <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--color-light-ash)' }}>
                        <div className="h-1.5 rounded-full transition-all duration-[330ms]" style={{ width: `${pct}%`, background: 'var(--color-electric-blue)' }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
