import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, XCircle, Clock, User, Home } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { formatRelativeTime } from '@/lib/format'

// ─────────────────────────────────────────────────────────
// MembersApprovalsPage — Enterprise KYC / Move-in Approvals
// ─────────────────────────────────────────────────────────

type PendingUser = {
  id: string
  name: string
  phone: string
  role: string
  createdAt: string
  unit?: { flatNumber: string; building: { name: string } }
}

export default function MembersApprovalsPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPending = async () => {
    try {
      const { data } = await apiClient.get('/users/pending')
      setPendingUsers(data)
    } catch (err) {
      console.error('Failed to fetch pending users', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (tenantId) fetchPending()
  }, [tenantId])

  const handleApprove = async (id: string, name: string) => {
    try {
      setPendingUsers(prev => prev.filter(u => u.id !== id))
      await apiClient.patch(`/users/${id}/approve`)
      // Refresh to ensure sync
      fetchPending()
    } catch (err) {
      alert(`Failed to approve ${name}.`)
      fetchPending()
    }
  }

  const handleReject = async (id: string, name: string) => {
    if (!confirm(`Are you absolutely sure you want to permanently delete ${name}'s request?`)) return
    try {
      setPendingUsers(prev => prev.filter(u => u.id !== id))
      await apiClient.patch(`/users/${id}/reject`)
    } catch (err) {
      alert(`Failed to delete ${name}.`)
      fetchPending()
    }
  }
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Pending approvals</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>KYC verifications, tenant move-ins, and member onboarding requests.</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label: 'Pending Physical Verification', value: pendingUsers.length.toString(), color: '#f59e0b' },
          { label: 'High Security Standard', value: 'Active', color: 'var(--color-success)' },
          { label: 'Fake Uploads Blocked', value: '100%', color: 'var(--color-heading)' },
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
            <p className="text-2xl font-medium" style={{ color: s.color }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Approval cards */}
      <div className="space-y-4">
        {loading ? (
          <p className="text-sm text-slate-500">Loading secure queue...</p>
        ) : pendingUsers.length === 0 ? (
          <div className="py-12 text-center border dashed rounded-[12px] border-slate-200">
            <CheckCircle className="mx-auto mb-3 opacity-20" size={32} />
            <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>Zero pending verifications</p>
            <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>The society perimeter is strictly secured.</p>
          </div>
        ) : (
          pendingUsers.map(user => (
            <Card key={user.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-[4px] flex items-center justify-center text-white font-medium shrink-0"
                    style={{ background: 'var(--color-electric-blue)' }}>
                    {user.name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-medium" style={{ color: 'var(--color-heading)' }}>{user.name}</h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-xs" style={{ color: 'var(--color-tertiary)' }}>
                      <span className="flex items-center gap-1 font-medium">
                        <Home size={12} />
                        {user.unit ? `${user.unit.building.name} - ${user.unit.flatNumber}` : 'Flat unassigned'}
                      </span>
                      <Badge variant="warning">Awaiting Original Docs</Badge>
                      <span className="flex items-center gap-1"><User size={12} />{user.role}</span>
                      <span className="flex items-center gap-1"><Clock size={12} />{formatRelativeTime(user.createdAt)}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button 
                    onClick={() => handleApprove(user.id, user.name)}
                    className="px-4 py-2 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 transition-colors duration-[330ms]"
                    style={{ background: 'var(--color-electric-blue)' }}>
                    <CheckCircle size={14} /> Verify & Approve
                  </button>
                  <button 
                    onClick={() => handleReject(user.id, user.name)}
                    className="px-4 py-2 rounded-[4px] text-sm font-medium flex items-center gap-1.5 transition-colors duration-[330ms]"
                    style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-danger)' }}>
                    <XCircle size={14} /> Delete
                  </button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  )
}
