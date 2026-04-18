import { useState } from 'react'
import { Headset, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { apiClient } from '@/lib/api'

interface AddComplaintModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddComplaintModal({ isOpen, onClose, onSuccess }: AddComplaintModalProps) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('Maintenance')
  const [priority, setPriority] = useState('MEDIUM')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/complaints', {
        title,
        description,
        category,
        priority
      })
      onSuccess()
      onClose()
      setTitle('')
      setDescription('')
      setCategory('Maintenance')
      setPriority('MEDIUM')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to raise ticket.')
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
              <Headset size={20} />
            </div>
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Raise New Ticket</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <Input 
            id="c-title" 
            label="Issue Title" 
            placeholder="e.g. Water leaking in parking lot" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
               <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Category</label>
               <Select 
                 options={[
                   { value: 'Plumbing', label: 'Plumbing' },
                   { value: 'Electrical', label: 'Electrical' },
                   { value: 'Housekeeping', label: 'Housekeeping' },
                   { value: 'Security', label: 'Security' },
                   { value: 'Maintenance', label: 'Gen. Maintenance' },
                 ]}
                 value={category}
                 onChange={setCategory}
               />
            </div>
            
            <div className="space-y-1">
               <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Priority</label>
               <Select 
                 options={[
                   { value: 'LOW', label: 'Low' },
                   { value: 'MEDIUM', label: 'Medium' },
                   { value: 'HIGH', label: 'High' },
                   { value: 'CRITICAL', label: 'Critical' },
                 ]}
                 value={priority}
                 onChange={setPriority}
               />
            </div>
          </div>
          
          <div className="space-y-1">
             <label htmlFor="c-desc" className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Description</label>
             <textarea 
               id="c-desc"
               required
               rows={4}
               className="w-full px-3 py-2 text-sm rounded-[4px] transition-all duration-[330ms] focus:outline-none focus:ring-2 focus:ring-[#3E6AE1]/20 focus:border-[#3E6AE1] bg-white resize-none"
               style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
               placeholder="Please describe the issue in detail..."
               value={description}
               onChange={(e) => setDescription(e.target.value)}
             />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-6" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="mt-4 md:mt-0">Submit Ticket</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
