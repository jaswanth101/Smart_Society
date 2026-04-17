import { type ReactNode } from 'react'
import { Sidebar } from './components/Sidebar'
import { Topbar } from './components/Topbar'

// ─────────────────────────────────────────────────────────
// DashboardLayout — Main shell for all admin pages.
// Renders a fixed sidebar + scrollable content area.
// Fully responsive: sidebar collapses to drawer on mobile.
// ─────────────────────────────────────────────────────────

interface DashboardLayoutProps {
  children: ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <div className="flex h-screen bg-[var(--color-surface-50)] overflow-hidden">
      {/* Sidebar — fixed left panel */}
      <Sidebar />

      {/* Main content area */}
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
