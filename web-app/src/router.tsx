import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

import { AuthGuard }   from '@/guards/AuthGuard'
import { RoleGuard }   from '@/guards/RoleGuard'
import { TenantGuard } from '@/guards/TenantGuard'
import { UserRole }    from '@/types'

// ── Auth / Public ──────────────────────────────────────────
const LoginPage            = lazy(() => import('@/features/auth/pages/LoginPage'))
const ForgotPasswordPage   = lazy(() => import('@/features/auth/pages/ForgotPasswordPage'))
const ResetPasswordPage    = lazy(() => import('@/features/auth/pages/ResetPasswordPage'))
const UnauthorizedPage     = lazy(() => import('@/features/auth/pages/UnauthorizedPage'))
const NotFoundPage         = lazy(() => import('@/features/auth/pages/NotFoundPage'))

// ── Super Admin ────────────────────────────────────────────
const PlatformDashboard    = lazy(() => import('@/features/platform/pages/PlatformDashboard'))
const PlatformSocietiesPage= lazy(() => import('@/features/platform/pages/PlatformSocietiesPage'))
const PlatformBillingPage  = lazy(() => import('@/features/platform/pages/PlatformBillingPage'))
const PlatformHardwarePage = lazy(() => import('@/features/platform/pages/PlatformHardwarePage'))

// ── Society Admin ──────────────────────────────────────────
const DashboardPage        = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const MembersListPage      = lazy(() => import('@/features/members/pages/MembersListPage'))
const MembersApprovalsPage = lazy(() => import('@/features/members/pages/MembersApprovalsPage'))
const PropertyUnitsPage    = lazy(() => import('@/features/property/pages/PropertyUnitsPage'))
const ParkingManagementPage= lazy(() => import('@/features/property/pages/ParkingManagementPage'))
const FinanceOverviewPage  = lazy(() => import('@/features/finance/pages/FinanceOverviewPage'))
const FeeStructurePage     = lazy(() => import('@/features/finance/pages/FeeStructurePage'))
const DefaulterListPage    = lazy(() => import('@/features/finance/pages/DefaulterListPage'))
const ExpenseTrackingPage  = lazy(() => import('@/features/finance/pages/ExpenseTrackingPage'))
const FinanceReportsPage   = lazy(() => import('@/features/finance/pages/FinanceReportsPage'))
const RfidManagementPage   = lazy(() => import('@/features/access-control/pages/RfidManagementPage'))
const AmenityConfigPage    = lazy(() => import('@/features/access-control/pages/AmenityConfigPage'))
const HardwareGatesPage    = lazy(() => import('@/features/iot/pages/HardwareGatesPage'))
const StaffDirectoryPage   = lazy(() => import('@/features/staff/pages/StaffDirectoryPage'))
const DutyRosterPage       = lazy(() => import('@/features/staff/pages/DutyRosterPage'))
const TaskAssignmentPage   = lazy(() => import('@/features/staff/pages/TaskAssignmentPage'))
const VendorDirectoryPage  = lazy(() => import('@/features/staff/pages/VendorDirectoryPage'))
const NoticesBoardPage     = lazy(() => import('@/features/communications/pages/NoticesBoardPage'))
const BroadcastPage        = lazy(() => import('@/features/communications/pages/BroadcastPage'))
const ComplaintsPage       = lazy(() => import('@/features/communications/pages/ComplaintsPage'))
const ElectionsPage        = lazy(() => import('@/features/elections/pages/ElectionsPage'))
const SettingsPage         = lazy(() => import('@/features/settings/pages/SettingsPage'))

// ── Resident ───────────────────────────────────────────────
const ResidentHomePage       = lazy(() => import('@/features/resident/pages/ResidentHomePage'))
const ResidentFinancePage    = lazy(() => import('@/features/resident/pages/ResidentFinancePage'))
const ResidentComplaintsPage = lazy(() => import('@/features/resident/pages/ResidentComplaintsPage'))
const ResidentVisitorsPage   = lazy(() => import('@/features/resident/pages/ResidentVisitorsPage'))
const ResidentFamilyPage     = lazy(() => import('@/features/resident/pages/ResidentFamilyPage'))
const ResidentParkingPage    = lazy(() => import('@/features/resident/pages/ResidentParkingPage'))
const ResidentNoticesPage    = lazy(() => import('@/features/resident/pages/ResidentNoticesPage'))
const ResidentAmenitiesPage  = lazy(() => import('@/features/resident/pages/ResidentAmenitiesPage'))
const ResidentCommunityPage  = lazy(() => import('@/features/resident/pages/ResidentCommunityPage'))

// ── Suspense wrapper ───────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--color-light-ash)' }}>
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-8 h-8" style={{ color: 'var(--color-electric-blue)' }} fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>Loading…</p>
      </div>
    </div>
  )
}

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

// ── Router ─────────────────────────────────────────────────
export const router = createBrowserRouter([
  // Public
  { path: '/',                element: <Navigate to="/login" replace /> },
  { path: '/login',           element: <S><LoginPage /></S> },
  { path: '/forgot-password', element: <S><ForgotPasswordPage /></S> },
  { path: '/reset-password',  element: <S><ResetPasswordPage /></S> },
  { path: '/403-unauthorized',element: <S><UnauthorizedPage /></S> },
  { path: '/404-not-found',   element: <S><NotFoundPage /></S> },

  // Authenticated routes
  {
    element: <AuthGuard />,
    children: [
      // ── Super Admin ──────────────────────────────────────
      {
        element: <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]} />,
        children: [
          { path: '/platform/dashboard',         element: <S><PlatformDashboard /></S> },
          { path: '/platform/societies',         element: <S><PlatformSocietiesPage /></S> },
          { path: '/platform/societies/new',     element: <S><PlatformSocietiesPage /></S> },
          { path: '/platform/societies/:id',     element: <S><PlatformSocietiesPage /></S> },
          { path: '/platform/billing',           element: <S><PlatformBillingPage /></S> },
          { path: '/platform/hardware',          element: <S><PlatformHardwarePage /></S> },
        ],
      },

      // ── Society Admin ────────────────────────────────────
      {
        path: '/:tenantId/admin',
        element: <TenantGuard />,
        children: [
          // Dashboard
          { path: 'dashboard', element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.TREASURER, UserRole.SUPERVISOR]}><S><DashboardPage /></S></RoleGuard> },

          // Members
          { path: 'members',           element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><MembersListPage /></S></RoleGuard> },
          { path: 'members/approvals', element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><MembersApprovalsPage /></S></RoleGuard> },

          // Property
          { path: 'property/units',   element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><PropertyUnitsPage /></S></RoleGuard> },
          { path: 'property/parking', element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><ParkingManagementPage /></S></RoleGuard> },

          // Finance
          { path: 'finance/overview',   element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.TREASURER]}><S><FinanceOverviewPage /></S></RoleGuard> },
          { path: 'finance/fees',       element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.TREASURER]}><S><FeeStructurePage /></S></RoleGuard> },
          { path: 'finance/defaulters', element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.TREASURER]}><S><DefaulterListPage /></S></RoleGuard> },
          { path: 'finance/expenses',   element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.TREASURER]}><S><ExpenseTrackingPage /></S></RoleGuard> },
          { path: 'finance/reports',    element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.TREASURER]}><S><FinanceReportsPage /></S></RoleGuard> },

          // Access Control
          { path: 'access/rfid',      element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR]}><S><RfidManagementPage /></S></RoleGuard> },
          { path: 'access/amenities', element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR]}><S><AmenityConfigPage /></S></RoleGuard> },
          { path: 'access/gates',     element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SUPERVISOR]}><S><HardwareGatesPage /></S></RoleGuard> },

          // Staff & Vendors
          { path: 'staff/directory', element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SUPERVISOR]}><S><StaffDirectoryPage /></S></RoleGuard> },
          { path: 'staff/roster',    element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SUPERVISOR]}><S><DutyRosterPage /></S></RoleGuard> },
          { path: 'staff/tasks',     element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SUPERVISOR]}><S><TaskAssignmentPage /></S></RoleGuard> },
          { path: 'vendors',         element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SUPERVISOR]}><S><VendorDirectoryPage /></S></RoleGuard> },

          // Communications
          { path: 'communications/notices',   element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><NoticesBoardPage /></S></RoleGuard> },
          { path: 'communications/broadcast', element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><BroadcastPage /></S></RoleGuard> },

          // Helpdesk
          { path: 'helpdesk/complaints', element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR]}><S><ComplaintsPage /></S></RoleGuard> },

          // Elections & Settings
          { path: 'elections', element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><ElectionsPage /></S></RoleGuard> },
          { path: 'settings',  element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><SettingsPage /></S></RoleGuard> },

          // Default
          { index: true, element: <Navigate to="dashboard" replace /> },
        ],
      },

      // ── Resident ─────────────────────────────────────────
      {
        path: '/:tenantId/resident',
        element: <TenantGuard />,
        children: [
          { path: 'home',       element: <RoleGuard allowedRoles={[UserRole.FLAT_OWNER, UserRole.TENANT]}><S><ResidentHomePage /></S></RoleGuard> },
          { path: 'finance',    element: <RoleGuard allowedRoles={[UserRole.FLAT_OWNER]}><S><ResidentFinancePage /></S></RoleGuard> },
          { path: 'complaints', element: <RoleGuard allowedRoles={[UserRole.FLAT_OWNER, UserRole.TENANT]}><S><ResidentComplaintsPage /></S></RoleGuard> },
          { path: 'visitors',   element: <RoleGuard allowedRoles={[UserRole.FLAT_OWNER, UserRole.TENANT]}><S><ResidentVisitorsPage /></S></RoleGuard> },
          { path: 'family',     element: <RoleGuard allowedRoles={[UserRole.FLAT_OWNER, UserRole.TENANT]}><S><ResidentFamilyPage /></S></RoleGuard> },
          { path: 'parking',    element: <RoleGuard allowedRoles={[UserRole.FLAT_OWNER, UserRole.TENANT]}><S><ResidentParkingPage /></S></RoleGuard> },
          { path: 'notices',    element: <RoleGuard allowedRoles={[UserRole.FLAT_OWNER, UserRole.TENANT]}><S><ResidentNoticesPage /></S></RoleGuard> },
          { path: 'amenities',  element: <RoleGuard allowedRoles={[UserRole.FLAT_OWNER, UserRole.TENANT]}><S><ResidentAmenitiesPage /></S></RoleGuard> },
          { path: 'community',  element: <RoleGuard allowedRoles={[UserRole.FLAT_OWNER, UserRole.TENANT]}><S><ResidentCommunityPage /></S></RoleGuard> },
          { index: true, element: <Navigate to="home" replace /> },
        ],
      },
    ],
  },

  // Catch-all
  { path: '*', element: <S><NotFoundPage /></S> },
])
