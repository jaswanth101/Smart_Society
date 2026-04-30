import { useState, useRef, useCallback } from 'react'
import { useApiMutation } from '@/hooks/useApiMutation'
import type { SOSResponse } from '@/types/api-contracts'

// ─────────────────────────────────────────────────────────
// SOSButton — Floating emergency panic button
// Requires 2-second long-press to prevent accidental triggers.
// Calls POST /security/sos → creates complaint + broadcast.
// ─────────────────────────────────────────────────────────

export function SOSButton() {
  const [pressing, setPressing] = useState(false)
  const [progress, setProgress] = useState(0)
  const [sent, setSent] = useState(false)
  const [showError, setShowError] = useState('')
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const startRef = useRef<number>(0)

  const HOLD_DURATION = 2000 // 2 seconds

  const { mutate, isLoading } = useApiMutation<SOSResponse, { location?: string }>(
    '/security/sos', 'POST', {
      onSuccess: () => {
        setSent(true)
        setShowError('')
        setTimeout(() => setSent(false), 6000)
      },
      onError: (err) => {
        setShowError(err || 'Failed to send SOS')
        setTimeout(() => setShowError(''), 5000)
      },
    }
  )

  const handlePressStart = useCallback(() => {
    if (isLoading || sent) return
    setPressing(true)
    startRef.current = Date.now()
    setProgress(0)

    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startRef.current
      const pct = Math.min((elapsed / HOLD_DURATION) * 100, 100)
      setProgress(pct)

      if (elapsed >= HOLD_DURATION) {
        // Trigger SOS
        if (timerRef.current) clearInterval(timerRef.current)
        timerRef.current = null
        setPressing(false)
        setProgress(0)
        mutate({ location: 'App' })
      }
    }, 30) // ~33fps updates for smooth animation
  }, [isLoading, sent, mutate])

  const handlePressEnd = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setPressing(false)
    setProgress(0)
  }, [])

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-2">
      {/* Feedback messages */}
      {sent && (
        <div className="px-4 py-3 rounded-[8px] text-xs font-medium shadow-lg animate-in slide-in-from-bottom-2 max-w-[240px]"
          style={{ background: '#10b981', color: 'white' }}>
          🚨 SOS dispatched! Guards and supervisors have been notified.
        </div>
      )}
      {showError && (
        <div className="px-4 py-3 rounded-[8px] text-xs font-medium shadow-lg max-w-[240px]"
          style={{ background: '#ef4444', color: 'white' }}>
          {showError}
        </div>
      )}

      {/* SOS Button */}
      <button
        onMouseDown={handlePressStart}
        onMouseUp={handlePressEnd}
        onMouseLeave={handlePressEnd}
        onTouchStart={handlePressStart}
        onTouchEnd={handlePressEnd}
        disabled={isLoading}
        className="relative w-16 h-16 rounded-full shadow-xl transition-transform active:scale-95 select-none"
        style={{
          background: pressing
            ? `conic-gradient(#dc2626 ${progress}%, #ef4444 ${progress}%)`
            : '#ef4444',
          boxShadow: pressing
            ? '0 0 0 6px rgba(239,68,68,0.3), 0 4px 12px rgba(0,0,0,0.15)'
            : '0 4px 12px rgba(0,0,0,0.15)',
        }}
        aria-label="SOS Emergency Button — hold for 2 seconds"
      >
        {isLoading ? (
          <svg className="animate-spin mx-auto" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeLinecap="round" strokeDasharray="60" strokeDashoffset="20" />
          </svg>
        ) : (
          <span className="text-white font-bold text-sm select-none">SOS</span>
        )}

        {/* Pulsing ring animation */}
        {!pressing && !isLoading && !sent && (
          <span className="absolute inset-0 rounded-full animate-ping opacity-20" style={{ background: '#ef4444' }} />
        )}
      </button>

      {/* Hold hint */}
      {!pressing && !sent && !isLoading && (
        <p className="text-[10px] font-medium text-center" style={{ color: 'var(--color-placeholder)' }}>Hold 2s to trigger</p>
      )}
      {pressing && (
        <p className="text-[10px] font-medium text-center" style={{ color: '#ef4444' }}>
          {progress < 100 ? `Hold... ${Math.round(progress)}%` : 'Sending!'}
        </p>
      )}
    </div>
  )
}
