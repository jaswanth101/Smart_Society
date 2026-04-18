import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import {
  LayoutDashboard, Users, Building2, Wallet, ShieldCheck,
  UserCog, Bell, Vote, Settings, ChevronLeft, LogOut,
  Cpu, MessageSquare, Package, MapPin, BarChart3,
} from 'lucide-react'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'

// ─────────────────────────────────────────────────────────
// Sidebar — Tesla-inspired Carbon Dark sidebar
// ─────────────────────────────────────────────────────────

interface NavItem {
  label:    string
  icon:     React.ElementType
  path:     (t: string) => string
  roles:    UserRole[]
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
  { label: 'Dashboard',      icon: LayoutDashboard, path: (t) => `/${t}/admin/dashboard`,            roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.TREASURER, UserRole.SUPERVISOR] },
  { label: 'Members',        icon: Users,           path: (t) => `/${t}/admin/members`,               roles: [UserRole.PRESIDENT, UserRole.SECRETARY] },
  { label: 'Property',       icon: Building2,       path: (t) => `/${t}/admin/property/units`,        roles: [UserRole.PRESIDENT, UserRole.SECRETARY] },
  { label: 'Finance',        icon: Wallet,          path: (t) => `/${t}/admin/finance/overview`,      roles: [UserRole.PRESIDENT, UserRole.TREASURER] },
  { label: 'Access control', icon: ShieldCheck,     path: (t) => `/${t}/admin/access/rfid`,           roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR] },
  { label: 'Staff & vendors', icon: UserCog,        path: (t) => `/${t}/admin/staff/directory`,       roles: [UserRole.PRESIDENT, UserRole.SUPERVISOR] },
  { label: 'Communications', icon: MessageSquare,   path: (t) => `/${t}/admin/communications/notices`, roles: [UserRole.PRESIDENT, UserRole.SECRETARY] },
  { label: 'Helpdesk',       icon: Package,         path: (t) => `/${t}/admin/helpdesk/complaints`,   roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR] },
  { label: 'IoT & hardware', icon: Cpu,             path: (t) => `/${t}/admin/access/gates`,          roles: [UserRole.PRESIDENT, UserRole.SUPERVISOR] },
  { label: 'Analytics',      icon: BarChart3,       path: (t) => `/${t}/admin/finance/reports`,       roles: [UserRole.PRESIDENT, UserRole.TREASURER] },
  { label: 'Elections',      icon: Vote,            path: (t) => `/${t}/admin/elections`,             roles: [UserRole.PRESIDENT, UserRole.SECRETARY] },
  { label: 'Notifications',  icon: Bell,            path: (t) => `/${t}/admin/communications/broadcast`, roles: [UserRole.PRESIDENT, UserRole.SECRETARY] },
  { label: 'Settings',       icon: Settings,        path: (t) => `/${t}/admin/settings`,              roles: [UserRole.PRESIDENT, UserRole.SECRETARY] },
]

export function Sidebar({ mobileOpen, setMobileOpen }: { mobileOpen: boolean, setMobileOpen: (v: boolean) => void }) {
  const [collapsed, setCollapsed] = useState(false)
  const { tenantId = '' } = useParams<{ tenantId: string }>()
  const user   = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const isSuperAdmin = user?.role === UserRole.SUPER_ADMIN
  const navPool = isSuperAdmin ? PLATFORM_ITEMS : SOCIETY_ITEMS
  const visibleItems = navPool.filter(
    (item) => user?.role && item.roles.includes(user.role)
  )

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
        {visibleItems.map((item) => (
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
        ))}
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
