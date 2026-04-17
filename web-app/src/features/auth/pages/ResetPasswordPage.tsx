import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Building2, CheckCircle } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'

export default function ResetPasswordPage() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setError('')
    setLoading(true)
    await new Promise(r => setTimeout(r, 800))
    setDone(true)
    setLoading(false)
    setTimeout(() => navigate('/login'), 2000)
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ background: 'var(--color-light-ash)' }}>
      <div className="w-full max-w-md">
        <div className="flex items-center gap-2 mb-8">
          <Building2 size={28} style={{ color: 'var(--color-electric-blue)' }} />
          <p className="font-medium text-xl" style={{ color: 'var(--color-heading)' }}>SmartSociety 360</p>
        </div>

        <div className="rounded-[12px] p-8" style={{ background: 'var(--color-white)' }}>
          {!done ? (
            <>
              <h2 className="text-[28px] font-medium mb-1" style={{ color: 'var(--color-heading)' }}>Set new password</h2>
              <p className="text-sm mb-6" style={{ color: 'var(--color-tertiary)' }}>Your new password must be at least 8 characters.</p>
              <form onSubmit={handleSubmit} className="space-y-4">
                <Input id="new-password" label="New password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                <Input id="confirm-password" label="Confirm password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required />
                {error && <p className="text-xs font-medium" style={{ color: 'var(--color-danger)' }}>{error}</p>}
                <Button type="submit" variant="primary" size="lg" loading={loading} className="w-full">Reset password</Button>
              </form>
            </>
          ) : (
            <div className="text-center py-4">
              <div className="w-14 h-14 rounded-[4px] flex items-center justify-center mx-auto mb-4" style={{ background: '#10b98114', color: 'var(--color-success)' }}>
                <CheckCircle size={28} />
              </div>
              <h2 className="text-[22px] font-medium mb-2" style={{ color: 'var(--color-heading)' }}>Password updated</h2>
              <p className="text-sm" style={{ color: 'var(--color-tertiary)' }}>Redirecting to login...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
