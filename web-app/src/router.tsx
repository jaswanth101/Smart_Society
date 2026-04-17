import { createBrowserRouter, Navigate } from 'react-router-dom'
import { lazy, Suspense } from 'react'

// Route guards
import { AuthGuard }   from '@/guards/AuthGuard'
import { RoleGuard }   from '@/guards/RoleGuard'
import { TenantGuard } from '@/guards/TenantGuard'
import { UserRole }    from '@/types'

// ── Lazy loaded pages ──────────────────────────────────────
// Auth / Public
const LoginPage         = lazy(() => import('@/features/auth/pages/LoginPage'))
const UnauthorizedPage  = lazy(() => import('@/features/auth/pages/UnauthorizedPage'))
const NotFoundPage      = lazy(() => import('@/features/auth/pages/NotFoundPage'))

// Super Admin — Platform
const PlatformDashboard = lazy(() => import('@/features/platform/pages/PlatformDashboard'))

// Society Admin — Tenant-scoped
const DashboardPage         = lazy(() => import('@/features/dashboard/pages/DashboardPage'))
const MembersListPage       = lazy(() => import('@/features/members/pages/MembersListPage'))
const FinanceOverviewPage   = lazy(() => import('@/features/finance/pages/FinanceOverviewPage'))
const RfidManagementPage    = lazy(() => import('@/features/access-control/pages/RfidManagementPage'))
const ComplaintsPage        = lazy(() => import('@/features/communications/pages/ComplaintsPage'))

// Resident — Tenant-scoped
const ResidentHomePage      = lazy(() => import('@/features/resident/pages/ResidentHomePage'))

// Placeholder for unbuilt pages
const PlaceholderPage       = lazy(() => import('@/components/ui/PlaceholderPage'))

// President — Macromanagement
const HardwareGatesPage     = lazy(() => import('@/features/iot/pages/HardwareGatesPage'))
const BroadcastPage         = lazy(() => import('@/features/communications/pages/BroadcastPage'))
const ElectionsPage         = lazy(() => import('@/features/elections/pages/ElectionsPage'))

// ── Suspense fallback ──────────────────────────────────────
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="flex flex-col items-center gap-3">
        <svg className="animate-spin w-8 h-8 text-blue-600" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
        </svg>
        <p className="text-sm text-slate-500">Loading…</p>
      </div>
    </div>
  )
}

function S({ children }: { children: React.ReactNode }) {
  return <Suspense fallback={<PageLoader />}>{children}</Suspense>
}

// ── Router definition ──────────────────────────────────────
// Mirrors Pages_and_Routing.md exactly.
export const router = createBrowserRouter([
  // ── Public routes ────────────────────────────────────────
  { path: '/',       element: <Navigate to="/login" replace /> },
  { path: '/login',  element: <S><LoginPage /></S> },
  { path: '/403-unauthorized', element: <S><UnauthorizedPage /></S> },
  { path: '/404-not-found',    element: <S><NotFoundPage /></S> },

  // ── Super Admin — Platform routes ────────────────────────
  {
    element: <AuthGuard />,
    children: [
      {
        element: <RoleGuard allowedRoles={[UserRole.SUPER_ADMIN]} />,
        children: [
          { path: '/platform/dashboard',  element: <S><PlatformDashboard /></S> },
          { path: '/platform/societies',  element: <S><PlatformDashboard /></S> },
          { path: '/platform/billing',    element: <S><PlatformDashboard /></S> },
          { path: '/platform/hardware',   element: <S><PlatformDashboard /></S> },
        ],
      },

      // ── Society Admin — tenant-scoped routes ─────────────
      {
        path: '/:tenantId/admin',
        element: <TenantGuard />,
        children: [
          // Dashboard — all admin roles
          {
            path: 'dashboard',
            element: (
              <RoleGuard allowedRoles={[
                UserRole.PRESIDENT, UserRole.SECRETARY,
                UserRole.TREASURER, UserRole.SUPERVISOR,
              ]}>
                <S><DashboardPage /></S>
              </RoleGuard>
            ),
          },

          // Members — President, Secretary
          {
            path: 'members',
            element: (
              <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}>
                <S><MembersListPage /></S>
              </RoleGuard>
            ),
          },

          // Finance — President, Treasurer
          {
            path: 'finance/overview',
            element: (
              <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.TREASURER]}>
                <S><FinanceOverviewPage /></S>
              </RoleGuard>
            ),
          },

          // RFID — President, Secretary, Supervisor
          {
            path: 'access/rfid',
            element: (
              <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR]}>
                <S><RfidManagementPage /></S>
              </RoleGuard>
            ),
          },

          // Helpdesk — President, Secretary, Supervisor
          {
            path: 'helpdesk/complaints',
            element: (
              <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR]}>
                <S><ComplaintsPage /></S>
              </RoleGuard>
            ),
          },

          // Property — President, Secretary
          {
            path: 'property/*',
            element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><PlaceholderPage /></S></RoleGuard>,
          },

          // Staff — President, Supervisor
          {
            path: 'staff/*',
            element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SUPERVISOR]}><S><PlaceholderPage /></S></RoleGuard>,
          },

          // Communications — President, Secretary
          {
            path: 'communications/notices',
            element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><PlaceholderPage /></S></RoleGuard>,
          },
          {
            path: 'communications/broadcast',
            element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><BroadcastPage /></S></RoleGuard>,
          },

          // Analytics — President, Treasurer
          {
            path: 'finance/reports',
            element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.TREASURER]}><S><PlaceholderPage /></S></RoleGuard>,
          },

          // Hardware & Gates — President, Supervisor
          {
            path: 'access/gates',
            element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SUPERVISOR]}><S><HardwareGatesPage /></S></RoleGuard>,
          },

          // Misc Admins
          {
            path: 'elections',
            element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><ElectionsPage /></S></RoleGuard>,
          },
          {
            path: 'settings',
            element: <RoleGuard allowedRoles={[UserRole.PRESIDENT, UserRole.SECRETARY]}><S><PlaceholderPage /></S></RoleGuard>,
          },

          // Default tenant redirect
          { index: true, element: <Navigate to="dashboard" replace /> },
        ],
      },

      // ── Resident — tenant-scoped routes ─────────────
      {
        path: '/:tenantId/resident',
        element: <TenantGuard />,
        children: [
          {
            path: 'home',
            element: (
              <RoleGuard allowedRoles={[UserRole.FLAT_OWNER, UserRole.TENANT]}>
                <S><ResidentHomePage /></S>
              </RoleGuard>
            ),
          },
          // Default redirect
          { index: true, element: <Navigate to="home" replace /> },
        ]
      },
    ],
  },

  // ── Catch-all 404 ────────────────────────────────────────
  { path: '*', element: <S><NotFoundPage /></S> },
])
