import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, Eye, EyeOff } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// LoginPage — Tesla-inspired unified login portal.
// ─────────────────────────────────────────────────────────

export default function LoginPage() {
  const navigate  = useNavigate()
  const loginFn   = useAuthStore((s) => s.login)
  const [tab, setTab]         = useState<'admin' | 'resident'>('admin')
  const [email, setEmail]     = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // Direct call to NestJS Auth Controller
      const response = await apiClient.post('/auth/login', { email, password });
      
      const { accessToken, user } = response.data;
      
      // Persist to Zustand + LocalStorage
      loginFn(user, accessToken);

      // Dynamic redirection based on the REAL role retrieved from the DB
      const role = user.role;
      if (role === UserRole.SUPER_ADMIN) {
        navigate('/platform/dashboard')
      } else if (role === UserRole.FLAT_OWNER || role === UserRole.TENANT) {
        navigate(`/${user.tenantId}/resident/home`)
      } else {
        navigate(`/${user.tenantId}/admin/dashboard`)
      }
    } catch (err: any) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Invalid credentials or server unavailable. Please try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2" style={{ background: 'var(--color-white)' }}>

      {/* Left panel — Carbon Dark hero */}
      <div
        className="hidden lg:flex flex-col justify-between p-12"
        style={{ background: 'var(--color-carbon-dark)' }}
      >
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center rounded-[4px]"
            style={{ width: 48, height: 48, background: 'var(--color-electric-blue)' }}
          >
            <Building2 size={24} color="white" />
          </div>
          <div>
            <p className="text-white font-medium text-lg leading-none">SmartSociety</p>
            <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>360</p>
          </div>
        </div>

        {/* Hero text */}
        <div>
          <h1 className="text-[40px] font-medium text-white leading-[1.2] mb-4">
            Manage your entire<br />society from one<br />
            <span style={{ color: 'var(--color-electric-blue)' }}>secure dashboard.</span>
          </h1>
          <p className="text-sm leading-relaxed max-w-sm" style={{ color: 'var(--color-placeholder)' }}>
            Gate access, finance, helpdesk, IoT hardware, and community operations — unified.
          </p>
        </div>

        {/* Feature chips */}
        <div className="flex flex-wrap gap-2">
          {['RFID access control', 'Razorpay payments', 'ANPR vehicle AI', 'Live IoT monitoring', 'WhatsApp alerts', 'Multi-tenant SaaS'].map((f) => (
            <span
              key={f}
              className="px-3 py-1.5 rounded-[4px] text-xs font-medium"
              style={{ color: 'var(--color-placeholder)', background: 'rgba(255,255,255,0.06)' }}
            >
              {f}
            </span>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-md">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center gap-2 mb-8">
            <Building2 size={28} style={{ color: 'var(--color-electric-blue)' }} />
            <p className="font-medium text-xl" style={{ color: 'var(--color-heading)' }}>SmartSociety 360</p>
          </div>

          <h2 className="text-[28px] font-medium mb-1" style={{ color: 'var(--color-heading)' }}>Welcome back</h2>
          <p className="text-sm mb-8" style={{ color: 'var(--color-tertiary)' }}>Sign in to your society's admin panel</p>

          {/* Tab switcher */}
          <div
            className="flex rounded-[4px] p-1 mb-6"
            style={{ background: 'var(--color-light-ash)' }}
            role="tablist"
          >
            {([['admin', 'Admin login'], ['resident', 'Resident / OTP']] as const).map(([key, label]) => (
              <button
                key={key}
                role="tab"
                aria-selected={tab === key}
                onClick={() => setTab(key)}
                className="flex-1 py-2 rounded-[4px] text-sm font-medium transition-all duration-[330ms]"
                style={{
                  background: tab === key ? 'var(--color-white)' : 'transparent',
                  color: tab === key ? 'var(--color-heading)' : 'var(--color-tertiary)',
                }}
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
                      style={{ color: 'var(--color-placeholder)' }}
                    >
                      {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  }
                />

              </>
            )}

            {error && (
              <div
                className="flex items-center gap-2 px-4 py-3 rounded-[4px] text-sm"
                style={{ background: '#fee2e2', color: '#991b1b' }}
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

          <p className="text-center text-xs mt-8" style={{ color: 'var(--color-placeholder)' }}>
            © {new Date().getFullYear()} SmartSociety 360. Multi-tenant, enterprise-grade platform.
          </p>
        </div>
      </div>
    </div>
  )
}
