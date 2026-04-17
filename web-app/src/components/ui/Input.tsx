import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'

// ─────────────────────────────────────────────────────────
// Input — Tesla-inspired form control.
// 4px radius, Cloud border, 0.33s transitions.
// ─────────────────────────────────────────────────────────

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?:      string
  helperText?: string
  error?:      string
  leftIcon?:   ReactNode
  rightIcon?:  ReactNode
  fullWidth?:  boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, helperText, error, leftIcon, rightIcon, fullWidth = true, className = '', id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className={fullWidth ? 'w-full' : ''}>
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium mb-1.5"
            style={{ color: 'var(--color-heading)' }}
          >
            {label}
            {rest.required && <span className="ml-1" style={{ color: 'var(--color-danger)' }}>*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }}>
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full py-2.5 text-sm rounded-[4px] transition-all duration-[330ms]',
              'focus:outline-none focus:ring-2 focus:ring-[#3E6AE1]/20 focus:border-[#3E6AE1]',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              error
                ? 'border-[#ef4444] bg-white'
                : 'border-[#EEEEEE] bg-white',
              leftIcon  ? 'pl-10' : 'pl-3',
              rightIcon ? 'pr-10' : 'pr-3',
              className,
            ].join(' ')}
            style={{
              borderWidth: '1px',
              borderStyle: 'solid',
              color: 'var(--color-heading)',
            }}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...rest}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: 'var(--color-placeholder)' }}>
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs" style={{ color: 'var(--color-danger)' }} role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs" style={{ color: 'var(--color-tertiary)' }}>
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
