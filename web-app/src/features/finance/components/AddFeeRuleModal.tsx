import { useState } from 'react'
import { FileText, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { apiClient } from '@/lib/api'

interface AddFeeRuleModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddFeeRuleModal({ isOpen, onClose, onSuccess }: AddFeeRuleModalProps) {
  const [unitType, setUnitType] = useState('BHK2')
  const [baseAmount, setBaseAmount] = useState('')
  const [lateFeePercent, setLateFeePercent] = useState('5')
  const [dueDay, setDueDay] = useState('5')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/finance/rules', {
        unitType,
        baseAmount: parseFloat(baseAmount),
        lateFeePercent: parseFloat(lateFeePercent),
        dueDay: parseInt(dueDay, 10),
      })
      onSuccess()
      onClose()
      setBaseAmount('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create fee rule.')
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
              <FileText size={20} />
            </div>
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Add Fee Rule</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <div className="space-y-1">
             <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Unit Type Designation</label>
             <Select 
               options={[
                 { value: 'BHK1', label: '1 BHK' },
                 { value: 'BHK2', label: '2 BHK' },
                 { value: 'BHK3', label: '3 BHK' },
                 { value: 'PENTHOUSE', label: 'Penthouse' },
                 { value: 'SHOP', label: 'Commercial Shop' }
               ]}
               value={unitType}
               onChange={setUnitType}
             />
          </div>

          <Input id="f-base" type="number" label="Base Maintenance Amount (₹)" placeholder="e.g. 4500" value={baseAmount} onChange={(e) => setBaseAmount(e.target.value)} required />
          
          <div className="grid grid-cols-2 gap-4">
             <Input id="f-late" type="number" label="Late Fee Penalty (%)" placeholder="5" value={lateFeePercent} onChange={(e) => setLateFeePercent(e.target.value)} required />
             <Input id="f-due" type="number" label="Due Day of Month" placeholder="5" value={dueDay} onChange={(e) => setDueDay(e.target.value)} required />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-6" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="mt-4 md:mt-0">Create Ledger Rule</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
