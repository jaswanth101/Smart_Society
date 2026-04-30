import { useState, useEffect } from 'react'
import { NavLink, useParams, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, Building2, Wallet, ShieldCheck,
  UserCog, Bell, Vote, Settings, ChevronLeft, ChevronDown, LogOut,
  Cpu, MessageSquare, Package, BarChart3, Car, ClipboardList, Calendar,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// Sidebar — Enterprise-grade with expandable sub-menus.
// Parent items that have children auto-expand when a child
// route is active, and collapse when navigating elsewhere.
// ─────────────────────────────────────────────────────────

interface NavChild {
  label: string
  path:  (t: string) => string
}

interface NavItem {
  label:     string
  icon:      React.ElementType
  path:      (t: string) => string
  roles:     UserRole[]
  feature?:  'hasAmenities' | 'hasElections' | 'hasHelpdesk' | 'hasVisitorGate'
  children?: NavChild[]
}

// ── Platform-level nav (Super Admin) ─────────────────────
const PLATFORM_ITEMS: NavItem[] = [
  { label: 'Dashboard',  icon: LayoutDashboard, path: () => '/platform/dashboard',  roles: [UserRole.SUPER_ADMIN] },
  { label: 'Societies',  icon: Building2,       path: () => '/platform/societies',  roles: [UserRole.SUPER_ADMIN] },
  { label: 'Billing',    icon: Wallet,          path: () => '/platform/billing',    roles: [UserRole.SUPER_ADMIN] },
  { label: 'Hardware',   icon: Cpu,             path: () => '/platform/hardware',   roles: [UserRole.SUPER_ADMIN] },
]

// ── Society-level nav (Admin roles) ──────────────────────
const SOCIETY_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: LayoutDashboard, path: (t) => `/${t}/admin/dashboard`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.TREASURER, UserRole.SUPERVISOR] },

  { label: 'Members', icon: Users, path: (t) => `/${t}/admin/members`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY],
    children: [
      { label: 'Directory',  path: (t) => `/${t}/admin/members` },
      { label: 'Approvals',  path: (t) => `/${t}/admin/members/approvals` },
    ],
  },

  { label: 'Property', icon: Building2, path: (t) => `/${t}/admin/property/units`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY],
    children: [
      { label: 'Units',    path: (t) => `/${t}/admin/property/units` },
      { label: 'Parking',  path: (t) => `/${t}/admin/property/parking` },
    ],
  },

  { label: 'Finance', icon: Wallet, path: (t) => `/${t}/admin/finance/overview`,
    roles: [UserRole.PRESIDENT, UserRole.TREASURER],
    children: [
      { label: 'Overview',   path: (t) => `/${t}/admin/finance/overview` },
      { label: 'Fee rules',  path: (t) => `/${t}/admin/finance/fees` },
      { label: 'Expenses',   path: (t) => `/${t}/admin/finance/expenses` },
      { label: 'Defaulters', path: (t) => `/${t}/admin/finance/defaulters` },
      { label: 'Reports',    path: (t) => `/${t}/admin/finance/reports` },
    ],
  },

  { label: 'Access control', icon: ShieldCheck, path: (t) => `/${t}/admin/access/rfid`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR] },

  { label: 'Amenities', icon: ShieldCheck, path: (t) => `/${t}/admin/access/amenities`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR], feature: 'hasAmenities' },

  { label: 'Visitor gate', icon: Users, path: (t) => `/${t}/admin/access/visitors`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR, UserRole.SECURITY_GUARD], feature: 'hasVisitorGate' },

  { label: 'Staff & vendors', icon: UserCog, path: (t) => `/${t}/admin/staff/directory`,
    roles: [UserRole.PRESIDENT, UserRole.SUPERVISOR],
    children: [
      { label: 'Directory',   path: (t) => `/${t}/admin/staff/directory` },
      { label: 'Tasks',       path: (t) => `/${t}/admin/staff/tasks` },
      { label: 'Duty roster', path: (t) => `/${t}/admin/staff/roster` },
      { label: 'Vendors',     path: (t) => `/${t}/admin/vendors` },
    ],
  },

  { label: 'Communications', icon: MessageSquare, path: (t) => `/${t}/admin/communications/notices`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY],
    children: [
      { label: 'Notices',    path: (t) => `/${t}/admin/communications/notices` },
      { label: 'Broadcast',  path: (t) => `/${t}/admin/communications/broadcast` },
    ],
  },

  { label: 'Helpdesk', icon: Package, path: (t) => `/${t}/admin/helpdesk/complaints`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR], feature: 'hasHelpdesk' },

  { label: 'IoT & hardware', icon: Cpu, path: (t) => `/${t}/admin/access/gates`,
    roles: [UserRole.PRESIDENT, UserRole.SUPERVISOR], feature: 'hasVisitorGate' },

  { label: 'Elections', icon: Vote, path: (t) => `/${t}/admin/elections`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY], feature: 'hasElections' },

  { label: 'Settings', icon: Settings, path: (t) => `/${t}/admin/settings`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY] },
]

// ── Global Cache to prevent Sidebar flashing during React Router remounts ──
let globalFeaturesCache: Record<string, boolean> = {}

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (v: boolean) => void }) {
  const [collapsed, setCollapsed] = useState(false)
  const { tenantId = '' } = useParams<{ tenantId: string }>()
  const location = useLocation()
  const user   = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const [features, setFeatures] = useState<Record<string, boolean>>(globalFeaturesCache)
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set())

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN

  useEffect(() => {
    if (!isSuperAdmin && tenantId) {
      apiClient.get(`/tenants/${tenantId}`).then(res => {
         const fetchedFeatures = {
           hasAmenities: res.data.hasAmenities,
           hasElections: res.data.hasElections,
           hasHelpdesk: res.data.hasHelpdesk,
           hasVisitorGate: res.data.hasVisitorGate
         }
         globalFeaturesCache = fetchedFeatures
         setFeatures(fetchedFeatures)
      }).catch(err => console.error('Sidebar feature fetch failed', err))
    }
  }, [tenantId, user, isSuperAdmin])

  // Auto-expand sections that contain the active route
  useEffect(() => {
    const navPool = isSuperAdmin ? PLATFORM_ITEMS : SOCIETY_ITEMS
    const expanded = new Set<string>()
    navPool.forEach(item => {
      if (item.children) {
        const isChildActive = item.children.some(child =>
          location.pathname === child.path(tenantId) || location.pathname.startsWith(child.path(tenantId) + '/')
        )
        if (isChildActive) expanded.add(item.label)
      }
    })
    setExpandedSections(prev => {
      // Merge: keep manually expanded + auto-expand active
      const merged = new Set(prev)
      expanded.forEach(e => merged.add(e))
      return merged
    })
  }, [location.pathname, tenantId, isSuperAdmin])

  const navPool = isSuperAdmin ? PLATFORM_ITEMS : SOCIETY_ITEMS
  const visibleItems = navPool.filter(
    (item) => {
       if (!user?.role || !item.roles.includes(user.role)) return false;
       if (item.feature && features[item.feature] !== true) return false;
       return true;
    }
  )

  const toggleSection = (label: string) => {
    setExpandedSections(prev => {
      const next = new Set(prev)
      if (next.has(label)) next.delete(label)
      else next.add(label)
      return next
    })
  }

  // Check if any child of an item is the active route
  const isChildActive = (item: NavItem) =>
    item.children?.some(child =>
      location.pathname === child.path(tenantId) || location.pathname.startsWith(child.path(tenantId) + '/')
    ) ?? false

  return (
    <aside
      className={`fixed md:relative z-50 flex flex-col shrink-0 h-screen transition-all duration-[330ms] ease-in-out ${
        mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
      }`}
      style={{
        width: collapsed ? '4.5rem' : '16rem',
        background: 'var(--sidebar-bg)',
      }}
      aria-label="Sidebar navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div
          className="flex items-center justify-center rounded-[4px] shrink-0"
          style={{ width: 36, height: 36, background: 'var(--color-electric-blue)' }}
        >
          <Building2 size={18} color="white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-medium text-white text-sm leading-tight">SmartSociety</p>
            <p className="text-[11px] text-[#8E8E8E]">360</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto text-[#8E8E8E] hover:text-white transition-colors duration-[330ms] p-1 rounded-[4px]"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={16}
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.33s' }}
          />
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {visibleItems.map((item) => {
          const hasChildren = item.children && item.children.length > 0 && !collapsed
          const isExpanded = expandedSections.has(item.label)
          const childActive = isChildActive(item)

          if (hasChildren) {
            return (
              <div key={item.label}>
                {/* Parent — toggle expand/collapse */}
                <button
                  onClick={() => toggleSection(item.label)}
                  className={`nav-link w-full ${childActive ? 'active' : ''}`}
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon size={18} className="nav-icon shrink-0" />
                  <span className="truncate flex-1 text-left">{item.label}</span>
                  <ChevronDown
                    size={14}
                    className="shrink-0 transition-transform duration-[330ms]"
                    style={{ transform: isExpanded ? 'rotate(180deg)' : 'none', opacity: 0.5 }}
                  />
                </button>

                {/* Children — animated collapse */}
                <div
                  className="overflow-hidden transition-all duration-[330ms] ease-in-out"
                  style={{
                    maxHeight: isExpanded ? `${item.children!.length * 40}px` : '0px',
                    opacity: isExpanded ? 1 : 0,
                  }}
                >
                  {item.children!.map(child => (
                    <NavLink
                      key={child.label}
                      to={child.path(tenantId)}
                      end
                      className={({ isActive }) => `nav-link nav-child ${isActive ? 'active' : ''}`}
                      onClick={() => setMobileOpen(false)}
                    >
                      <span className="truncate">{child.label}</span>
                    </NavLink>
                  ))}
                </div>
              </div>
            )
          }

          // Simple item — no children
          return (
            <NavLink
              key={item.label}
              to={item.path(tenantId)}
              className={({ isActive }) =>
                `nav-link ${isActive ? 'active' : ''}`
              }
              title={collapsed ? item.label : undefined}
              onClick={() => setMobileOpen(false)}
            >
              <item.icon size={18} className="nav-icon shrink-0" />
              {!collapsed && (
                <span className="truncate">{item.label}</span>
              )}
            </NavLink>
          )
        })}
      </nav>

      {/* User */}
      {user && (
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-[4px] shrink-0 text-white font-medium text-sm"
              style={{ width: 34, height: 34, background: 'var(--color-electric-blue)' }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-[11px] text-[#8E8E8E] truncate">{user.role}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="text-[#8E8E8E] hover:text-[#ef4444] transition-colors duration-[330ms] p-1.5 rounded-[4px]"
              title="Logout"
              aria-label="Logout"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      )}
    </aside>
  )
}
