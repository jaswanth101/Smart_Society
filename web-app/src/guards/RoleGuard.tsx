import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/config/routes.config'
import { UserRole } from '@/types'

// ─────────────────────────────────────────────────────────
// RoleGuard — Checks the user's role against an allowlist.
// If the user's role is not allowed, redirects to /403.
//
// Usage A (layout route):  <RoleGuard allowedRoles={[...]} />
// Usage B (wrapper):       <RoleGuard allowedRoles={[...]}><Component /></RoleGuard>
// ─────────────────────────────────────────────────────────

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children?: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)

  // Super Admins should have omni-access to all routes to manage the tenants
  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN
  const isAllowed = user && (allowedRoles.includes(user.role) || isSuperAdmin)

  if (!isAllowed) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  // If used as a layout route (no children), render Outlet for nested routes.
  // If wrapping children directly, render them.
  return children ? <>{children}</> : <Outlet />
}
