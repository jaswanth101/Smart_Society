import { useState } from 'react'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'

// ─────────────────────────────────────────────────────────
// DashboardLayout — Tesla-inspired admin shell.
// ─────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false)

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50/50" style={{ background: 'var(--color-light-ash)' }}>
      {/* Mobile Backdrop */}
      {isMobileNavOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/50 md:hidden animate-fade-in"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      <Sidebar 
        mobileOpen={isMobileNavOpen} 
        setMobileOpen={setIsMobileNavOpen} 
      />
      
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar onMenuClick={() => setIsMobileNavOpen(true)} />
        <main
          id="main-content"
          className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 animate-fade-in-up"
        >
          {children}
        </main>
      </div>
    </div>
  )
}
