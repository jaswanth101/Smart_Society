import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common'

// ─────────────────────────────────────────────────────────
// TenantGuard — validates that the requesting user's tenantId
// matches the :tenantId in the route parameter.
// Prevents cross-tenant data access — critical security rule.
// SuperAdmin bypasses this check.
// ─────────────────────────────────────────────────────────

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request  = context.switchToHttp().getRequest()
    const user     = request.user
    const tenantId = request.params?.tenantId

    // SuperAdmin can access all tenants
    if (user?.role === 'SUPER_ADMIN') return true

    // All other roles must match their own tenantId
    if (!tenantId || user?.tenantId !== tenantId) {
      throw new ForbiddenException(
        'Cross-tenant access denied. You are not authorized for this society.'
      )
    }

    return true
  }
}
