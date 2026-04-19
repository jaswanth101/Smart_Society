import { useState, useEffect } from 'react'
import { UserPlus, X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import { apiClient } from '@/lib/api'
import { useAuthStore } from '@/store/authStore'
import { UserRole } from '@/types'

interface AddVisitorModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function AddVisitorModal({ isOpen, onClose, onSuccess }: AddVisitorModalProps) {
  const user = useAuthStore(s => s.user)
  const [name, setName] = useState('')
  const [purpose, setPurpose] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicleNo, setVehicleNo] = useState('')
  const [hostUnitId, setHostUnitId] = useState('')
  const [units, setUnits] = useState<any[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isAdmin = [UserRole.SUPER_ADMIN, UserRole.PRESIDENT, UserRole.SECRETARY, UserRole.SECURITY_GUARD].includes(user?.role as UserRole)

  // Fetch units for admins/guards to select from, residents auto-fill
  useEffect(() => {
    if (!isOpen) return

    if (isAdmin) {
      apiClient.get('/property/units').then(res => {
        setUnits(res.data)
      }).catch(() => {})
    } else if (user?.unitId) {
      setHostUnitId(user.unitId)
    }
  }, [isOpen, isAdmin, user?.unitId])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    if (!hostUnitId) {
      setError('Please select the host flat/unit.')
      setLoading(false)
      return
    }

    try {
      await apiClient.post('/visitors', {
        name,
        purpose,
        phone: phone || undefined,
        vehicleNo: vehicleNo || undefined,
        hostUnitId,
        scheduledAt: new Date().toISOString()
      })
      onSuccess()
      onClose()
      setName('')
      setPurpose('')
      setPhone('')
      setVehicleNo('')
      setHostUnitId(isAdmin ? '' : (user?.unitId || ''))
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate gate pass.')
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
            <h2 className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>Pre-Approve Guest</h2>
          </div>
          <button onClick={onClose} className="p-2 transition-colors hover:bg-gray-100 rounded-full">
            <X size={20} style={{ color: 'var(--color-placeholder)' }} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && <div className="p-3 bg-red-50 text-red-600 text-sm rounded-[4px]">{error}</div>}

          <Input
            id="v-name"
            label="Visitor Name"
            placeholder="e.g. Amazon Delivery / Relative Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <div className="space-y-1">
            <label htmlFor="v-purp" className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Purpose of Visit</label>
            <input
              id="v-purp"
              type="text"
              required
              placeholder="e.g. Swiggy Food Delivery"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-[4px] transition-all duration-[330ms] focus:outline-none focus:ring-2 focus:ring-[#3E6AE1]/20 focus:border-[#3E6AE1] bg-white"
              style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
            />
          </div>

          {/* Admin/Guard: select the host unit. Resident: auto-filled, hidden. */}
          {isAdmin ? (
            <div className="space-y-1">
              <label className="block text-xs font-medium" style={{ color: 'var(--color-heading)' }}>Destination Flat</label>
              <Select
                options={units.map(u => ({ value: u.id, label: `${u.flatNumber} — ${u.type}` }))}
                value={hostUnitId}
                onChange={setHostUnitId}
              />
            </div>
          ) : (
            <div className="p-3 rounded-[4px] bg-gray-50 border" style={{ borderColor: 'var(--color-cloud)' }}>
              <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>Visitor will be linked to <strong>your flat</strong> automatically.</p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <Input
              id="v-phone"
              label="Phone (Optional)"
              placeholder="9876543210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
            <Input
              id="v-vec"
              label="Vehicle No. (Optional)"
              placeholder="MH12AB1234"
              value={vehicleNo}
              onChange={(e) => setVehicleNo(e.target.value)}
            />
          </div>

          <div className="mt-2 p-3 rounded-[8px] bg-[#F7F9FF] border border-[#DEE6F9]">
            <p className="text-xs leading-relaxed text-[#3E6AE1]">
              <strong>Digital Gate Pass:</strong> A unique cryptographic pass code will be generated and forwarded to the Security Guard tablet for instant verification.
            </p>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t mt-6" style={{ borderColor: 'var(--color-cloud)' }}>
            <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
            <Button type="submit" variant="primary" loading={loading} className="mt-4 md:mt-0">Generate Pass</Button>
          </div>
        </form>
      </div>
    </div>
  )
}
