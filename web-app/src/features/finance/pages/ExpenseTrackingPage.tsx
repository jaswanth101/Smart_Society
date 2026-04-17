import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Plus, Upload, Receipt, Search } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ExpenseTrackingPage — Tesla-inspired expense manager
// ─────────────────────────────────────────────────────────

type Expense = { id: string; title: string; category: string; amount: number; vendor: string; date: string; status: 'APPROVED' | 'PENDING' | 'REJECTED'; receipt: boolean }

const MOCK_EXPENSES: Expense[] = [
  { id: 'E-001', title: 'Lift AMC — Q1 2026', category: 'Maintenance', amount: 120000, vendor: 'Otis India', date: 'Apr 10', status: 'APPROVED', receipt: true },
  { id: 'E-002', title: 'Garden landscaping', category: 'Landscaping', amount: 35000, vendor: 'GreenScape Co.', date: 'Apr 8', status: 'APPROVED', receipt: true },
  { id: 'E-003', title: 'CCTV camera replacement x4', category: 'Security', amount: 48000, vendor: 'Hikvision Dealer', date: 'Apr 5', status: 'PENDING', receipt: false },
  { id: 'E-004', title: 'Staff uniforms — batch 2', category: 'Staff', amount: 18500, vendor: 'UniformWorks', date: 'Apr 1', status: 'PENDING', receipt: true },
  { id: 'E-005', title: 'Water tanker — emergency refill', category: 'Utilities', amount: 8000, vendor: 'AquaSupply', date: 'Mar 28', status: 'APPROVED', receipt: true },
]

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { APPROVED: 'success', PENDING: 'warning', REJECTED: 'danger' }

export default function ExpenseTrackingPage() {
  const [search, setSearch] = useState('')
  const filtered = MOCK_EXPENSES.filter(e => e.title.toLowerCase().includes(search.toLowerCase()) || e.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Expense tracking</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Upload bills, categorize spending, and track approval status.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> Log expense
        </button>
      </div>

      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative flex-1 max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input type="text" placeholder="Search expense..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['ID', 'Description', 'Category', 'Vendor', 'Amount', 'Date', 'Receipt', 'Status'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(e => (
                <tr key={e.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-placeholder)' }}>{e.id}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{e.title}</td>
                  <td className="px-4 py-3"><Badge variant="neutral">{e.category}</Badge></td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-tertiary)' }}>{e.vendor}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>₹{e.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{e.date}</td>
                  <td className="px-4 py-3">
                    {e.receipt
                      ? <Receipt size={14} style={{ color: 'var(--color-success)' }} />
                      : <Upload size={14} style={{ color: 'var(--color-placeholder)' }} />
                    }
                  </td>
                  <td className="px-4 py-3"><Badge variant={STATUS_MAP[e.status]}>{e.status.toLowerCase()}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
