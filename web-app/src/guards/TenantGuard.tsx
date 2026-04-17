import { Navigate, Outlet, useParams } from 'react-router-dom'
import { useAuthStore } from '@/store/auth.store'
import { ROUTES } from '@/config/routes.config'

// ─────────────────────────────────────────────────────────
// TenantGuard — Validates that the authenticated user belongs
// to the tenant in the URL. Prevents cross-tenant access.
// ─────────────────────────────────────────────────────────

export function TenantGuard() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const storeTenantId = useAuthStore((s) => s.tenantId)
  const user          = useAuthStore((s) => s.user)

  // SuperAdmin can access any tenant
  if (user?.role === 'SUPER_ADMIN') return <Outlet />

  if (!tenantId || tenantId !== storeTenantId) {
    return <Navigate to={ROUTES.UNAUTHORIZED} replace />
  }

  return <Outlet />
}
