import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Plus, Building2, Users, Wifi, WifiOff } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiClient } from '@/lib/api'
import { OnboardSocietyModal } from '../components/OnboardSocietyModal'

// ─────────────────────────────────────────────────────────
// PlatformSocietiesPage — Super Admin society list
// ─────────────────────────────────────────────────────────

type Society = { id: string; name: string; city: string; units: number; plan: 'STANDARD' | 'PREMIUM'; edgeStatus: 'ONLINE' | 'OFFLINE'; activeUsers: number; createdAt: string }

const MOCK: Society[] = [
  { id: 's1', name: 'Alpha Society', city: 'Bangalore', units: 486, plan: 'PREMIUM', edgeStatus: 'ONLINE', activeUsers: 412, createdAt: 'Jan 2024' },
  { id: 's2', name: 'Green Meadows', city: 'Mumbai', units: 320, plan: 'STANDARD', edgeStatus: 'ONLINE', activeUsers: 285, createdAt: 'Mar 2024' },
  { id: 's3', name: 'Sunrise Township', city: 'Hyderabad', units: 1200, plan: 'PREMIUM', edgeStatus: 'OFFLINE', activeUsers: 980, createdAt: 'Jun 2024' },
  { id: 's4', name: 'Lake View Residency', city: 'Pune', units: 180, plan: 'STANDARD', edgeStatus: 'ONLINE', activeUsers: 156, createdAt: 'Sep 2024' },
]

export default function PlatformSocietiesPage() {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [societies, setSocieties] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [analytics, setAnalytics] = useState<any>({ mrr: 0, activeSocieties: 0, totalResidents: 0, edgeServersOnline: 0, edgeServersTotal: 0 })

  const fetchData = async () => {
    try {
      setLoading(true)
      const [tenantsRes, statsRes] = await Promise.all([
        apiClient.get('/tenants'),
        apiClient.get('/tenants/analytics')
      ])
      setSocieties(tenantsRes.data)
      setAnalytics(statsRes.data)
    } catch (error) {
      console.error('Failed to fetch societies', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const filtered = societies.filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.city.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Societies</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>All onboarded societies across the platform.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> Onboard society
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total societies', value: societies.length.toString() }, 
          { label: 'Total residents', value: analytics.totalResidents.toLocaleString() }, 
          { label: 'MRR', value: `₹${analytics.mrr.toLocaleString()}` }, 
          { label: 'Edge servers', value: `${analytics.edgeServersOnline}/${analytics.edgeServersTotal}` }
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
            <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <Card noPadding>
        <div className="p-4" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input type="text" placeholder="Search society..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
              {['Society', 'City', 'Units', 'Active users', 'Plan', 'Edge server', 'Since'].map(h => (
                <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="text-center py-8 text-sm text-slate-500">Loading societies...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className="text-center py-8 text-sm text-slate-500">No societies found.</td></tr>
              ) : (
                filtered.map(s => (
                  <tr key={s.id} onClick={() => navigate(`/${s.slug}/admin/dashboard`)} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                    <td className="px-4 py-3"><div className="flex items-center gap-2"><Building2 size={16} style={{ color: 'var(--color-electric-blue)' }} /><span className="font-medium" style={{ color: 'var(--color-heading)' }}>{s.name}</span></div></td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{s.city}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{s.totalUnits}</td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-heading)' }}>-</td>
                    <td className="px-4 py-3"><Badge variant={s.subscriptionTier === 'PREMIUM' ? 'info' : 'neutral'}>{s.subscriptionTier.toLowerCase()}</Badge></td>
                    <td className="px-4 py-3">
                      <span className="flex items-center gap-1.5 text-xs font-medium" style={{ color: 'var(--color-success)' }}>
                        <Wifi size={12} /> online
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-placeholder)' }}>{new Date(s.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      {showModal && (
        <OnboardSocietyModal 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchData() 
          }}
        />
      )}
    </DashboardLayout>
  )
}
