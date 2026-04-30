// ─────────────────────────────────────────────────────────
// API Response Contracts — Strict TypeScript interfaces
// matching the exact return shapes of every backend endpoint
// used in Sprint 1. Derived from Prisma queries + controller logic.
// ─────────────────────────────────────────────────────────

// ── Finance: GET /finance/reports/summary ──────────────────

export interface MonthlyTrendItem {
  month: string
  collected: number
  count: number
}

export interface MonthlyExpenseTrendItem {
  month: string
  spent: number
  count: number
}

export interface ExpenseByCategoryItem {
  category: string
  amount: number
}

export interface FinancialSummary {
  year: number
  income: {
    collected: number
    pending: number
    paidCount: number
    pendingCount: number
  }
  expenses: {
    approved: number
    total: number
    count: number
    byCategory: ExpenseByCategoryItem[]
  }
  profitLoss: number
  collectionRate: number
  monthlyTrend: MonthlyTrendItem[]
  monthlyExpenseTrend: MonthlyExpenseTrendItem[]
}

// ── Users: GET /users/count ─────────────────────────────────

export interface UserCounts {
  total: number
  active: number
  pending: number
}

// ── Users: GET /users/pending ───────────────────────────────

export interface PendingUser {
  id: string
  name: string
  email: string
  phone: string
  role: string
  isActive: boolean
  isVerified: boolean
  createdAt: string
  unit?: {
    flatNumber: string
    building?: {
      name: string
    }
  }
}

// ── Complaints: GET /complaints ──────────────────────────────

export interface ComplaintRecord {
  id: string
  ticketId: string
  title: string
  description: string
  category: string
  priority: string
  status: string
  slaDeadline: string | null
  createdAt: string
  updatedAt: string
  raisedBy?: {
    id: string
    name: string
  }
  assignedTo?: {
    id: string
    name: string
  }
}

// ── Access Control: GET /access-control/rfid ────────────────

export interface RfidCard {
  id: string
  uid: string
  type: string
  status: string
  issuedAt: string
  tenantId: string
  user?: {
    id: string
    name: string
    unit?: {
      flatNumber: string
      building?: {
        name: string
      }
    }
  }
}

// ── Communications: POST /communications/broadcasts ─────────

export interface CreateBroadcastPayload {
  title: string
  body: string
  channel?: string
}

export interface BroadcastRecord {
  id: string
  title: string
  message: string
  channel: string
  sentAt: string
  sentBy: string
  tenantId: string
}

// ── Expense: GET /finance/expenses ──────────────────────────

export interface ExpenseRecord {
  id: string
  title: string
  category: string
  amount: number
  vendor: string | null
  status: string
  createdAt: string
  tenantId: string
}

// ─────────────────────────────────────────────────────────
// Sprint 2 Contracts
// ─────────────────────────────────────────────────────────

// ── Parking: GET /property/parking ──────────────────────────

export interface ParkingSlotRecord {
  id: string
  slotNumber: string
  zone: string
  vehicleType: 'CAR' | 'BIKE' | 'EV'
  status: 'ASSIGNED' | 'AVAILABLE' | 'GUEST'
  vehicle: string | null
  unitId: string | null
  tenantId: string
  unit?: {
    flatNumber: string
    building?: { name: string }
    residents?: { name: string }[]
  }
}

export interface CreateParkingSlotPayload {
  slotNumber: string
  zone: string
  vehicleType?: 'CAR' | 'BIKE' | 'EV'
  unitId?: string
  vehicle?: string
}

// ── Tasks: GET /staff/tasks ─────────────────────────────────

export interface TaskRecord {
  id: string
  title: string
  zone: string | null
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  status: 'PENDING' | 'IN_PROGRESS' | 'PHOTO_UPLOADED' | 'COMPLETED'
  photoUrl: string | null
  dueBy: string | null
  staffId: string | null
  tenantId: string
  createdAt: string
  updatedAt: string
  staff?: {
    id: string
    name: string
    role: string
  }
}

export interface CreateTaskPayload {
  title: string
  zone?: string
  priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
  staffId?: string
  dueBy?: string
}

// ── Staff: GET /staff ───────────────────────────────────────

export interface StaffMemberRecord {
  id: string
  name: string
  role: string
  department: string
  phone: string
  shift: 'DAY' | 'NIGHT' | 'MORNING' | 'CUSTOM'
  shiftTime: string
  rating: number
  isActive: boolean
  tenantId: string
  joinedAt: string
}

// ── Roster: GET /staff/roster ───────────────────────────────

export interface RosterEntry {
  id: string
  name: string
  role: string
  department: string
  shift: string
  shiftTime: string
  phone: string
  status: 'PRESENT' | 'ABSENT' | 'LATE' | 'UPCOMING'
  zone: string | null
}

export interface AttendanceSummary {
  totalStaff: number
  onDuty: number
  absent: number
  late: number
  notLoggedYet: number
}

// ── Security: POST /security/sos ────────────────────────────

export interface SOSResponse {
  message: string
  ticketId: string
  respondersNotified: boolean
}
