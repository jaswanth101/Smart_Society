import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/data-display/StatCard'
import { Users, Building2, Cpu, TrendingUp, PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { apiClient } from '@/lib/api'
import { OnboardSocietyModal } from '../components/OnboardSocietyModal'

// ─────────────────────────────────────────────────────────
// PlatformDashboard — Super Admin bird's-eye view.
// Shows MRR, total societies, Edge Pi health across all tenants.
// Role access: Super Admin only.
// ─────────────────────────────────────────────────────────

const TIER_COLOR: Record<string, 'neutral'|'info'|'success'|'warning'> = {
  BASIC: 'neutral', STANDARD: 'info', PREMIUM: 'success', ENTERPRISE: 'warning',
}

export default function PlatformDashboard() {
  const navigate = useNavigate();
  const [societies, setSocieties] = useState<any[]>([])
  const [analytics, setAnalytics] = useState<any>({ mrr: 0, activeSocieties: 0, totalResidents: 0, edgeServersOnline: 0, edgeServersTotal: 0 })
  const [showModal, setShowModal] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchData = async () => {
    try {
      setLoading(true)
      // Run both API calls in parallel
      const [tenantsRes, statsRes] = await Promise.all([
        apiClient.get('/tenants'),
        apiClient.get('/tenants/analytics')
      ])
      setSocieties(tenantsRes.data)
      setAnalytics(statsRes.data)
    } catch (error) {
      console.error('Failed to load dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Platform Dashboard</h1>
          <p className="text-sm text-slate-500">SmartSociety 360 — Super Admin Control Plane</p>
        </div>
        <Button onClick={() => setShowModal(true)} icon={<PlusCircle size={15} />}>Onboard Society</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Monthly Recurring Revenue" value={`₹${analytics.mrr.toLocaleString()}`}  icon={<TrendingUp size={20} />} iconColor="#10b981" />
        <StatCard title="Active Societies"          value={societies.length.toString()} icon={<Building2 size={20} />}  iconColor="#3b82f6" />
        <StatCard title="Total Residents"           value={analytics.totalResidents.toLocaleString()} icon={<Users size={20} />}      iconColor="#8b5cf6" />
        <StatCard title="Edge Servers Online"       value={`${analytics.edgeServersOnline}/${analytics.edgeServersTotal}`}  icon={<Cpu size={20} />} iconColor="#06b6d4" />
      </div>

      <Card title="All Societies" subtitle="Click a row to manage that society">
        <div className="table-wrapper">
          {loading ? (
            <div className="animate-pulse">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {['Society', 'City', 'Units', 'Tier', 'Edge Pi', 'Status', 'Actions'].map((h) => (
                      <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i}>
                      <td className="py-4 px-2"><div className="h-4 bg-slate-200 rounded w-32"></div></td>
                      <td className="py-4 px-2"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                      <td className="py-4 px-2"><div className="h-4 bg-slate-200 rounded w-12"></div></td>
                      <td className="py-4 px-2"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                      <td className="py-4 px-2"><div className="h-4 bg-slate-200 rounded w-16"></div></td>
                      <td className="py-4 px-2"><div className="h-6 bg-slate-200 rounded-full w-20"></div></td>
                      <td className="py-4 px-2"><div className="h-4 bg-slate-200 rounded w-24"></div></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Society', 'City', 'Units', 'Tier', 'Edge Pi', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {societies.length === 0 ? (
                  <tr>
                    <td colSpan={7}>
                      <div className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4 border border-slate-100">
                          <Building2 size={24} className="text-slate-400" />
                        </div>
                        <h3 className="text-sm font-semibold text-slate-900\">No societies deployed yet</h3>
                        <p className="text-sm text-slate-500 mt-1 max-w-sm mx-auto mb-4">
                          Your platform infrastructure is running perfectly, but you haven't onboarded any clients to the SaaS yet.
                        </p>
                        <Button variant="secondary" onClick={() => setShowModal(true)}>Onboard First Society</Button>
                      </div>
                    </td>
                  </tr>
                ) : (
                  societies.map((s) => (
                    <tr key={s.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                      <td className="py-3 px-2 font-medium text-slate-800">{s.name}</td>
                      <td className="py-3 px-2 text-slate-500">{s.city}</td>
                      <td className="py-3 px-2 text-slate-600">{s.totalUnits}</td>
                      <td className="py-3 px-2"><Badge variant={TIER_COLOR[s.subscriptionTier]}>{s.subscriptionTier}</Badge></td>
                      <td className="py-3 px-2">
                        <span className="flex items-center gap-1.5 text-xs font-medium text-emerald-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          online
                        </span>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant={s.isActive ? 'success' : 'danger'} dot>{s.isActive ? 'ACTIVE' : 'INACTIVE'}</Badge>
                      </td>
                      <td className="py-3 px-2">
                        <div className="flex gap-2">
                          <button onClick={() => navigate(`/${s.slug}/admin/dashboard`)} className="text-xs text-blue-600 hover:underline">Manage</button>
                          <button onClick={() => alert('Microservice modular toggles coming in v2!')} className="text-xs text-slate-400 hover:underline">Modules</button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </Card>

      {/* Render the Onboard Modal */}
      {showModal && (
        <OnboardSocietyModal 
          onClose={() => setShowModal(false)}
          onSuccess={() => {
            setShowModal(false)
            fetchData() // Auto-refresh the live table and stats
          }}
        />
      )}
    </DashboardLayout>
  )
}
