import { useState, useRef, useEffect } from 'react'
import { ChevronDown, Check } from 'lucide-react'

export interface SelectOption {
  label: string
  value: string
  disabled?: boolean
}

export interface SelectProps {
  value: string
  onChange: (val: string) => void
  options: SelectOption[]
  placeholder?: string
  className?: string
  disabled?: boolean
}

export function Select({ value, onChange, options, placeholder = 'Select...', className = '', disabled = false }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const selectedOption = options.find(o => String(o.value) === String(value))

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <button 
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className="w-full pl-3 pr-8 py-2 text-sm rounded-[4px] bg-white border outline-none text-left flex items-center justify-between transition-all"
        style={{ 
          borderColor: isOpen ? 'var(--color-electric-blue)' : 'var(--color-cloud)', 
          color: disabled ? 'var(--color-placeholder)' : (selectedOption ? 'var(--color-heading)' : 'var(--color-placeholder)'),
          boxShadow: isOpen ? '0 0 0 1px var(--color-electric-blue)' : 'none',
          cursor: disabled ? 'not-allowed' : 'pointer',
          opacity: disabled ? 0.6 : 1
        }}
      >
        <span className="truncate">{selectedOption ? selectedOption.label : placeholder}</span>
        <ChevronDown size={14} className={`absolute right-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} style={{ color: 'var(--color-tertiary)' }} />
      </button>

      {isOpen && !disabled && (
        <div 
          className="absolute z-50 w-full mt-1 bg-white border shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] rounded-[6px] max-h-60 overflow-y-auto animate-fade-in" 
          style={{ borderColor: 'var(--color-cloud)' }}
        >
          {options.map(opt => {
            const isSelected = String(value) === String(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                className="w-full text-left px-3 py-2.5 text-sm transition-colors flex items-center justify-between"
                style={{ 
                  color: isSelected ? 'var(--color-electric-blue)' : 'var(--color-heading)',
                  background: isSelected ? '#F0F4FF' : 'transparent',
                  fontWeight: isSelected ? 500 : 400
                }}
                onMouseEnter={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = '#F4F4F4'
                }}
                onMouseLeave={(e) => {
                  if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent'
                }}
                onClick={() => {
                  if (opt.disabled) return;
                  onChange(opt.value)
                  setIsOpen(false)
                }}
              >
                <span className="truncate">{opt.label}</span>
                {isSelected && <Check size={14} style={{ color: 'var(--color-electric-blue)' }} />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
