import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Search, Download, AlertTriangle, Phone } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// DefaulterListPage — Tesla-inspired defaulter dashboard
// ─────────────────────────────────────────────────────────

type Defaulter = { id: string; flatNo: string; owner: string; phone: string; totalDue: number; monthsOverdue: number; lastReminder: string }

const MOCK_DEFAULTERS: Defaulter[] = [
  { id: 'd1', flatNo: 'A-201', owner: 'Priya Sharma', phone: '+91 87654 32109', totalDue: 13500, monthsOverdue: 3, lastReminder: '2 days ago' },
  { id: 'd2', flatNo: 'C-102', owner: 'David D', phone: '+91 65432 10987', totalDue: 9000, monthsOverdue: 2, lastReminder: '1 week ago' },
  { id: 'd3', flatNo: 'B-504', owner: 'Meera Patel', phone: '+91 54321 09876', totalDue: 4500, monthsOverdue: 1, lastReminder: '3 days ago' },
  { id: 'd4', flatNo: 'A-403', owner: 'Suresh Reddy', phone: '+91 43210 98765', totalDue: 31500, monthsOverdue: 7, lastReminder: '2 weeks ago' },
  { id: 'd5', flatNo: 'C-301', owner: 'Kavitha N', phone: '+91 32109 87654', totalDue: 18000, monthsOverdue: 4, lastReminder: '5 days ago' },
]

export default function DefaulterListPage() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_DEFAULTERS.filter(d =>
    d.flatNo.toLowerCase().includes(search.toLowerCase()) || d.owner.toLowerCase().includes(search.toLowerCase())
  )
  const totalOutstanding = MOCK_DEFAULTERS.reduce((sum, d) => sum + d.totalDue, 0)

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
        {[
          { label: 'Total defaulters', value: MOCK_DEFAULTERS.length.toString() },
          { label: 'Total outstanding', value: `₹${(totalOutstanding / 100000).toFixed(1)}L` },
          { label: 'Avg. overdue months', value: (MOCK_DEFAULTERS.reduce((s, d) => s + d.monthsOverdue, 0) / MOCK_DEFAULTERS.length).toFixed(1) },
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
            <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input type="text" placeholder="Search flat or owner..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['Flat', 'Owner', 'Phone', 'Total due', 'Months overdue', 'Last reminder', 'Action'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(d => (
                <tr key={d.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4]" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{d.flatNo}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-heading)' }}>{d.owner}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{d.phone}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-danger)' }}>₹{d.totalDue.toLocaleString()}</td>
                  <td className="px-4 py-3">
                    <Badge variant={d.monthsOverdue >= 3 ? 'danger' : d.monthsOverdue >= 2 ? 'warning' : 'neutral'}>
                      {d.monthsOverdue} {d.monthsOverdue === 1 ? 'month' : 'months'}
                    </Badge>
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-placeholder)' }}>{d.lastReminder}</td>
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
