import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Plus, Phone, FileText, Ban, MoreVertical } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { AddVendorModal } from '../components/AddVendorModal'

// ─────────────────────────────────────────────────────────
// VendorDirectoryPage — Tesla-inspired vendor management
// ─────────────────────────────────────────────────────────

type Vendor = {
  id: string; companyName: string; category: string; contactPerson: string; phone: string
  contractEnd?: string; status: 'ACTIVE' | 'INACTIVE'; monthlyValue?: number
}

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { ACTIVE: 'success', INACTIVE: 'danger' }

export default function VendorDirectoryPage() {
  const [search, setSearch] = useState('')
  const [vendors, setVendors] = useState<Vendor[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const fetchVendors = async () => {
    setLoading(true)
    try {
      const { data } = await apiClient.get('/staff/vendors')
      setVendors(data)
    } catch (err) {
      console.error('Failed to load vendors', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVendors()
  }, [])

  const filtered = vendors.filter(v => v.companyName?.toLowerCase().includes(search.toLowerCase()) || v.category?.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Vendor directory</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Approved vendors, AMC contracts, and purchase orders.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
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

        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  {['Company', 'Category', 'Contact', 'Phone', 'Monthly value', 'Status', 'Action'].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs uppercase tracking-wide" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                      <td colSpan={7} className="px-4 py-4">
                        <div className="h-4 bg-gray-200 rounded-[4px] animate-pulse w-full"></div>
                      </td>
                    </tr>
                  ))
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No vendors registered.</td></tr>
                ) : filtered.map(v => (
                  <tr key={v.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{v.companyName}</td>
                    <td className="px-4 py-3"><Badge variant="neutral">{v.category}</Badge></td>
                    <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{v.contactPerson}</td>
                    <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{v.phone}</td>
                    <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{v.monthlyValue ? `₹${v.monthlyValue?.toLocaleString()}` : '—'}</td>
                    <td className="px-4 py-3"><Badge variant={STATUS_MAP[v.status] || 'neutral'}>{v.status.toLowerCase()}</Badge></td>
                    <td className="px-4 py-3"><button className="p-1 transition-colors hover:bg-white rounded" style={{ color: 'var(--color-placeholder)' }}><MoreVertical size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
             {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="border p-4 rounded-[8px] bg-white flex flex-col gap-3 animate-pulse" style={{ borderColor: 'var(--color-cloud)' }}>
                    <div className="h-4 bg-gray-200 rounded-[4px] w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded-[4px] w-1/2"></div>
                  </div>
                ))
             ) : filtered.length === 0 ? (
                <div className="py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No vendors found.</div>
             ) : (
                filtered.map((v: object | any) => (
                  <div key={v.id} className="border p-4 rounded-[8px] bg-white flex flex-col gap-3" style={{ borderColor: 'var(--color-cloud)' }}>
                    <div className="flex justify-between items-start gap-2">
                       <div>
                         <p className="font-semibold text-sm" style={{ color: 'var(--color-heading)' }}>{v.companyName}</p>
                         <p className="text-xs font-medium mt-0.5" style={{ color: 'var(--color-tertiary)' }}>{v.category}</p>
                       </div>
                       <Badge variant={STATUS_MAP[v.status] || 'neutral'} dot>{v.status.toLowerCase()}</Badge>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2 mt-2 pt-3 border-t" style={{ borderColor: 'var(--color-cloud)' }}>
                       <div>
                          <p className="text-[11px] uppercase tracking-wide font-semibold mb-1" style={{ color: 'var(--color-placeholder)' }}>Contact Person</p>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{v.contactPerson}</p>
                          <p className="text-xs mt-0.5" style={{ color: 'var(--color-tertiary)' }}>{v.phone}</p>
                       </div>
                       <div>
                          <p className="text-[11px] uppercase tracking-wide font-semibold mb-1" style={{ color: 'var(--color-placeholder)' }}>Monthly Value</p>
                          <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{v.monthlyValue ? `₹${v.monthlyValue.toLocaleString()}` : '—'}</p>
                       </div>
                    </div>
                  </div>
                ))
             )}
          </div>
        </div>
      </Card>
      
      {/* Modals */}
      <AddVendorModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSuccess={fetchVendors} 
      />
    </DashboardLayout>
  )
}
