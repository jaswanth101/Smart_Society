import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Download, AlertTriangle, Phone } from 'lucide-react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// DefaulterListPage — Tesla-inspired defaulter dashboard
// ─────────────────────────────────────────────────────────

export default function DefaulterListPage() {
  const [invoices, setInvoices] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const { data } = await apiClient.get('/finance/invoices')
        // Filter strictly for overdue defaults
        const overdue = data.filter((inv: any) => inv.status === 'OVERDUE')
        setInvoices(overdue)
      } catch (err) {
        console.error('Failed to fetch invoices', err)
      } finally {
        setLoading(false)
      }
    }
    fetchInvoices()
  }, [])

  const filtered = invoices.filter((d: any) =>
    (d.unit?.flatNumber || '').toLowerCase().includes(search.toLowerCase())
  )

  const totalOutstanding = invoices.reduce((sum, d) => sum + Number(d.amount), 0)

  // Calculate avg overdue time in rough months based on dueDate
  const avgMonths = invoices.length === 0 ? 0 : invoices.reduce((sum, d) => {
    const diffTime = Math.abs(new Date().getTime() - new Date(d.dueDate).getTime());
    const diffMonths = diffTime / (1000 * 60 * 60 * 24 * 30); 
    return sum + diffMonths;
  }, 0) / invoices.length;

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Defaulter list</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Residents with overdue maintenance payments.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-colors duration-[330ms]"
          style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}>
          <Download size={16} /> Export CSV
        </button>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-8">
        <div className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
          <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{loading ? '-' : invoices.length}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>Total defaulters</p>
        </div>
        <div className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
          <p className="text-2xl font-medium text-red-500">₹{loading ? '-' : totalOutstanding.toLocaleString()}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>Total outstanding</p>
        </div>
        <div className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
          <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{loading ? '-' : avgMonths.toFixed(1)}</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>Avg. overdue months</p>
        </div>
      </div>

      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input type="text" placeholder="Search flat... (e.g. A-304)" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['Flat', 'Month Billed', 'Total due', 'Due Date', 'Status', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">Scanning financial ledgers...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="py-8 text-center text-slate-500">No overdue invoices found! Clean ledger.</td></tr>
              ) : filtered.map((d: any) => (
                <tr key={d.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4]" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{d.unit?.flatNumber || 'Unknown Unit'}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{d.month} {d.year}</td>
                  <td className="px-4 py-3 font-medium text-red-500">₹{Number(d.amount).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm text-slate-600">{new Date(d.dueDate).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant="danger">OVERDUE</Badge>
                  </td>
                  <td className="px-4 py-3">
                    <button className="px-3 py-1.5 rounded-[4px] text-xs font-medium transition-colors duration-[330ms]"
                      style={{ background: 'var(--color-light-ash)', color: 'var(--color-heading)' }}>
                      Send reminder
                    </button>
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
