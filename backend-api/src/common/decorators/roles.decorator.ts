import { SetMetadata } from '@nestjs/common'
import { Role } from '../constants/roles.constant'

// ─────────────────────────────────────────────────────────
// @Roles() decorator — attach to any controller route to
// specify which roles are allowed. Used by RolesGuard.
// Example: @Roles(Role.PRESIDENT, Role.TREASURER)
// ─────────────────────────────────────────────────────────
export const ROLES_KEY = 'roles'
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles)
