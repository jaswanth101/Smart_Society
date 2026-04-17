type BadgeVariant = 'success' | 'warning' | 'danger' | 'info' | 'neutral'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  dot?:     boolean
}

// ─────────────────────────────────────────────────────────
// Badge — Inline status chip. Maps to design system .badge classes.
// ─────────────────────────────────────────────────────────

export function Badge({ children, variant = 'neutral', dot = false }: BadgeProps) {
  return (
    <span className={`badge badge--${variant}`}>
      {dot && (
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'currentColor', opacity: 0.6 }}
          aria-hidden
        />
      )}
      {children}
    </span>
  )
}
