import { useState } from 'react'
import { FileText, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { apiClient } from '@/lib/api'

interface AddExpenseModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddExpenseModal({ isOpen, onClose, onSuccess }: AddExpenseModalProps) {
  const [title, setTitle] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Maintenance')
  const [vendorName, setVendorName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiClient.post('/finance/expenses', {
        title,
        amount: parseFloat(amount),
        category,
        vendorName,
        status: 'PENDING'
      })
      onSuccess()
      onClose()
      setTitle('')
      setAmount('')
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to log expense.')
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
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Log Expense</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}
          
          <Input id="e-title" type="text" label="Expense Description" placeholder="e.g. Lift AMC Q1" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <Input id="e-amount" type="number" label="Amount (₹)" placeholder="45000" value={amount} onChange={(e) => setAmount(e.target.value)} required />
          <Input id="e-vendor" type="text" label="Vendor Name" placeholder="Otis India (Optional)" value={vendorName} onChange={(e) => setVendorName(e.target.value)} />

          <div className="space-y-1">
             <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Category</label>
             <Select 
               options={[
                 { value: 'Maintenance', label: 'Maintenance' },
                 { value: 'Security', label: 'Security' },
                 { value: 'Utility', label: 'Utility Bill' },
                 { value: 'Staff', label: 'Staff & Wages' },
                 { value: 'Other', label: 'Other' }
               ]}
               value={category}
               onChange={setCategory}
             />
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-6" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="mt-4 md:mt-0">Submit to Ledger</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
