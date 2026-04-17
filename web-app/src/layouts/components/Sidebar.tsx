import { useState } from 'react'
import { NavLink, useParams } from 'react-router-dom'
import {
  LayoutDashboard, Users, Building2, Wallet, ShieldCheck,
  UserCog, Bell, Vote, Settings, ChevronLeft, LogOut,
  Cpu, MessageSquare, Package, MapPin, BarChart3,
} from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'
import { UserRole } from '@/types'

// ─────────────────────────────────────────────────────────
// Sidebar — Collapsible navigation rail.
// Nav items are filtered by the logged-in user's role.
// ─────────────────────────────────────────────────────────

interface NavItem {
  label: string
  icon: React.ElementType
  path: (t: string) => string
  roles: UserRole[]
}

const NAV_ITEMS: NavItem[] = [
  {
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: (t) => `/${t}/admin/dashboard`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.TREASURER, UserRole.SUPERVISOR],
  },
  {
    label: 'Members',
    icon: Users,
    path: (t) => `/${t}/admin/members`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY],
  },
  {
    label: 'Property',
    icon: Building2,
    path: (t) => `/${t}/admin/property/units`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY],
  },
  {
    label: 'Finance',
    icon: Wallet,
    path: (t) => `/${t}/admin/finance/overview`,
    roles: [UserRole.PRESIDENT, UserRole.TREASURER],
  },
  {
    label: 'Access Control',
    icon: ShieldCheck,
    path: (t) => `/${t}/admin/access/rfid`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR],
  },
  {
    label: 'Staff & Vendors',
    icon: UserCog,
    path: (t) => `/${t}/admin/staff/directory`,
    roles: [UserRole.PRESIDENT, UserRole.SUPERVISOR],
  },
  {
    label: 'Communications',
    icon: MessageSquare,
    path: (t) => `/${t}/admin/communications/notices`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY],
  },
  {
    label: 'Helpdesk',
    icon: Package,
    path: (t) => `/${t}/admin/helpdesk/complaints`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SUPERVISOR],
  },
  {
    label: 'IoT & Hardware',
    icon: Cpu,
    path: (t) => `/${t}/admin/access/gates`,
    roles: [UserRole.PRESIDENT, UserRole.SUPERVISOR],
  },
  {
    label: 'Analytics',
    icon: BarChart3,
    path: (t) => `/${t}/admin/finance/reports`,
    roles: [UserRole.PRESIDENT, UserRole.TREASURER],
  },
  {
    label: 'Elections',
    icon: Vote,
    path: (t) => `/${t}/admin/elections`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY],
  },
  {
    label: 'Notifications',
    icon: Bell,
    path: (t) => `/${t}/admin/communications/broadcast`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY],
  },
  {
    label: 'Alerts Map',
    icon: MapPin,
    path: (t) => `/${t}/admin/access/gates`,
    roles: [UserRole.PRESIDENT, UserRole.SUPERVISOR, UserRole.SECURITY_GUARD],
  },
  {
    label: 'Settings',
    icon: Settings,
    path: (t) => `/${t}/admin/settings`,
    roles: [UserRole.PRESIDENT, UserRole.SECRETARY],
  },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const { tenantId = '' } = useParams<{ tenantId: string }>()
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)

  const visibleItems = NAV_ITEMS.filter(
    (item) => user?.role && item.roles.includes(user.role)
  )

  return (
    <aside
      className="flex flex-col shrink-0 h-screen transition-all duration-300 ease-in-out"
      style={{
        width: collapsed ? '4.5rem' : '16rem',
        background: 'var(--sidebar-bg)',
        borderRight: '1px solid rgba(255,255,255,0.06)',
      }}
      aria-label="Sidebar navigation"
    >
      {/* Logo area */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-white/5">
        <div
          className="flex items-center justify-center rounded-lg shrink-0"
          style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)' }}
        >
          <Building2 size={18} color="white" />
        </div>
        {!collapsed && (
          <div>
            <p className="font-semibold text-white text-sm leading-tight">SmartSociety</p>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">360°</p>
          </div>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="ml-auto text-slate-400 hover:text-white transition-colors p-1 rounded"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          <ChevronLeft
            size={16}
            style={{ transform: collapsed ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}
          />
        </button>
      </div>

      {/* Navigation items */}
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-0.5">
        {visibleItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path(tenantId)}
            className={({ isActive }) =>
              `nav-link ${isActive ? 'active' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            <item.icon size={18} className="nav-icon shrink-0" />
            {!collapsed && (
              <span className="truncate">{item.label}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile + logout */}
      {user && (
        <div className="border-t border-white/5 p-3">
          <div className="flex items-center gap-2.5">
            <div
              className="flex items-center justify-center rounded-full shrink-0 text-white font-semibold text-sm"
              style={{
                width: 34, height: 34,
                background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
              }}
            >
              {user.name?.charAt(0).toUpperCase()}
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">{user.name}</p>
                <p className="text-[11px] text-slate-400 truncate">{user.role}</p>
              </div>
            )}
            <button
              onClick={logout}
              className="text-slate-400 hover:text-red-400 transition-colors p-1.5 rounded"
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
