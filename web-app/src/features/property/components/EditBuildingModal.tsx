import { useState, useEffect } from 'react'
import { Building2, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api'

interface EditBuildingModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
  building: { id: string; name: string } | null
}

export function EditBuildingModal({ isOpen, onClose, onSuccess, building }: EditBuildingModalProps) {
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (building) {
      setName(building.name)
    }
  }, [building])

  if (!isOpen || !building) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post(`/property/buildings/${building.id}`, { name })
      onSuccess()
      onClose()
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update building.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-[12px] w-full max-w-md shadow-[0_20px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--color-cloud)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[4px]" style={{ background: 'var(--color-light-ash)', color: 'var(--color-heading)' }}>
              <Building2 size={20} />
            </div>
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Rename Building</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <Input 
            id="edit-bldg" 
            label="Building / Wing Name" 
            placeholder="e.g. Tower A" 
            value={name} 
            onChange={(e) => setName(e.target.value)} 
            required 
            autoFocus 
          />

          <div className="pt-4 flex justify-end gap-3 border-t mt-6" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading}>Save Changes</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
