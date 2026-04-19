import { useState } from 'react'
import { UserPlus, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { apiClient } from '@/lib/api'

interface AddStaffModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddStaffModal({ isOpen, onClose, onSuccess }: AddStaffModalProps) {
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [role, setRole] = useState('')
  const [department, setDepartment] = useState('Housekeeping')
  const [shift, setShift] = useState('FIXED')
  const [shiftTime, setShiftTime] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/staff', {
        name,
        role,
        department,
        phone,
        shift,
        shiftTime
      })
      onSuccess()
      onClose()
      setName('')
      setPhone('')
      setRole('')
      setDepartment('Housekeeping')
      setShift('FIXED')
      setShiftTime('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register staff member.')
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
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Register Staff</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <div className="grid grid-cols-2 gap-4">
            <Input id="s-name" label="Full Name" placeholder="e.g. Ramesh Kumar" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input id="s-phone" type="tel" label="Phone Number" placeholder="e.g. +91 9999999999" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input id="s-role" label="Job Title" placeholder="e.g. Electrician" value={role} onChange={(e) => setRole(e.target.value)} required />
            
            <div className="space-y-1">
               <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Department</label>
               <Select 
                 options={[
                   { value: 'Security', label: 'Security' },
                   { value: 'Housekeeping', label: 'Housekeeping' },
                   { value: 'Maintenance', label: 'Maintenance' },
                   { value: 'Facility', label: 'Facility' },
                 ]}
                 value={department}
                 onChange={setDepartment}
               />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t" style={{ borderColor: 'var(--color-cloud)' }}>
            <div className="space-y-1">
               <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Shift Type</label>
               <Select 
                 options={[
                   { value: 'DAY', label: 'Day Shift' },
                   { value: 'NIGHT', label: 'Night Shift' },
                   { value: 'FLEXIBLE', label: 'Flexible / ROTATIONAL' },
                   { value: 'FIXED', label: 'Fixed Hours' },
                 ]}
                 value={shift}
                 onChange={setShift}
               />
            </div>
            <Input id="s-shifttime" label="Timings (Optional)" placeholder="e.g. 08:00 AM - 04:00 PM" value={shiftTime} onChange={(e) => setShiftTime(e.target.value)} />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-6" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="mt-4 md:mt-0">Register Staff</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
