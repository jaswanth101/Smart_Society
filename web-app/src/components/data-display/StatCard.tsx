import { type ReactNode } from 'react'

// ─────────────────────────────────────────────────────────
// StatCard — KPI widget for dashboard grids.
// Displays: icon, label, value, trend, and description.
// ─────────────────────────────────────────────────────────

interface StatCardProps {
  title:       string
  value:       string | number
  icon:        ReactNode
  iconColor?:  string
  trend?:      number   // e.g. +12 means +12%, negative = bad
  description?: string
}

export function StatCard({ title, value, icon, iconColor = '#3b82f6', trend, description }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <div className="card flex flex-col gap-3 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <div
          className="flex items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: `${iconColor}18` }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
      </div>

      <div>
        <p className="text-2xl font-bold text-slate-900 leading-none">{value}</p>
        {description && (
          <p className="text-xs text-slate-500 mt-1">{description}</p>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs font-medium">
          <span className={isPositive ? 'text-emerald-600' : 'text-red-500'}>
            {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span className="text-slate-400">vs last month</span>
        </div>
      )}
    </div>
  )
}
