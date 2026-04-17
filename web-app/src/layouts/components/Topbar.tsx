import { Bell, Search, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'

// ─────────────────────────────────────────────────────────
// Topbar — sits above main content.
// Contains search, notifications badge, and theme toggle.
// ─────────────────────────────────────────────────────────

export function Topbar() {
  const [dark, setDark]       = useState(false)
  const [search, setSearch]   = useState('')
  const user = useAuthStore((s) => s.user)

  const toggleTheme = () => {
    setDark((d) => !d)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <header
      className="shrink-0 flex items-center gap-4 px-4 md:px-6 lg:px-8 py-3.5"
      style={{
        background: 'var(--color-surface-0)',
        borderBottom: '1px solid var(--color-surface-200)',
      }}
      role="banner"
    >
      {/* Search bar */}
      <div className="relative flex-1 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
          aria-hidden
        />
        <input
          id="topbar-search"
          type="search"
          placeholder="Search members, tickets, units…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 transition-all"
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          id="notification-bell"
          className="relative p-2 rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          aria-label="Notifications"
        >
          <Bell size={18} />
          {/* Unread badge — hardcoded for structure; will be dynamic */}
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500"
            aria-label="Unread notifications"
          />
        </button>

        {/* Tenant context chip */}
        {user?.tenantId && (
          <div className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-medium bg-blue-50 text-blue-700 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
            {user.tenantId}
          </div>
        )}
      </div>
    </header>
  )
}
