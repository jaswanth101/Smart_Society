import { useState, useEffect, useRef, useCallback } from 'react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// useApiQuery — Enterprise-grade data-fetching hook.
// Features:
//   • Type-safe generics for API response shapes
//   • AbortController for cleanup on unmount / re-render
//   • Exponential backoff retry on network errors (not 4xx)
//   • Conditional fetching via `enabled` flag or null endpoint
//   • Refetch + isRefetching state for manual refresh
// ─────────────────────────────────────────────────────────

interface UseApiQueryOptions<T> {
  /** Query string params appended to the endpoint */
  params?: Record<string, string | number | undefined>
  /** If false, skips the request entirely. Default: true */
  enabled?: boolean
  /** Number of retry attempts on network failure. Default: 2 */
  retryCount?: number
  /** Base delay in ms for exponential backoff. Default: 1000 */
  retryDelay?: number
  /** Called after a successful fetch */
  onSuccess?: (data: T) => void
  /** Called when the fetch fails after all retries */
  onError?: (error: Error) => void
}

interface UseApiQueryReturn<T> {
  data: T | null
  isLoading: boolean
  isRefetching: boolean
  error: Error | null
  refetch: () => Promise<void>
}

export function useApiQuery<T>(
  endpoint: string | null,
  options: UseApiQueryOptions<T> = {}
): UseApiQueryReturn<T> {
  const {
    params,
    enabled = true,
    retryCount = 2,
    retryDelay = 1000,
    onSuccess,
    onError,
  } = options

  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isRefetching, setIsRefetching] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  // Use refs to avoid stale closures in the fetch function
  const abortControllerRef = useRef<AbortController | null>(null)
  const mountedRef = useRef<boolean>(true)
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  onSuccessRef.current = onSuccess
  onErrorRef.current = onError

  // Serialize params to a stable string for dependency tracking
  const paramsKey = params ? JSON.stringify(params) : ''

  const fetchData = useCallback(
    async (isRefetch = false) => {
      if (!endpoint || !enabled) {
        setIsLoading(false)
        return
      }

      // Cancel any in-flight request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      const controller = new AbortController()
      abortControllerRef.current = controller

      if (isRefetch) {
        setIsRefetching(true)
      } else {
        setIsLoading(true)
      }
      setError(null)

      // Build query string from params
      let url = endpoint
      if (params) {
        const searchParams = new URLSearchParams()
        for (const [key, value] of Object.entries(params)) {
          if (value !== undefined && value !== null) {
            searchParams.append(key, String(value))
          }
        }
        const qs = searchParams.toString()
        if (qs) url = `${endpoint}?${qs}`
      }

      let lastError: Error | null = null
      const maxAttempts = 1 + retryCount // 1 initial + N retries

      for (let attempt = 0; attempt < maxAttempts; attempt++) {
        // Don't retry if the component has unmounted or request was aborted
        if (controller.signal.aborted || !mountedRef.current) return

        try {
          const response = await apiClient.get<T>(url, {
            signal: controller.signal,
          })

          // Only update state if this request wasn't aborted
          if (!controller.signal.aborted && mountedRef.current) {
            setData(response.data)
            setError(null)
            onSuccessRef.current?.(response.data)
          }
          lastError = null
          break // Success — exit retry loop
        } catch (err: unknown) {
          // Ignore abort errors (they're expected on cleanup)
          if (err instanceof Error && err.name === 'CanceledError') return
          if (err instanceof Error && err.name === 'AbortError') return

          lastError = err instanceof Error ? err : new Error(String(err))

          // Only retry on network errors (5xx or connection failures), not 4xx client errors
          const isNetworkError =
            !lastError.message.includes('401') &&
            !lastError.message.includes('403') &&
            !lastError.message.includes('404') &&
            !lastError.message.includes('400') &&
            !lastError.message.includes('422')

          if (isNetworkError && attempt < maxAttempts - 1) {
            // Exponential backoff: 1s → 2s → 4s
            const delay = retryDelay * Math.pow(2, attempt)
            await new Promise((resolve) => setTimeout(resolve, delay))
          } else {
            break // Client error or last attempt — stop retrying
          }
        }
      }

      // After all attempts, update error state
      if (lastError && mountedRef.current && !controller.signal.aborted) {
        setError(lastError)
        onErrorRef.current?.(lastError)
      }

      if (mountedRef.current) {
        setIsLoading(false)
        setIsRefetching(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [endpoint, enabled, retryCount, retryDelay, paramsKey]
  )

  // Initial fetch + refetch on dependency changes
  useEffect(() => {
    mountedRef.current = true
    fetchData(false)

    return () => {
      mountedRef.current = false
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchData])

  const refetch = useCallback(async () => {
    await fetchData(true)
  }, [fetchData])

  return { data, isLoading, isRefetching, error, refetch }
}
