import { Bell, Search, Sun, Moon } from 'lucide-react'
import { useState } from 'react'
import { useAuthStore } from '@/store/auth.store'

// ─────────────────────────────────────────────────────────
// Topbar — Tesla-inspired: white bg, no shadow, frosted glass
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
        background: 'var(--color-white)',
        borderBottom: '1px solid var(--color-cloud)',
      }}
      role="banner"
    >
      {/* Search */}
      <div className="relative flex-1 max-w-sm">
        <Search
          size={16}
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          style={{ color: 'var(--color-placeholder)' }}
          aria-hidden
        />
        <input
          id="topbar-search"
          type="search"
          placeholder="Search members, tickets, units…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px] border transition-all duration-[330ms]"
          style={{
            borderColor: 'var(--color-cloud)',
            background: 'var(--color-white)',
            color: 'var(--color-heading)',
          }}
        />
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-[4px] transition-colors duration-[330ms]"
          style={{ color: 'var(--color-tertiary)' }}
          aria-label="Toggle theme"
        >
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        {/* Notifications */}
        <button
          id="notification-bell"
          className="relative p-2 rounded-[4px] transition-colors duration-[330ms]"
          style={{ color: 'var(--color-tertiary)' }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          <span
            className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full"
            style={{ background: 'var(--color-electric-blue)' }}
            aria-label="Unread notifications"
          />
        </button>

        {/* Tenant chip */}
        {user?.tenantId && (
          <div
            className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-[4px] text-[11px] font-medium"
            style={{
              background: 'var(--color-light-ash)',
              color: 'var(--color-tertiary)',
            }}
          >
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--color-electric-blue)' }} />
            {user.tenantId}
          </div>
        )}
      </div>
    </header>
  )
}
