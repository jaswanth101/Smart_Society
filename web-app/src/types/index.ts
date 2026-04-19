// ─────────────────────────────────────────────────────────
// Global TypeScript types — API contracts and role definitions
// ─────────────────────────────────────────────────────────

// ── RBAC Roles (matches Architecture.md section 5) ────────
export enum UserRole {
  SUPER_ADMIN     = 'SUPER_ADMIN',
  PRESIDENT       = 'PRESIDENT',
  SECRETARY       = 'SECRETARY',
  TREASURER       = 'TREASURER',
  SUPERVISOR      = 'SUPERVISOR',
  SECURITY_GUARD  = 'SECURITY_GUARD',
  STAFF           = 'STAFF',
  FLAT_OWNER      = 'FLAT_OWNER',
  TENANT          = 'TENANT',
}

// ── Authenticated User ─────────────────────────────────────
export interface AuthUser {
  id: string
  name: string
  email: string
  phone: string
  role: UserRole
  tenantId: string | null   // null for SuperAdmin
  unitId?: string | null
  avatarUrl?: string
}

// ── API Standard Response Envelope ────────────────────────
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string
  timestamp: string
}

// ── Paginated Result ───────────────────────────────────────
export interface PaginatedResult<T> {
  items: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

// ── Tenant / Society ───────────────────────────────────────
export interface Tenant {
  id: string
  name: string
  schemaName: string
  address: string
  city: string
  totalUnits: number
  subscriptionTier: 'BASIC' | 'STANDARD' | 'PREMIUM' | 'ENTERPRISE'
  isActive: boolean
  createdAt: string
}

// ── Unit / Flat ────────────────────────────────────────────
export interface Unit {
  id: string
  flatNumber: string
  floorId: string
  buildingId: string
  zoneId: string
  type: '1BHK' | '2BHK' | '3BHK' | 'PENTHOUSE' | 'SHOP' | 'OFFICE'
  sqft: number
}

// ── Complaint / Ticket ─────────────────────────────────────
export type TicketStatus =
  | 'PENDING'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'ESCALATED'

export interface Complaint {
  id: string
  ticketId: string
  category: string
  description: string
  status: TicketStatus
  unitId: string
  raisedBy: string
  assignedTo?: string
  photos: string[]
  slaDeadline: string
  createdAt: string
  updatedAt: string
}

// ── Finance ────────────────────────────────────────────────
export type InvoiceStatus = 'PENDING' | 'PAID' | 'OVERDUE' | 'WAIVED'

export interface Invoice {
  id: string
  unitId: string
  amount: number
  dueDate: string
  status: InvoiceStatus
  month: string
  year: number
  paidAt?: string
  receiptUrl?: string
}
