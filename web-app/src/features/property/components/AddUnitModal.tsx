import { useState } from 'react'
import { Home, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api'

interface AddUnitModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  buildings: any[]
}

export function AddUnitModal({ isOpen, onClose, onSuccess, buildings }: AddUnitModalProps) {
  const [buildingId, setBuildingId] = useState(buildings[0]?.id || '')
  const [flatNumber, setFlatNumber] = useState('')
  const [floor, setFloor] = useState('')
  const [type, setType] = useState('BHK2')
  const [sqft, setSqft] = useState('')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/property/units', {
        buildingId,
        flatNumber,
        floor: parseInt(floor, 10),
        sqft: parseInt(sqft, 10),
        type,
        occupancy: 'VACANT'
      })
      onSuccess()
      onClose()
      setFlatNumber('')
      setFloor('')
      setSqft('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create unit.')
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
              <Home size={20} />
            </div>
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Add New Unit</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <div className="space-y-1 md:col-span-2">
             <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Building Wing</label>
             <select 
               className="w-full px-3 py-2 text-sm rounded-[4px]" 
               style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
               value={buildingId}
               onChange={(e) => setBuildingId(e.target.value)}
               required
             >
               <option value="" disabled>Select a building</option>
               {buildings.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
             </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input id="u-flat" label="Flat Number" placeholder="e.g. 101" value={flatNumber} onChange={(e) => setFlatNumber(e.target.value)} required />
            <Input id="u-floor" type="number" label="Floor" placeholder="e.g. 1" value={floor} onChange={(e) => setFloor(e.target.value)} required />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Unit Type</label>
               <select 
                 className="w-full px-3 py-2 text-sm rounded-[4px]" 
                 style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
                 value={type}
                 onChange={(e) => setType(e.target.value)}
               >
                 <option value="BHK1">1 BHK</option>
                 <option value="BHK2">2 BHK</option>
                 <option value="BHK3">3 BHK</option>
                 <option value="BHK4">4 BHK</option>
                 <option value="PENTHOUSE">Penthouse</option>
                 <option value="VILLA">Villa</option>
               </select>
            </div>
            <Input id="u-sqft" type="number" label="Square Feet" placeholder="e.g. 1200" value={sqft} onChange={(e) => setSqft(e.target.value)} required />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-6" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="mt-4 md:mt-0">Register Unit</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
