import { Navigate } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/config/routes.config'
import type { UserRole } from '@/types'

// ─────────────────────────────────────────────────────────
// RoleGuard — Checks the user's role against an allowlist.
// If the user's role is not allowed, redirects to /403.
// Usage: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><Component /></RoleGuard>
// ─────────────────────────────────────────────────────────

interface RoleGuardProps {
  allowedRoles: UserRole[]
  children: React.ReactNode
}

export function RoleGuard({ allowedRoles, children }: RoleGuardProps) {
  const user = useAuthStore((s) => s.user)

  if (!user || !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  return <>{children}</>
}
