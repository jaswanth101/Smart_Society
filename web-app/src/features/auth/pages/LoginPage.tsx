import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/auth.store'
import { UserRole, type AuthUser } from '@/types'

// ─────────────────────────────────────────────────────────
// LoginPage — Unified login portal for all 9 roles.
// Supports: Phone + OTP (residents/staff) or Email + Password (admins).
// Multi-tenant: user selects society from dropdown after auth.
// ─────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate  = useNavigate()
  const setAuth   = useAuthStore((s) => s.setAuth)
  const [tab, setTab]         = useState<'admin' | 'resident'>('admin')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')
  const [mockRole, setMockRole] = useState<UserRole>(UserRole.PRESIDENT)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // TODO: replace with real API call via auth.api.ts
      await new Promise((r) => setTimeout(r, 800))
      
      if (tab === 'admin') {
        const mockUser: AuthUser = {
          id:       'usr_001',
          name:     mockRole === UserRole.PRESIDENT ? 'Rajesh Iyer' : 'Test Admin',
          email,
          phone:    '+91 99999 00000',
          role:     mockRole,
          tenantId: 'society_alpha',
        }
        setAuth('mock_jwt_token_here', mockUser)
        navigate('/society_alpha/admin/dashboard')
      } else {
        const mockUser: AuthUser = {
          id:       'usr_102',
          name:     'Priya Sharma',
          email:    'priya@example.com',
          phone:    email || '+91 98765 43210',
          role:     UserRole.FLAT_OWNER,
          tenantId: 'society_alpha',
        }
        setAuth('mock_jwt_token_here', mockUser)
        navigate('/society_alpha/resident/home')
      }
    } catch {
      setError('Invalid credentials. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen grid lg:grid-cols-2"
      style={{ background: 'var(--color-surface-50)' }}
    >
      {/* ── Left panel — brand hero ─────────────────────── */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{
          background: 'linear-gradient(145deg, #0f172a 0%, #1e3a8a 60%, #1d4ed8 100%)',
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-xl"
            style={{
              width: 48, height: 48,
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            }}
          >
            <Building2 size={24} color="white" />
          </div>
          <div>
            <p className="text-white font-bold text-lg leading-none">SmartSociety</p>
            <p className="text-blue-300 text-xs uppercase tracking-widest">360°</p>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <h1 className="text-4xl font-bold text-white leading-tight mb-4">
            Manage your entire<br />society from one<br />
            <span style={{ color: '#60a5fa' }}>secure dashboard.</span>
          </h1>
          <p className="text-blue-200 text-base leading-relaxed max-w-sm">
            Gate access, finance, helpdesk, IoT hardware, and community operations — unified.
          </p>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2">
          {['RFID Access Control', 'Razorpay Payments', 'ANPR Vehicle AI', 'Live IoT Monitoring', 'WhatsApp Alerts', 'Multi-Tenant SaaS'].map((f) => (
            <span
              key={f}
              className="px-3 py-1.5 rounded-full text-xs font-medium text-blue-200"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* ── Right panel — login form ────────────────────── */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <Building2 size={28} color="#2563eb" />
            <p className="font-bold text-xl text-slate-900">SmartSociety 360</p>
          </div>

          <h2 className="text-2xl font-bold text-slate-900 mb-1">Welcome back</h2>
          <p className="text-slate-500 text-sm mb-8">Sign in to your society's admin panel</p>

          {/* Tab switcher */}
          <div
            className="flex rounded-lg p-1 mb-6"
            style={{ background: 'var(--color-surface-100)' }}
            role="tablist"
          >
            {([['admin', 'Admin Login'], ['resident', 'Resident / OTP']] as const).map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className={[
                  'flex-1 py-2 rounded-md text-sm font-medium transition-all duration-150',
                  tab === key
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-500 hover:text-slate-700',
                ].join(' ')}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <Input
              id="login-email"
              label={tab === 'admin' ? 'Email address' : 'Mobile number'}
              type={tab === 'admin' ? 'email' : 'tel'}
              placeholder={tab === 'admin' ? 'president@alphasociety.com' : '+91 98765 43210'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="username"
            />
            {tab === 'admin' && (
              <>
                <Input
                  id="login-password"
                  label="Password"
                  type={showPass ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPass((s) => !s)}
                      aria-label={showPass ? 'Hide password' : 'Show password'}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Test Role Override (Mock)</label>
                  <select
                    value={mockRole}
                    onChange={(e) => setMockRole(e.target.value as UserRole)}
                    className="w-full h-11 px-3 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
                  >
                    <option value={UserRole.PRESIDENT}>President (Full Access)</option>
                    <option value={UserRole.SECRETARY}>Secretary (Members, Comms)</option>
                    <option value={UserRole.TREASURER}>Treasurer (Finance)</option>
                    <option value={UserRole.SUPERVISOR}>Supervisor (Staff, IoT/Gates)</option>
                  </select>
                </div>
              </>
            )}

            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-lg text-sm text-red-700"
                style={{ background: '#fee2e2', border: '1px solid #fca5a5' }}
                role="alert"
              >
                {error}
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              className="w-full"
            >
              {tab === 'admin' ? 'Sign in' : 'Send OTP'}
            </Button>
          </form>

          <p className="text-center text-xs text-slate-400 mt-8">
            © {new Date().getFullYear()} SmartSociety 360. Multi-tenant, enterprise-grade platform.
          </p>
        </div>
      </div>
    </div>
  )
}
