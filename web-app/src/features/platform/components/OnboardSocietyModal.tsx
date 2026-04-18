import { useState } from 'react'
import { X } from 'lucide-react'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiClient } from '@/lib/api'

interface OnboardSocietyModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function OnboardSocietyModal({ onClose, onSuccess }: OnboardSocietyModalProps) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    totalUnits: '',
    subscriptionTier: 'STANDARD',
    subscriptionPrice: '',
    adminName: '',
    adminEmail: '',
    adminPhone: '',
  })
  const [successData, setSuccessData] = useState<{ email: string, generatedPassword: string } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const generatedSlug = formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')

      const response = await apiClient.post('/tenants', {
        name: formData.name,
        slug: generatedSlug,
        address: formData.address,
        city: formData.city,
        totalUnits: parseInt(formData.totalUnits) || 0,
        subscriptionTier: formData.subscriptionTier,
        subscriptionPrice: parseFloat(formData.subscriptionPrice) || 0,
        adminName: formData.adminName,
        adminEmail: formData.adminEmail,
        adminPhone: formData.adminPhone,
      })
      
      // Flip to Success State instead of closing immediately
      setSuccessData({
        email: formData.adminEmail,
        generatedPassword: response.data.generatedPassword
      })
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(Array.isArray(err.response.data.message) ? err.response.data.message[0] : err.response.data.message)
      } else {
        setError('Failed to onboard society.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[8px] w-full max-w-md shadow-xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <h2 className="font-semibold text-slate-800">Onboard New Society</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X size={18} />
          </button>
        </div>
        
        {!successData ? (
          <form onSubmit={handleSubmit} className="p-5 space-y-4">
            <div className="space-y-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b pb-2">1. Society Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Society Name" placeholder="e.g. Valley Society" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <Input label="Address" placeholder="Main Road" required value={formData.address} onChange={(e) => setFormData({...formData, address: e.target.value})} />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <Input label="City" placeholder="e.g. Hyderabad" required value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
                <Input label="Total Units" type="number" placeholder="0" required value={formData.totalUnits} onChange={(e) => setFormData({...formData, totalUnits: e.target.value})} />
                <div className="space-y-1.5">
                  <label className="text-sm font-medium text-slate-700">Tier</label>
                  <select className="w-full h-11 px-3 border border-slate-200 rounded-[4px] text-sm focus:outline-none focus:border-blue-500" value={formData.subscriptionTier} onChange={(e) => setFormData({...formData, subscriptionTier: e.target.value})}>
                    <option value="BASIC">Basic</option>
                    <option value="STANDARD">Standard</option>
                    <option value="PREMIUM">Premium</option>
                    <option value="ENTERPRISE">Enterprise</option>
                  </select>
                </div>
              </div>
              <Input label="Monthly Pricing (MRR ₹)" type="number" placeholder="e.g. 15000" required value={formData.subscriptionPrice} onChange={(e) => setFormData({...formData, subscriptionPrice: e.target.value})} />
            </div>

            <div className="space-y-4 pt-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b pb-2">2. Handover Protocol (President Admin)</h3>
              <Input label="President Name" placeholder="e.g. Ravi Kumar" required value={formData.adminName} onChange={(e) => setFormData({...formData, adminName: e.target.value})} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="Admin Email" type="email" placeholder="admin@valley.com" required value={formData.adminEmail} onChange={(e) => setFormData({...formData, adminEmail: e.target.value})} />
                <Input label="Admin WhatsApp/Phone" placeholder="+919876543210" required value={formData.adminPhone} onChange={(e) => setFormData({...formData, adminPhone: e.target.value})} />
              </div>
            </div>

            {error && <div className="p-3 text-sm text-red-600 bg-red-50 rounded-[4px]">{error}</div>}

            <div className="pt-4 flex justify-end gap-3 mt-4 border-t border-slate-100">
              <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
              <Button type="submit" loading={loading}>Deploy & Provision</Button>
            </div>
          </form>
        ) : (
          <div className="p-6 text-center space-y-6">
            <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Society Provisioned!</h3>
              <p className="text-sm text-slate-500 mb-6">
                The database, Tower A, and President account have been successfully generated. 
                Please WhatsApp the following secure credentials to <b>{formData.adminName}</b>.
              </p>
            </div>
            
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 text-left space-y-3">
              <div>
                <label className="text-xs text-slate-400 uppercase font-semibold">Admin Login URL</label>
                <div className="text-sm font-medium text-blue-600 break-all">https://smartsociety360.com/login</div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-400 uppercase font-semibold">Email ID</label>
                  <div className="text-sm font-bold text-slate-800">{successData.email}</div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 uppercase font-semibold">Secure Password</label>
                  <div className="text-sm font-bold text-slate-800 bg-white border border-slate-200 px-2 py-1 rounded inline-block">
                    {successData.generatedPassword}
                  </div>
                </div>
              </div>
            </div>

            <Button className="w-full" onClick={() => onSuccess()}>Acknowledge & Close</Button>
          </div>
        )}
      </div>
    </div>
  )
}
