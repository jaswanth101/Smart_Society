import { SetMetadata } from '@nestjs/common'

// ─────────────────────────────────────────────────────────
// @TenantId() — extracts and attaches tenant context to
// the request. Used by TenantGuard and all database queries.
// Every query MUST include tenant_id in the WHERE clause.
// ─────────────────────────────────────────────────────────
export const TENANT_KEY = 'tenantId'
export const CurrentTenant = () => SetMetadata(TENANT_KEY, true)
