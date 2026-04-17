import { type ReactNode } from 'react'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'

// ─────────────────────────────────────────────────────────
// DashboardLayout — Tesla-inspired admin shell.
// Carbon Dark sidebar + white content area, no shadows.
// ─────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--color-light-ash)' }}>
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <Topbar />
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
