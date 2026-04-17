import { type ButtonHTMLAttributes, type ReactNode } from 'react'

// ─────────────────────────────────────────────────────────
// Button — Tesla-inspired design system atom.
// 4px radius, Electric Blue primary, 0.33s transitions.
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
  primary:   'bg-[#3E6AE1] hover:bg-[#3459c7] text-white',
  secondary: 'bg-white hover:bg-[#F4F4F4] text-[#393C41] border border-[#D0D1D2]',
  danger:    'bg-[#ef4444] hover:bg-[#dc2626] text-white',
  ghost:     'hover:bg-[#F4F4F4] text-[#5C5E62]',
  outline:   'border border-[#D0D1D2] hover:border-[#393C41] hover:bg-[#F4F4F4] text-[#393C41]',
}

const SIZE_STYLES: Record<Size, string> = {
  sm: 'h-8  px-3   text-xs  gap-1.5',
  md: 'h-10 px-4   text-sm  gap-2',
  lg: 'h-12 px-6   text-sm gap-2.5',
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
        'inline-flex items-center justify-center font-medium',
        'rounded-[4px] transition-all duration-[330ms]',
        'focus:outline-none focus:ring-2 focus:ring-[#3E6AE1]/30 focus:ring-offset-1',
        'disabled:opacity-50 disabled:cursor-not-allowed',
        VARIANT_STYLES[variant],
        SIZE_STYLES[size],
        className,
      ].join(' ')}
      aria-disabled={isDisabled}
      {...rest}
    >
      {loading ? (
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
