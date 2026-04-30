import { DashboardLayout } from '@/layouts/DashboardLayout'
import { StatCard } from '@/components/data-display/StatCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Wallet, TrendingDown, TrendingUp, AlertOctagon, RefreshCw } from 'lucide-react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { formatCompactCurrency, formatCurrency, MONTH_ORDER, MONTH_SHORT } from '@/lib/format'
import type { FinancialSummary } from '@/types/api-contracts'

// ─────────────────────────────────────────────────────────
// FinanceOverviewPage — Society Fund Balance & P&L.
// Role access: President, Treasurer.
// All data sourced from GET /finance/reports/summary
// ─────────────────────────────────────────────────────────

export default function FinanceOverviewPage() {
  const { data: summary, isLoading, error, refetch } = useApiQuery<FinancialSummary>('/finance/reports/summary')

  // Compute current month's income from the trend data
  const currentMonthName = new Date().toLocaleString('default', { month: 'long' })
  const currentMonthIncome = summary?.monthlyTrend.find(m => m.month === currentMonthName)?.collected ?? 0
  const currentMonthExpense = summary?.monthlyExpenseTrend.find(m => m.month === currentMonthName)?.spent ?? 0

  // Sort monthly trend by calendar order for the chart
  const sortedTrend = summary
    ? MONTH_ORDER
        .map(month => {
          const income = summary.monthlyTrend.find(m => m.month === month)?.collected ?? 0
          const expense = summary.monthlyExpenseTrend.find(m => m.month === month)?.spent ?? 0
          return { month, income, expense }
        })
        .filter(m => m.income > 0 || m.expense > 0)
    : []

  const maxChartVal = sortedTrend.length > 0
    ? Math.max(...sortedTrend.map(m => Math.max(m.income, m.expense)))
    : 1

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Finance Overview</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Society fund balance, income and expenditure — live from database</p>
        </div>
        <Button variant="outline" onClick={() => refetch()} icon={<RefreshCw size={15} />}>Refresh</Button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="p-5 rounded-[12px] animate-pulse" style={{ background: 'var(--color-white)' }}>
              <div className="h-4 bg-gray-200 rounded-[4px] w-1/2 mb-3" />
              <div className="h-8 bg-gray-200 rounded-[4px] w-1/3 mb-2" />
              <div className="h-3 bg-gray-200 rounded-[4px] w-2/3" />
            </div>
          ))
        ) : error ? (
          <div className="col-span-4 py-6 text-center">
            <p className="text-sm" style={{ color: 'var(--color-danger)' }}>Failed to load financial data</p>
            <button onClick={() => refetch()} className="text-xs font-medium mt-2" style={{ color: 'var(--color-electric-blue)' }}>Retry</button>
          </div>
        ) : summary ? (
          <>
            <StatCard
              title="Net Surplus (YTD)"
              value={formatCompactCurrency(summary.profitLoss)}
              icon={<Wallet size={20} />}
              iconColor="#10b981"
              description={`FY ${summary.year}`}
            />
            <StatCard
              title="This Month Income"
              value={formatCompactCurrency(currentMonthIncome)}
              icon={<TrendingUp size={20} />}
              iconColor="#3b82f6"
              description={`${summary.income.paidCount} payments received`}
            />
            <StatCard
              title="This Month Expenses"
              value={formatCompactCurrency(currentMonthExpense)}
              icon={<TrendingDown size={20} />}
              iconColor="#f59e0b"
              description={`${summary.expenses.count} total expenses`}
            />
            <StatCard
              title="Outstanding Dues"
              value={formatCompactCurrency(summary.income.pending)}
              icon={<AlertOctagon size={20} />}
              iconColor="#ef4444"
              description={`${summary.income.pendingCount} unpaid invoices`}
            />
          </>
        ) : null}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Monthly P&L Trend */}
        <Card title="Monthly P&L Trend" subtitle={summary ? `FY ${summary.year}` : 'Loading…'}>
          {isLoading ? (
            <div className="h-48 w-full animate-pulse bg-gray-100 rounded-[4px]" />
          ) : sortedTrend.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No financial data for this year yet</p>
            </div>
          ) : (
            <div className="mt-4 space-y-4">
              {sortedTrend.map(m => (
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
                      style={{ width: `${(m.income / maxChartVal) * 100}%`, background: 'var(--color-electric-blue)', minWidth: m.income > 0 ? '4px' : '0' }}
                    />
                    <div
                      className="h-5 rounded-[4px] transition-all duration-[330ms]"
                      style={{ width: `${(m.expense / maxChartVal) * 100}%`, background: 'var(--color-cloud)', minWidth: m.expense > 0 ? '4px' : '0' }}
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

        {/* Expense Breakdown */}
        <Card title="Expense Breakdown" subtitle="Approved expenses by category">
          {isLoading ? (
            <div className="h-48 w-full animate-pulse bg-gray-100 rounded-[4px]" />
          ) : !summary || summary.expenses.byCategory.length === 0 ? (
            <div className="h-48 flex items-center justify-center">
              <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No approved expenses recorded yet</p>
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
                      <div
                        className="h-1.5 rounded-full transition-all duration-[330ms]"
                        style={{ width: `${pct}%`, background: 'var(--color-electric-blue)' }}
                      />
                    </div>
                  </div>
                )
              })}
              <div className="pt-2 text-right">
                <span className="text-xs font-medium" style={{ color: 'var(--color-tertiary)' }}>
                  Total: {formatCurrency(summary.expenses.approved)}
                </span>
              </div>
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  )
}
