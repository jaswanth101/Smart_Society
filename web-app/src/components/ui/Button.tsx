import { type ButtonHTMLAttributes, type ReactNode } from 'react'

// ─────────────────────────────────────────────────────────
// Button — Primary design system atom.
// Supports: primary, secondary, danger, ghost variants.
// Supports: sm, md, lg sizes. Handles loading/disabled states.
// ─────────────────────────────────────────────────────────

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost' | 'outline'
type Size    = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:  Variant
  size?:     Size
  loading?:  boolean
  icon?:     ReactNode
  children:  ReactNode
}

const VARIANT_STYLES: Record<Variant, string> = {
  primary:   'bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20',
  secondary: 'bg-slate-100 hover:bg-slate-200 text-slate-700',
  danger:    'bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-500/20',
  ghost:     'hover:bg-slate-100 text-slate-600',
  outline:   'border border-slate-200 hover:border-slate-300 hover:bg-slate-50 text-slate-700',
}

const SIZE_STYLES: Record<Size, string> = {
  sm: 'h-8  px-3   text-xs  gap-1.5',
  md: 'h-10 px-4   text-sm  gap-2',
  lg: 'h-12 px-6   text-base gap-2.5',
}

export function Button({
  variant = 'primary',
  size    = 'md',
  loading = false,
  disabled,
  icon,
  children,
  className = '',
  ...rest
}: ButtonProps) {
  const isDisabled = disabled || loading

  return (
    <button
      disabled={isDisabled}
      className={[
        'inline-flex items-center justify-center font-medium rounded-lg',
        'transition-all duration-150 ease-in-out',
        'focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      ].join(' ')}
      aria-disabled={isDisabled}
      {...rest}
    >
      {loading ? (
        /* Spinner */
        <svg
          className="animate-spin"
          width={size === 'sm' ? 14 : 16}
          height={size === 'sm' ? 14 : 16}
          viewBox="0 0 24 24"
          fill="none"
          aria-label="Loading"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      ) : icon}
      <span>{children}</span>
    </button>
  )
}
