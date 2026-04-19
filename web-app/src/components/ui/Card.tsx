import { type ReactNode } from 'react'

// ─────────────────────────────────────────────────────────
// Card — Tesla-inspired surface container.
// No shadow, no border. 12px radius. Spacing-based separation.
// ─────────────────────────────────────────────────────────

interface CardProps {
  title?:    ReactNode
  subtitle?: string
  action?:   ReactNode
  footer?:   ReactNode
  children:  ReactNode
  className?: string
  noPadding?: boolean
}

export function Card({ title, subtitle, action, footer, children, className = '', noPadding = false }: CardProps) {
  return (
    <div className={`rounded-[12px] bg-white ${noPadding ? '' : 'p-6'} ${className}`}>
      {(title || action) && (
        <div className={`flex items-start justify-between gap-4 ${noPadding ? 'p-6 pb-4' : 'mb-4'}`}>
          <div>
            {title && (
              typeof title === 'string'
                ? <h3 className="text-[17px] font-medium leading-tight" style={{ color: 'var(--color-heading)' }}>{title}</h3>
                : title
            )}
            {subtitle && (
              <p className="text-sm mt-0.5" style={{ color: 'var(--color-tertiary)' }}>{subtitle}</p>
            )}
          </div>
          {action && <div className="shrink-0">{action}</div>}
        </div>
      )}
      <div className={noPadding ? '' : ''}>{children}</div>
      {footer && (
        <div className="mt-4 pt-4" style={{ borderTop: '1px solid var(--color-cloud)' }}>{footer}</div>
      )}
    </div>
  )
}
