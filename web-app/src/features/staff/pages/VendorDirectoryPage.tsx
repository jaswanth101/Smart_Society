import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Plus, Phone, FileText, Ban } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// VendorDirectoryPage — Tesla-inspired vendor management
// ─────────────────────────────────────────────────────────

type Vendor = {
  id: string; company: string; category: string; contact: string; phone: string
  contractEnd: string; status: 'ACTIVE' | 'EXPIRED' | 'BLACKLISTED'; monthlyValue: number
}

const MOCK_VENDORS: Vendor[] = [
  { id: 'v1', company: 'Otis India Pvt Ltd', category: 'Lift AMC', contact: 'Suresh M', phone: '+91 98701 23456', contractEnd: 'Dec 2026', status: 'ACTIVE', monthlyValue: 40000 },
  { id: 'v2', company: 'SwachBharat Cleaning', category: 'Housekeeping', contact: 'Rekha D', phone: '+91 87612 34567', contractEnd: 'Jun 2026', status: 'ACTIVE', monthlyValue: 120000 },
  { id: 'v3', company: 'GreenScape Co.', category: 'Landscaping', contact: 'Prakash J', phone: '+91 76523 45678', contractEnd: 'Mar 2026', status: 'EXPIRED', monthlyValue: 35000 },
  { id: 'v4', company: 'SecureGuard Services', category: 'Security', contact: 'Ajay S', phone: '+91 65434 56789', contractEnd: 'Sep 2026', status: 'ACTIVE', monthlyValue: 180000 },
  { id: 'v5', company: 'QuickFix Plumbing', category: 'Plumbing', contact: 'Ravi K', phone: '+91 54345 67890', contractEnd: '—', status: 'BLACKLISTED', monthlyValue: 0 },
]

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { ACTIVE: 'success', EXPIRED: 'warning', BLACKLISTED: 'danger' }

export default function VendorDirectoryPage() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_VENDORS.filter(v => v.company.toLowerCase().includes(search.toLowerCase()) || v.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Vendor directory</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Approved vendors, AMC contracts, and purchase orders.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> Add vendor
        </button>
      </div>

      <Card noPadding>
        <div className="p-4" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input type="text" placeholder="Search vendor..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['Company', 'Category', 'Contact', 'Phone', 'Contract end', 'Monthly value', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(v => (
                <tr key={v.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{v.company}</td>
                  <td className="px-4 py-3"><Badge variant="neutral">{v.category}</Badge></td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{v.contact}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{v.phone}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: v.status === 'EXPIRED' ? 'var(--color-danger)' : 'var(--color-body)' }}>{v.contractEnd}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{v.monthlyValue > 0 ? `₹${v.monthlyValue.toLocaleString()}` : '—'}</td>
                  <td className="px-4 py-3"><Badge variant={STATUS_MAP[v.status]}>{v.status.toLowerCase()}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
