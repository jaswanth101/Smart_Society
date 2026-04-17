import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { StatCard } from '@/components/data-display/StatCard'
import { Users, Building2, Cpu, TrendingUp, PlusCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

// ─────────────────────────────────────────────────────────
// PlatformDashboard — Super Admin bird's-eye view.
// Shows MRR, total societies, Edge Pi health across all tenants.
// Role access: Super Admin only.
// ─────────────────────────────────────────────────────────
const MOCK_SOCIETIES = [
  { id: 'SOC001', name: 'Alpha Grande',    city: 'Hyderabad', units: 240, tier: 'PREMIUM',    status: 'ACTIVE',    piStatus: 'online' },
  { id: 'SOC002', name: 'Green Valley',    city: 'Pune',      units: 120, tier: 'STANDARD',   status: 'ACTIVE',    piStatus: 'online' },
  { id: 'SOC003', name: 'Prestige Towers', city: 'Bangalore', units: 480, tier: 'ENTERPRISE', status: 'ACTIVE',    piStatus: 'offline' },
  { id: 'SOC004', name: 'Sunrise Heights', city: 'Chennai',   units: 80,  tier: 'BASIC',      status: 'SUSPENDED', piStatus: 'offline' },
]

const TIER_COLOR: Record<string, 'neutral'|'info'|'success'|'warning'> = {
  BASIC: 'neutral', STANDARD: 'info', PREMIUM: 'success', ENTERPRISE: 'warning',
}

export default function PlatformDashboard() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Platform Dashboard</h1>
          <p className="text-sm text-slate-500">SmartSociety 360 — Super Admin Control Plane</p>
        </div>
        <Button icon={<PlusCircle size={15} />}>Onboard Society</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <StatCard title="Monthly Recurring Revenue" value="₹4.8L"  icon={<TrendingUp size={20} />} iconColor="#10b981" trend={12} />
        <StatCard title="Active Societies"          value="18"     icon={<Building2 size={20} />}  iconColor="#3b82f6" trend={3}  />
        <StatCard title="Total Residents"           value="12,480" icon={<Users size={20} />}      iconColor="#8b5cf6" trend={5}  />
        <StatCard title="Edge Servers Online"       value="15/18"  icon={<Cpu size={20} />}        iconColor="#06b6d4" description="3 offline" />
      </div>

      <Card title="All Societies" subtitle="Click a row to manage that society">
        <div className="table-wrapper">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100">
                {['Society', 'City', 'Units', 'Tier', 'Edge Pi', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {MOCK_SOCIETIES.map((s) => (
                <tr key={s.id} className="hover:bg-slate-50 transition-colors cursor-pointer">
                  <td className="py-3 px-2 font-medium text-slate-800">{s.name}</td>
                  <td className="py-3 px-2 text-slate-500">{s.city}</td>
                  <td className="py-3 px-2 text-slate-600">{s.units}</td>
                  <td className="py-3 px-2"><Badge variant={TIER_COLOR[s.tier]}>{s.tier}</Badge></td>
                  <td className="py-3 px-2">
                    <span className={`flex items-center gap-1.5 text-xs font-medium ${s.piStatus === 'online' ? 'text-emerald-600' : 'text-red-500'}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${s.piStatus === 'online' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                      {s.piStatus}
                    </span>
                  </td>
                  <td className="py-3 px-2">
                    <Badge variant={s.status === 'ACTIVE' ? 'success' : 'danger'} dot>{s.status}</Badge>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex gap-2">
                      <button className="text-xs text-blue-600 hover:underline">Manage</button>
                      <button className="text-xs text-slate-400 hover:underline">Modules</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
