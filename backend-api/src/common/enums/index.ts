// ─────────────────────────────────────────────────────────
// Ticket / Complaint status enum
// ─────────────────────────────────────────────────────────
export enum TicketStatus {
  PENDING     = 'PENDING',
  ASSIGNED    = 'ASSIGNED',
  IN_PROGRESS = 'IN_PROGRESS',
  RESOLVED    = 'RESOLVED',
  CLOSED      = 'CLOSED',
  ESCALATED   = 'ESCALATED',
}

// ─────────────────────────────────────────────────────────
// Invoice / Payment status enum
// ─────────────────────────────────────────────────────────
export enum InvoiceStatus {
  PENDING = 'PENDING',
  PAID    = 'PAID',
  OVERDUE = 'OVERDUE',
  WAIVED  = 'WAIVED',
}

// ─────────────────────────────────────────────────────────
// RFID Card status
// ─────────────────────────────────────────────────────────
export enum RfidCardStatus {
  ACTIVE   = 'ACTIVE',
  REVOKED  = 'REVOKED',
  LOST     = 'LOST',
  BLOCKED  = 'BLOCKED',
}

// ─────────────────────────────────────────────────────────
// Unit / Flat types
// ─────────────────────────────────────────────────────────
export enum UnitType {
  BHK_1    = '1BHK',
  BHK_2    = '2BHK',
  BHK_3    = '3BHK',
  PENTHOUSE = 'PENTHOUSE',
  SHOP     = 'SHOP',
  OFFICE   = 'OFFICE',
}

// ─────────────────────────────────────────────────────────
// Subscription tiers
// ─────────────────────────────────────────────────────────
export enum SubscriptionTier {
  BASIC      = 'BASIC',
  STANDARD   = 'STANDARD',
  PREMIUM    = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
}
