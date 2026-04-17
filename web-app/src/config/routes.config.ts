// ─────────────────────────────────────────────────────────
// Route path constants — single source of truth
// Never use raw strings for navigation; always import from here
// ─────────────────────────────────────────────────────────
export const ROUTES = {
  // Public / Auth
  LOGIN:            '/login',
  FORGOT_PASSWORD:  '/forgot-password',
  RESET_PASSWORD:   '/reset-password',

  // Super Admin — Platform level (no tenant prefix)
  PLATFORM_DASHBOARD:   '/platform/dashboard',
  PLATFORM_SOCIETIES:   '/platform/societies',
  PLATFORM_SOCIETY_NEW: '/platform/societies/new',
  PLATFORM_SOCIETY:     (id: string) => `/platform/societies/${id}`,
  PLATFORM_BILLING:     '/platform/billing',
  PLATFORM_HARDWARE:    '/platform/hardware',

  // Society Admin — tenant-prefixed
  DASHBOARD:            (t: string) => `/${t}/admin/dashboard`,
  MEMBERS:              (t: string) => `/${t}/admin/members`,
  MEMBER_APPROVALS:     (t: string) => `/${t}/admin/members/approvals`,
  PROPERTY_UNITS:       (t: string) => `/${t}/admin/property/units`,
  PROPERTY_PARKING:     (t: string) => `/${t}/admin/property/parking`,
  FINANCE_OVERVIEW:     (t: string) => `/${t}/admin/finance/overview`,
  FINANCE_FEES:         (t: string) => `/${t}/admin/finance/fees`,
  FINANCE_DEFAULTERS:   (t: string) => `/${t}/admin/finance/defaulters`,
  FINANCE_EXPENSES:     (t: string) => `/${t}/admin/finance/expenses`,
  FINANCE_REPORTS:      (t: string) => `/${t}/admin/finance/reports`,
  ACCESS_RFID:          (t: string) => `/${t}/admin/access/rfid`,
  ACCESS_AMENITIES:     (t: string) => `/${t}/admin/access/amenities`,
  ACCESS_GATES:         (t: string) => `/${t}/admin/access/gates`,
  STAFF_DIRECTORY:      (t: string) => `/${t}/admin/staff/directory`,
  STAFF_ROSTER:         (t: string) => `/${t}/admin/staff/roster`,
  STAFF_TASKS:          (t: string) => `/${t}/admin/staff/tasks`,
  VENDORS:              (t: string) => `/${t}/admin/vendors`,
  NOTICES:              (t: string) => `/${t}/admin/communications/notices`,
  BROADCAST:            (t: string) => `/${t}/admin/communications/broadcast`,
  COMPLAINTS:           (t: string) => `/${t}/admin/helpdesk/complaints`,
  ELECTIONS:            (t: string) => `/${t}/admin/elections`,
  SETTINGS:             (t: string) => `/${t}/admin/settings`,

  // Error pages
  UNAUTHORIZED: '/403-unauthorized',
  NOT_FOUND:    '/404-not-found',
} as const
