import { useState } from 'react'
import { Briefcase, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { apiClient } from '@/lib/api'

interface AddVendorModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddVendorModal({ isOpen, onClose, onSuccess }: AddVendorModalProps) {
  const [companyName, setCompanyName] = useState('')
  const [category, setCategory] = useState('AMC - Elevator')
  const [contactPerson, setContactPerson] = useState('')
  const [phone, setPhone] = useState('')
  const [monthlyValue, setMonthlyValue] = useState('')
  const [status, setStatus] = useState('ACTIVE')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/staff/vendors', {
        companyName,
        category,
        contactPerson,
        phone,
        monthlyValue: monthlyValue ? parseFloat(monthlyValue) : undefined,
        status
      })
      onSuccess()
      onClose()
      setCompanyName('')
      setCategory('AMC - Elevator')
      setContactPerson('')
      setPhone('')
      setMonthlyValue('')
      setStatus('ACTIVE')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to register vendor.')
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
              <Briefcase size={20} />
            </div>
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Register AMC Vendor</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <Input id="v-company" label="Company Name" placeholder="e.g. Otis Elevators" value={companyName} onChange={(e) => setCompanyName(e.target.value)} required />
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Category</label>
               <Select 
                 options={[
                   { value: 'AMC - Elevator', label: 'AMC Elevators' },
                   { value: 'AMC - Generator', label: 'AMC Generator' },
                   { value: 'Landscaping', label: 'Landscaping' },
                   { value: 'Security Agency', label: 'Security Agency' },
                   { value: 'Housekeeping Agency', label: 'Housekeeping Agency' },
                   { value: 'Water Tanker', label: 'Water Tanker' },
                   { value: 'General Contractor', label: 'General Contractor' },
                 ]}
                 value={category}
                 onChange={setCategory}
               />
            </div>
            
            <Input id="v-value" type="number" label="Monthly Value (₹)" placeholder="e.g. 15000" value={monthlyValue} onChange={(e) => setMonthlyValue(e.target.value)} />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2 border-t" style={{ borderColor: 'var(--color-cloud)' }}>
            <Input id="v-contact" label="Contact Person" placeholder="e.g. Aman Verma" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} required />
            <Input id="v-phone" type="tel" label="Contact Phone" placeholder="e.g. +91 9999999999" value={phone} onChange={(e) => setPhone(e.target.value)} required />
          </div>

          <div className="space-y-1">
             <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Contract Status</label>
             <Select 
               options={[
                 { value: 'ACTIVE', label: 'Active Contract' },
                 { value: 'INACTIVE', label: 'Inactive / Expired' },
               ]}
               value={status}
               onChange={setStatus}
             />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-6" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="mt-4 md:mt-0">Register Vendor</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
