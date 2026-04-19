import { useState } from 'react'
import { Plus, X, Server } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api'

interface AddAmenityModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddAmenityModal({ isOpen, onClose, onSuccess }: AddAmenityModalProps) {
  const [name, setName] = useState('')
  const [maxCapacity, setMaxCapacity] = useState('20')
  const [quotaPerWeek, setQuotaPerWeek] = useState('5')
  const [timings, setTimings] = useState('6AM-10PM')
  const [rfidRequired, setRfidRequired] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/amenities', {
        name,
        maxCapacity: parseInt(maxCapacity, 10),
        quotaPerWeek: parseInt(quotaPerWeek, 10),
        timings,
        rfidRequired,
        status: 'ACTIVE'
      })
      onSuccess()
      onClose()
      setName('')
      setMaxCapacity('20')
      setQuotaPerWeek('5')
      setTimings('6AM-10PM')
      setRfidRequired(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add amenity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-[12px] w-full max-w-[480px] shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-5 border-b" style={{ borderColor: 'var(--color-cloud)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[4px]" style={{ background: 'var(--color-light-ash)', color: 'var(--color-heading)' }}>
              <Plus size={20} />
            </div>
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Add Amenity</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <Input 
            id="a-name" 
            label="Facility Name" 
            placeholder="e.g. Swimming Pool" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
          />
          
          <div className="grid grid-cols-2 gap-4">
            <Input 
              id="a-cap" 
              label="Max Capacity" 
              type="number"
              min="1"
              value={maxCapacity} 
              onChange={(e) => setMaxCapacity(e.target.value)} 
              required 
            />
            <Input 
              id="a-quota" 
              label="Weekly Quota" 
              type="number"
              min="1"
              value={quotaPerWeek} 
              onChange={(e) => setQuotaPerWeek(e.target.value)} 
              required 
            />
          </div>

          <Input 
            id="a-timings" 
            label="Operating Timings" 
            placeholder="e.g. 5AM-11AM, 4PM-10PM" 
            value={timings} 
            onChange={(e) => setTimings(e.target.value)} 
            required 
          />

          <div className="p-4 rounded-[6px] flex items-start gap-3 mt-4" style={{ border: '1px solid var(--color-cloud)' }}>
            <Server size={18} className="mt-0.5" style={{ color: 'var(--color-electric-blue)' }} />
            <div className="flex-1">
               <span className="block text-sm font-medium" style={{ color: 'var(--color-heading)' }}>IoT Smart Lock (RFID Required)</span>
               <span className="block text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>If connected to a physical gate relay, residents must tap their active RFID tag to enter.</span>
               <div className="mt-3 flex items-center gap-2">
                 <input 
                   type="checkbox" 
                   id="rfid" 
                   className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
                   checked={rfidRequired} 
                   onChange={(e) => setRfidRequired(e.target.checked)} 
                 />
                 <label htmlFor="rfid" className="text-sm cursor-pointer select-none" style={{ color: 'var(--color-heading)' }}>
                   Enable electronic access control
                 </label>
               </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-4" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="mt-4 md:mt-0">Create Facility</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
