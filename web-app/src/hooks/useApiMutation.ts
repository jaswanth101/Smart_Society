import { useState, useRef, useCallback } from 'react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// useApiMutation — Enterprise-grade mutation hook.
// Features:
//   • Type-safe generics for request body and response
//   • Supports POST, PATCH, PUT, DELETE methods
//   • onSuccess / onError callbacks for side effects
//   • reset() to clear state for reuse
//   • No automatic execution — call execute() explicitly
// ─────────────────────────────────────────────────────────

interface UseApiMutationOptions<TRes> {
  /** HTTP method. Default: 'POST' */
  method?: 'POST' | 'PATCH' | 'PUT' | 'DELETE'
  /** Called after a successful mutation */
  onSuccess?: (data: TRes) => void
  /** Called when the mutation fails */
  onError?: (error: Error) => void
}

interface UseApiMutationReturn<TReq, TRes> {
  execute: (body?: TReq) => Promise<TRes>
  data: TRes | null
  isLoading: boolean
  error: Error | null
  reset: () => void
}

export function useApiMutation<TReq = unknown, TRes = unknown>(
  endpoint: string,
  options: UseApiMutationOptions<TRes> = {}
): UseApiMutationReturn<TReq, TRes> {
  const { method = 'POST', onSuccess, onError } = options

  const [data, setData] = useState<TRes | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  // Keep callback refs fresh
  const onSuccessRef = useRef(onSuccess)
  const onErrorRef = useRef(onError)
  onSuccessRef.current = onSuccess
  onErrorRef.current = onError

  const execute = useCallback(
    async (body?: TReq): Promise<TRes> => {
      setIsLoading(true)
      setError(null)

      try {
        let response

        switch (method) {
          case 'DELETE':
            response = await apiClient.delete<TRes>(endpoint, { data: body })
            break
          case 'PATCH':
            response = await apiClient.patch<TRes>(endpoint, body)
            break
          case 'PUT':
            response = await apiClient.put<TRes>(endpoint, body)
            break
          case 'POST':
          default:
            response = await apiClient.post<TRes>(endpoint, body)
            break
        }

        setData(response.data)
        onSuccessRef.current?.(response.data)
        return response.data
      } catch (err: unknown) {
        const mutationError =
          err instanceof Error ? err : new Error(String(err))
        setError(mutationError)
        onErrorRef.current?.(mutationError)
        throw mutationError
      } finally {
        setIsLoading(false)
      }
    },
    [endpoint, method]
  )

  const reset = useCallback(() => {
    setData(null)
    setError(null)
    setIsLoading(false)
  }, [])

  return { execute, data, isLoading, error, reset }
}
