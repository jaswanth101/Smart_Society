import { useState, useEffect } from 'react'
import { UserPlus, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api'

interface AddMemberModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddMemberModal({ isOpen, onClose, onSuccess }: AddMemberModalProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('FLAT_OWNER')
  const [unitId, setUnitId] = useState('')
  const [units, setUnits] = useState<any[]>([])
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Fetch flats so we can assign the user to one
  useEffect(() => {
    if (isOpen) {
      apiClient.get('/property/units')
        .then(res => setUnits(res.data))
        .catch(err => console.error('Failed to load units', err))
    }
  }, [isOpen])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/users', {
        name,
        email,
        phone,
        role,
        unitId: unitId || undefined,
      })
      onSuccess()
      onClose()
      setName('')
      setEmail('')
      setPhone('')
      setUnitId('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create member.')
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
              <UserPlus size={20} />
            </div>
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Add New Member</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <Input id="m-name" label="Full Name" placeholder="e.g. John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
          <Input id="m-email" type="email" label="Email Address" placeholder="e.g. john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
          <Input id="m-phone" type="tel" label="Phone Number" placeholder="e.g. +91 9876543210" value={phone} onChange={(e) => setPhone(e.target.value)} required />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Role Designation</label>
               <select 
                 className="w-full px-3 py-2 text-sm rounded-[4px]" 
                 style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
                 value={role}
                 onChange={(e) => setRole(e.target.value)}
               >
                 <option value="FLAT_OWNER">Flat Owner</option>
                 <option value="TENANT">Tenant</option>
                 <option value="SECURITY_GUARD">Security Guard</option>
                 <option value="SECRETARY">Secretary</option>
                 <option value="SUPERVISOR">Maintenance Spv</option>
               </select>
            </div>
            
            <div className="space-y-1">
               <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Assign to Flat (Optional)</label>
               <select 
                 className="w-full px-3 py-2 text-sm rounded-[4px]" 
                 style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
                 value={unitId}
                 onChange={(e) => setUnitId(e.target.value)}
               >
                 <option value="">Unassigned</option>
                 {units.map(u => <option key={u.id} value={u.id}>{u.building?.name} - {u.flatNumber}</option>)}
               </select>
            </div>
          </div>
          
          <div className="p-3 bg-blue-50 text-blue-800 text-xs rounded-[4px] mt-2">
            The system will automatically generate a secure 8-character password and email this credential to the user immediately.
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-6" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="mt-4 md:mt-0">Register & Send Invite</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
