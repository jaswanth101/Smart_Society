import { type ReactNode } from 'react'

// ─────────────────────────────────────────────────────────
// StatCard — Tesla-inspired KPI widget.
// No shadows, 12px radius, clean separation via spacing.
// ─────────────────────────────────────────────────────────

interface StatCardProps {
  title:       string
  value:       string | number
  icon:        ReactNode
  iconColor?:  string
  trend?:      number
  description?: string
}

export function StatCard({ title, value, icon, iconColor = '#3E6AE1', trend, description }: StatCardProps) {
  const isPositive = trend !== undefined && trend >= 0

  return (
    <div
      className="flex flex-col gap-3 p-5 rounded-[12px] transition-colors duration-[330ms] hover:bg-[#F4F4F4]"
      style={{ background: 'var(--color-white)' }}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-medium" style={{ color: 'var(--color-tertiary)' }}>{title}</p>
        <div
          className="flex items-center justify-center w-10 h-10 rounded-[4px]"
          style={{ background: `${iconColor}14` }}
        >
          <span style={{ color: iconColor }}>{icon}</span>
        </div>
      </div>

      <div>
        <p className="text-2xl font-medium leading-none" style={{ color: 'var(--color-heading)' }}>{value}</p>
        {description && (
          <p className="text-xs mt-1" style={{ color: 'var(--color-placeholder)' }}>{description}</p>
        )}
      </div>

      {trend !== undefined && (
        <div className="flex items-center gap-1 text-xs font-medium">
          <span style={{ color: isPositive ? 'var(--color-success)' : 'var(--color-danger)' }}>
            {isPositive ? '↑' : '↓'} {Math.abs(trend)}%
          </span>
          <span style={{ color: 'var(--color-placeholder)' }}>vs last month</span>
        </div>
      )}
    </div>
  )
}
