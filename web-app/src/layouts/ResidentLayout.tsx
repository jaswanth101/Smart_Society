import { type ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, User, Building, Home, CreditCard, MessageSquare, Menu, X, Users, Car, FileText, Dumbbell, QrCode } from 'lucide-react'
import { useAuthStore } from '@/store/authStore'

// ─────────────────────────────────────────────────────────
// ResidentLayout — Tesla-inspired consumer-facing layout.
// Frosted-glass top nav, no shadows, 4px radii.
// ─────────────────────────────────────────────────────────

interface ResidentLayoutProps {
  children: ReactNode
}

export function ResidentLayout({ children }: ResidentLayoutProps) {
  const user = useAuthStore((s) => s.user)
  const location = useLocation()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const tenantId = user?.tenantId ?? 'society'

  const NAV_LINKS = [
    { name: 'Home',      path: `/${tenantId}/resident/home`,       icon: <Home size={18} /> },
    { name: 'Payments',  path: `/${tenantId}/resident/finance`,    icon: <CreditCard size={18} /> },
    { name: 'Visitors',  path: `/${tenantId}/resident/visitors`,   icon: <QrCode size={18} /> },
    { name: 'Family',    path: `/${tenantId}/resident/family`,     icon: <Users size={18} /> },
    { name: 'Helpdesk',  path: `/${tenantId}/resident/complaints`, icon: <MessageSquare size={18} /> },
    { name: 'Amenities', path: `/${tenantId}/resident/amenities`,  icon: <Dumbbell size={18} /> },
    { name: 'Community', path: `/${tenantId}/resident/community`,  icon: <Building size={18} /> },
    { name: 'Notices',   path: `/${tenantId}/resident/notices`,    icon: <FileText size={18} /> },
  ]

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-light-ash)', color: 'var(--color-heading)' }}>
      {/* Top Navigation */}
      <nav
        className="sticky top-0 z-30"
        style={{ background: 'var(--color-white)', borderBottom: '1px solid var(--color-cloud)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo */}
            <div className="flex items-center gap-2">
              <div
                className="w-8 h-8 rounded-[4px] flex items-center justify-center text-white"
                style={{ background: 'var(--color-electric-blue)' }}
              >
                <Building size={20} />
              </div>
              <span className="font-medium text-lg hidden sm:block whitespace-nowrap" style={{ color: 'var(--color-heading)' }}>
                SmartSociety 360
              </span>
            </div>

            {/* Desktop Nav */}
            <div className="hidden md:flex space-x-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname.startsWith(link.path)
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className="flex items-center gap-2 px-3 py-2 rounded-[4px] text-sm font-medium transition-colors duration-[330ms]"
                    style={{
                      background: isActive ? '#3E6AE114' : 'transparent',
                      color: isActive ? 'var(--color-electric-blue)' : 'var(--color-tertiary)',
                    }}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                )
              })}
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-3">
              <button
                className="p-2 rounded-[4px] transition-colors duration-[330ms] relative"
                style={{ color: 'var(--color-tertiary)' }}
              >
                <Bell size={20} />
                <span
                  className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
                  style={{ background: 'var(--color-electric-blue)' }}
                />
              </button>
              
              <div className="hidden sm:flex items-center gap-2 pl-3" style={{ borderLeft: '1px solid var(--color-cloud)' }}>
                <div
                  className="w-8 h-8 rounded-[4px] flex items-center justify-center text-white overflow-hidden"
                  style={{ background: 'var(--color-electric-blue)' }}
                >
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium leading-none whitespace-nowrap" style={{ color: 'var(--color-heading)' }}>{user?.name}</span>
                  <span className="text-[10px] mt-0.5 whitespace-nowrap" style={{ color: 'var(--color-placeholder)' }}>{user?.role.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Mobile Toggle */}
              <div className="flex md:hidden items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 rounded-[4px]"
                  style={{ color: 'var(--color-tertiary)' }}
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden" style={{ borderTop: '1px solid var(--color-cloud)', background: 'var(--color-white)' }}>
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname.startsWith(link.path)
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-[4px] text-base font-medium transition-colors duration-[330ms]"
                    style={{
                      background: isActive ? '#3E6AE114' : 'transparent',
                      color: isActive ? 'var(--color-electric-blue)' : 'var(--color-tertiary)',
                    }}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </nav>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
        {children}
      </main>
    </div>
  )
}
