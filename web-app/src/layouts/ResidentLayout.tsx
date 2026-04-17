import { type ReactNode, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Bell, User, Building, Home, CreditCard, MessageSquare, Menu, X } from 'lucide-react'
import { useAuthStore } from '@/store/auth.store'

// ─────────────────────────────────────────────────────────
// ResidentLayout — Main consumer-facing layout for Owners/Tenants.
// Uses a Top Navigation Bar rather than a heavy Admin sidebar.
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
    { name: 'Home',       path: `/${tenantId}/resident/home`,       icon: <Home size={18} /> },
    { name: 'Payments',   path: `/${tenantId}/resident/finance`,    icon: <CreditCard size={18} /> },
    { name: 'Helpdesk',   path: `/${tenantId}/resident/complaints`, icon: <MessageSquare size={18} /> },
    { name: 'Community',  path: `/${tenantId}/resident/community`,  icon: <Building size={18} /> },
  ]

  return (
    <div className="min-h-screen bg-[var(--color-surface-50)] text-slate-900 flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-[var(--color-surface-200)] sticky top-0 z-30 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Logo & Brand */}
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white">
                <Building size={20} />
              </div>
              <span className="font-bold text-lg text-slate-800 tracking-tight hidden sm:block">
                SmartSociety 360
              </span>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden md:flex space-x-1">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname.startsWith(link.path)
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
                  >
                    {link.icon}
                    {link.name}
                  </Link>
                )
              })}
            </div>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3">
              <button className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-100 transition relative">
                <Bell size={20} />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-white" />
              </button>
              
              <div className="hidden sm:flex items-center gap-2 pl-3 border-l border-slate-200">
                <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center overflow-hidden border border-blue-200 shadow-sm">
                  {user?.avatarUrl ? (
                    <img src={user.avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <User size={16} />
                  )}
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-slate-700 leading-none">{user?.name}</span>
                  <span className="text-[10px] text-slate-500 mt-0.5">{user?.role.replace('_', ' ')}</span>
                </div>
              </div>

              {/* Mobile Menu Toggle */}
              <div className="flex md:hidden items-center">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="p-2 text-slate-500 rounded-md hover:bg-slate-100 focus:outline-none"
                >
                  {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-slate-200 bg-white">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {NAV_LINKS.map((link) => {
                const isActive = location.pathname.startsWith(link.path)
                return (
                  <Link
                    key={link.name}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`flex items-center gap-3 block px-3 py-2.5 rounded-md text-base font-medium ${
                      isActive 
                        ? 'bg-blue-50 text-blue-700' 
                        : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                    }`}
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

      {/* Main Content Render Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 animate-fade-in-up">
        {children}
      </main>
    </div>
  )
}
