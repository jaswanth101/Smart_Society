import { useState } from 'react'
import { Building2, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api'

interface AddBuildingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddBuildingModal({ isOpen, onClose, onSuccess }: AddBuildingModalProps) {
  const [name, setName] = useState('')
  const [floors, setFloors] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/property/buildings', {
        name,
        floors: parseInt(floors, 10)
      })
      onSuccess() // Refresh layout
      onClose()
      setName('')
      setFloors('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create building')
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
              <Building2 size={20} />
            </div>
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Add New Building</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <Input 
            id="bldg-name"
            label="Building Name / Designation"
            placeholder="e.g. Tower B, Block 4, Villa 12"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required 
          />
          
          <Input 
            id="bldg-floors"
            type="number"
            label="Total Floors"
            placeholder="e.g. 15"
            value={floors}
            onChange={(e) => setFloors(e.target.value)}
            required 
          />

          <div className="pt-2 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading}>Construct Building</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
