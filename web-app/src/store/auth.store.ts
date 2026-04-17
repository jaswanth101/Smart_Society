import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { AuthUser } from '@/types'

// ─────────────────────────────────────────────────────────
// Auth Store — persisted to localStorage with Zustand
// Manages JWT token, user profile, and tenant context
// ─────────────────────────────────────────────────────────

interface AuthState {
  token:       string | null
  user:        AuthUser | null
  tenantId:    string | null
  isLoggedIn:  boolean

  // Actions
  setAuth:     (token: string, user: AuthUser) => void
  setTenant:   (tenantId: string) => void
  logout:      () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token:      null,
      user:       null,
      tenantId:   null,
      isLoggedIn: false,

      setAuth: (token, user) => {
        localStorage.setItem('ss360_access_token', token)
        localStorage.setItem('ss360_tenant_id', user.tenantId ?? '')
        set({ token, user, tenantId: user.tenantId, isLoggedIn: true })
      },

      setTenant: (tenantId) => {
        localStorage.setItem('ss360_tenant_id', tenantId)
        set({ tenantId })
      },

      logout: () => {
        localStorage.removeItem('ss360_access_token')
        localStorage.removeItem('ss360_tenant_id')
        set({ token: null, user: null, tenantId: null, isLoggedIn: false })
      },
    }),
    {
      name: 'ss360_auth',
      // Only persist non-sensitive fields
      partialize: (state) => ({
        token:     state.token,
        user:      state.user,
        tenantId:  state.tenantId,
        isLoggedIn: state.isLoggedIn,
      }),
    }
  )
)
