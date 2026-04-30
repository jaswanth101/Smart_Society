// ─────────────────────────────────────────────────────────
// Formatting Utilities — Indian locale, currency, dates.
// Used across Dashboard, Finance Overview, Finance Reports.
// ─────────────────────────────────────────────────────────

/**
 * Format a number as Indian Rupee currency.
 * Example: 120000 → "₹1,20,000"
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format a number as compact Indian currency.
 * Example: 120000 → "₹1.2L", 42000000 → "₹4.2Cr"
 */
export function formatCompactCurrency(amount: number): string {
  const abs = Math.abs(amount)
  const sign = amount < 0 ? '-' : ''

  if (abs >= 1_00_00_000) {
    // Crores
    return `${sign}₹${(abs / 1_00_00_000).toFixed(1)}Cr`
  }
  if (abs >= 1_00_000) {
    // Lakhs
    return `${sign}₹${(abs / 1_00_000).toFixed(1)}L`
  }
  if (abs >= 1_000) {
    // Thousands
    return `${sign}₹${(abs / 1_000).toFixed(1)}K`
  }
  return `${sign}₹${abs}`
}

/**
 * Format a number as percentage.
 * Example: 92 → "92%", 92.456 → "92.5%"
 */
export function formatPercentage(value: number, decimals = 0): string {
  return `${value.toFixed(decimals)}%`
}

/**
 * Compute trend between current and previous values.
 * Returns { label: '+8%', isPositive: true }
 */
export function formatTrend(
  current: number,
  previous: number
): { label: string; isPositive: boolean } {
  if (previous === 0) {
    return { label: current > 0 ? '+100%' : '0%', isPositive: current >= 0 }
  }
  const change = ((current - previous) / previous) * 100
  const rounded = Math.round(change)
  return {
    label: `${rounded >= 0 ? '+' : ''}${rounded}%`,
    isPositive: rounded >= 0,
  }
}

/**
 * Format a date string or Date object as relative time.
 * Example: "2h ago", "3d ago", "Just now"
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date()
  const then = new Date(date)
  const diffMs = now.getTime() - then.getTime()
  const diffSec = Math.floor(diffMs / 1000)
  const diffMin = Math.floor(diffSec / 60)
  const diffHour = Math.floor(diffMin / 60)
  const diffDay = Math.floor(diffHour / 24)

  if (diffSec < 60) return 'Just now'
  if (diffMin < 60) return `${diffMin}m ago`
  if (diffHour < 24) return `${diffHour}h ago`
  if (diffDay < 30) return `${diffDay}d ago`
  return then.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
}

/**
 * Standard month ordering for charts.
 * Ensures months display Jan → Dec regardless of API order.
 */
export const MONTH_ORDER = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]

/**
 * Short month labels for compact charts.
 */
export const MONTH_SHORT: Record<string, string> = {
  January: 'Jan', February: 'Feb', March: 'Mar', April: 'Apr',
  May: 'May', June: 'Jun', July: 'Jul', August: 'Aug',
  September: 'Sep', October: 'Oct', November: 'Nov', December: 'Dec',
}
