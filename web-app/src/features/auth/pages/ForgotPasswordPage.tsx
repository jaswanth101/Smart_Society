import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Building2, ArrowLeft, Mail } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-light-ash)' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <Building2 size={28} style={{ color: 'var(--color-electric-blue)' }} />
          <p className="font-medium text-xl" style={{ color: 'var(--color-heading)' }}>SmartSociety 360</p>
        </div>

        <div className="rounded-[12px] p-8" style={{ background: 'var(--color-white)' }}>
          {!sent ? (
            <>
              <h2 className="text-[28px] font-medium mb-1" style={{ color: 'var(--color-heading)' }}>Forgot password</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-tertiary)' }}>Enter your email and we'll send a reset link.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="forgot-email" label="Email address" type="email" placeholder="you@society.com" value={email} onChange={e => setEmail(e.target.value)} required />
                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Send reset link</Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-[4px] flex items-center justify-center mx-auto mb-4" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>
                <Mail size={28} />
              </div>
              <h2 className="text-[22px] font-medium mb-2" style={{ color: 'var(--color-heading)' }}>Check your email</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-tertiary)' }}>We've sent a password reset link to <strong>{email}</strong></p>
            </div>
          )}
          <Link to="/login" className="flex items-center gap-1.5 justify-center mt-4 text-sm font-medium transition-colors duration-[330ms]" style={{ color: 'var(--color-electric-blue)' }}>
            <ArrowLeft size={14} /> Back to login
          </Link>
        </div>
      </div>
    </div>
  )
}
