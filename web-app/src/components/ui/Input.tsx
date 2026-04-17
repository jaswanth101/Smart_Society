import { type InputHTMLAttributes, type ReactNode, forwardRef } from 'react'

// ─────────────────────────────────────────────────────────
// Input — Design system form control.
// Supports: label, helper text, error state, left/right icons.
// Uses forwardRef for React Hook Form compatibility.
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
            className="block text-sm font-medium text-slate-700 mb-1.5"
          >
            {label}
            {rest.required && <span className="text-red-500 ml-1">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full py-2.5 text-sm rounded-lg border transition-all duration-150',
              'placeholder:text-slate-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400',
              'disabled:bg-slate-50 disabled:text-slate-400 disabled:cursor-not-allowed',
              error
                ? 'border-red-300 bg-red-50/30 focus:border-red-400 focus:ring-red-500/20'
                : 'border-slate-200 bg-white',
              leftIcon  ? 'pl-10' : 'pl-3',
              rightIcon ? 'pr-10' : 'pr-3',
              className,
            ].join(' ')}
            aria-invalid={!!error}
            aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-helper` : undefined}
            {...rest}
          />
          {rightIcon && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">
              {rightIcon}
            </span>
          )}
        </div>
        {error ? (
          <p id={`${inputId}-error`} className="mt-1.5 text-xs text-red-500" role="alert">
            {error}
          </p>
        ) : helperText ? (
          <p id={`${inputId}-helper`} className="mt-1.5 text-xs text-slate-500">
            {helperText}
          </p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
