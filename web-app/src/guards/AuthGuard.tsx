import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/config/routes.config'

// ─────────────────────────────────────────────────────────
// AuthGuard — Redirects unauthenticated users to /login
// Wraps any protected route group in the router
// ─────────────────────────────────────────────────────────

export function AuthGuard() {
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  if (!isLoggedIn) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  return <Outlet />
}
