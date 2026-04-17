import axios, { type AxiosInstance, type AxiosResponse, AxiosError } from 'axios'
import { ENV } from '@/config/env.config'

// ─────────────────────────────────────────────────────────
// Axios API Client — preconfigured with base URL, timeout,
// auth token injection, and unified error handling.
// ─────────────────────────────────────────────────────────

const apiClient: AxiosInstance = axios.create({
  baseURL: ENV.API_BASE_URL,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})

// ── Request interceptor: inject JWT token ──────────────────
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('ss360_access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  // Inject tenant context header for every request
  const tenantId = localStorage.getItem('ss360_tenant_id')
  if (tenantId) {
    config.headers['X-Tenant-ID'] = tenantId
  }
  return config
})

// ── Response interceptor: handle 401 (token expiry) ───────
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Clear stale tokens and redirect to login
      localStorage.removeItem('ss360_access_token')
      localStorage.removeItem('ss360_tenant_id')
      window.location.href = '/login'
    }
    // Never expose internal server errors to the UI — only show message
    const message =
      (error.response?.data as { message?: string })?.message ??
      'An unexpected error occurred. Please try again.'
    return Promise.reject(new Error(message))
  }
)

export default apiClient
