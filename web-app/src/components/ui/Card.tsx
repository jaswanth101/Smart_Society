import { type ReactNode } from 'react'

// ─────────────────────────────────────────────────────────
// Card — Surface container for dashboard widgets and sections.
// Supports: header with title/action, body, footer slots.
// ─────────────────────────────────────────────────────────

interface CardProps {
  title?:    string
  subtitle?: string
  action?:   ReactNode
  footer?:   ReactNode
  children:  ReactNode
  className?: string
  noPadding?: boolean
}

export function Card({ title, subtitle, action, footer, children, className = '', noPadding = false }: CardProps) {
  return (
    <div className={`card ${className}`}>
      {(title || action) && (
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            {title && (
              <h3 className="text-base font-semibold text-slate-800 leading-tight">{title}</h3>
            )}
            {subtitle && (
              <p className="text-sm text-slate-500 mt-0.5">{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '-mx-6 -mb-6' : ''}>{children}</div>
      {footer && (
        <div className="mt-4 pt-4 border-t border-slate-100">{footer}</div>
      )}
    </div>
  )
}
