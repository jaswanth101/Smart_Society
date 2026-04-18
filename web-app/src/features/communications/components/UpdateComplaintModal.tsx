import { useState, useEffect } from 'react'
import { Activity, X, User } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { Badge } from '@/components/ui/Badge'
import { apiClient } from '@/lib/api'

interface UpdateComplaintModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  ticket: any
}

const STATUS_VARIANT: Record<string, 'danger'|'warning'|'info'|'neutral'|'success'> = {
  ESCALATED:   'danger',
  IN_PROGRESS: 'warning',
  ASSIGNED:    'info',
  PENDING:     'neutral',
  RESOLVED:    'success',
  CLOSED:      'neutral'
}

export function UpdateComplaintModal({ isOpen, onClose, onSuccess, ticket }: UpdateComplaintModalProps) {
  const [status, setStatus] = useState('PENDING')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (isOpen && ticket) {
      setStatus(ticket.status || 'PENDING')
      setError('')
    }
  }, [isOpen, ticket])

  if (!isOpen || !ticket) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.patch(`/complaints/${ticket.id}/status`, {
        status,
      })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update ticket status.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-[12px] w-full max-w-md shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--color-cloud)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[4px]" style={{ background: 'var(--color-light-ash)', color: 'var(--color-heading)' }}>
              <Activity size={20} />
            </div>
            <div>
              <h2 className="text-xl font-medium leading-tight" style={{ color: 'var(--color-heading)' }}>Update Ticket</h2>
              <p className="text-xs font-mono mt-0.5" style={{ color: 'var(--color-tertiary)' }}>{ticket.ticketId}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full flex-shrink-0">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px] mb-4">{error}</div>}
          
          <div className="p-4 rounded-[6px] mb-6 flex flex-col gap-3" style={{ background: 'var(--color-cloud)' }}>
             <div className="flex justify-between items-start gap-2">
                <p className="font-medium text-sm" style={{ color: 'var(--color-heading)' }}>{ticket.title}</p>
                <Badge variant={STATUS_VARIANT[ticket.status] || 'neutral'}>{ticket.status}</Badge>
             </div>
             <p className="text-sm" style={{ color: 'var(--color-body)' }}>{ticket.description}</p>
             <div className="flex items-center gap-2 mt-1">
                <User size={14} style={{ color: 'var(--color-placeholder)' }} />
                <span className="text-xs font-medium" style={{ color: 'var(--color-tertiary)' }}>Raised by: {ticket.raisedBy?.name || 'Unknown Resident'}</span>
             </div>
          </div>

          <div className="space-y-1 mb-6">
             <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>New Status</label>
             <Select 
               options={[
                 { value: 'PENDING', label: 'Pending' },
                 { value: 'ASSIGNED', label: 'Assigned' },
                 { value: 'IN_PROGRESS', label: 'In Progress' },
                 { value: 'ESCALATED', label: 'Escalated' },
                 { value: 'RESOLVED', label: 'Resolved' },
                 { value: 'CLOSED', label: 'Closed' },
               ]}
               value={status}
               onChange={setStatus}
             />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} disabled={status === ticket.status}>Update Status</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
