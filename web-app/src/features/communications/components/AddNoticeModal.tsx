import { useState } from 'react'
import { FileText, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { apiClient } from '@/lib/api'

interface AddNoticeModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddNoticeModal({ isOpen, onClose, onSuccess }: AddNoticeModalProps) {
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState('GENERAL')
  const [isPinned, setIsPinned] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/communications/notices', {
        title,
        content,
        category,
        isPinned
      })
      onSuccess()
      onClose()
      setTitle('')
      setContent('')
      setCategory('GENERAL')
      setIsPinned(false)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to publish notice. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-fade-in">
      <div className="bg-white rounded-[12px] w-full max-w-lg shadow-2xl overflow-hidden animate-slide-up">
        <div className="flex items-center justify-between p-6 border-b" style={{ borderColor: 'var(--color-cloud)' }}>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-[4px]" style={{ background: 'var(--color-light-ash)', color: 'var(--color-heading)' }}>
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Publish Notice</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <Input 
            id="n-headline" 
            label="Notice Headline" 
            placeholder="e.g. Swimming Pool Closure" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)} 
            required 
          />
          
          <div className="space-y-1">
             <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Message Content</label>
             <textarea 
                required
                rows={5}
                placeholder="Enter the detailed notice information here..."
                className="w-full p-3 border rounded-[4px] text-sm focus:outline-none transition-colors"
                style={{ 
                  borderColor: 'var(--color-cloud)', 
                  backgroundColor: 'transparent',
                  color: 'var(--color-heading)'
                }}
                onFocus={(e) => e.target.style.borderColor = 'var(--color-electric-blue)'}
                onBlur={(e) => e.target.style.borderColor = 'var(--color-cloud)'}
                value={content} 
                onChange={(e) => setContent(e.target.value)}
             />
          </div>

          <div className="grid grid-cols-2 gap-4 pt-2">
            <div className="space-y-1">
               <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Category</label>
               <Select 
                 options={[
                   { value: 'GENERAL', label: 'General Bulletin' },
                   { value: 'AGM', label: 'AGM Meeting' },
                   { value: 'MAINTENANCE', label: 'Maintenance' },
                   { value: 'AMENITY', label: 'Amenity Rule' },
                   { value: 'FINANCIAL', label: 'Financial / Billing' },
                   { value: 'EMERGENCY', label: 'Emergency Alert' },
                 ]}
                 value={category}
                 onChange={setCategory}
               />
            </div>
          </div>

          <div className="pt-4 flex items-center gap-2">
            <input 
              type="checkbox" 
              id="pin" 
              className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" 
              checked={isPinned} 
              onChange={(e) => setIsPinned(e.target.checked)} 
            />
            <label htmlFor="pin" className="text-sm cursor-pointer select-none" style={{ color: 'var(--color-heading)' }}>
              Pin to the top of the Notice Board
            </label>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-4" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="mt-4 md:mt-0">Publish Notice</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
