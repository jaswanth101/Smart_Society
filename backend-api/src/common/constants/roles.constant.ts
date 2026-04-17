// ─────────────────────────────────────────────────────────
// RBAC Role Enum — mirrors Architecture.md §5 exactly.
// All modules must use this enum, never raw strings.
// ─────────────────────────────────────────────────────────
export enum Role {
  SUPER_ADMIN    = 'SUPER_ADMIN',
  PRESIDENT      = 'PRESIDENT',
  SECRETARY      = 'SECRETARY',
  TREASURER      = 'TREASURER',
  SUPERVISOR     = 'SUPERVISOR',
  SECURITY_GUARD = 'SECURITY_GUARD',
  STAFF          = 'STAFF',
  FLAT_OWNER     = 'FLAT_OWNER',
  TENANT         = 'TENANT',
}

// Permission groups — convenience sets for route guards
export const ADMIN_ROLES    = [Role.PRESIDENT, Role.SECRETARY, Role.TREASURER, Role.SUPERVISOR]
export const COMMITTEE_ROLES = [Role.PRESIDENT, Role.SECRETARY, Role.TREASURER]
export const FINANCE_ROLES   = [Role.PRESIDENT, Role.TREASURER]
export const SECURITY_ROLES  = [Role.PRESIDENT, Role.SECRETARY, Role.SUPERVISOR, Role.SECURITY_GUARD]
export const RESIDENT_ROLES  = [Role.FLAT_OWNER, Role.TENANT]
