import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Plus, Upload, Receipt, Search } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { AddExpenseModal } from '../components/AddExpenseModal'

// ─────────────────────────────────────────────────────────
// ExpenseTrackingPage — Enterprise Live Expense Manager
// ─────────────────────────────────────────────────────────

type Expense = { 
  id: string; title: string; category: string; amount: number; 
  vendorName: string; createdAt: string; status: 'APPROVED' | 'PENDING' | 'REJECTED'; 
  receiptUrl: string | null 
}

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { APPROVED: 'success', PENDING: 'warning', REJECTED: 'danger' }

export default function ExpenseTrackingPage() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [isAddOpen, setIsAddOpen] = useState(false)

  const fetchExpenses = async () => {
    try {
      const { data } = await apiClient.get('/finance/expenses')
      setExpenses(data)
    } catch (err) {
      console.error('Failed to load expenses', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchExpenses()
  }, [])

  const filtered = expenses.filter(e => 
    e.title.toLowerCase().includes(search.toLowerCase()) || 
    e.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Expense tracking</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Upload bills, categorize spending, and track approval status.</p>
        </div>
        <button 
          onClick={() => setIsAddOpen(true)}
          className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
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
              {loading ? (
                <tr><td colSpan={8} className="py-8 text-center text-slate-500">Loading ledger...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="py-8 text-center text-slate-500">No expenses recorded.</td></tr>
              ) : filtered.map(e => (
                <tr key={e.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-placeholder)' }}>{e.id.substring(0, 8)}</td>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{e.title}</td>
                  <td className="px-4 py-3"><Badge variant="neutral">{e.category}</Badge></td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-tertiary)' }}>{e.vendorName || '--'}</td>
                  <td className="px-4 py-3 font-medium text-red-500">₹{e.amount.toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{new Date(e.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {e.receiptUrl
                      ? <Receipt size={14} style={{ color: 'var(--color-success)' }} />
                      : <Upload size={14} style={{ color: 'var(--color-placeholder)' }} />
                    }
                  </td>
                  <td className="px-4 py-3"><Badge variant={STATUS_MAP[e.status] || 'neutral'}>{e.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <AddExpenseModal 
        isOpen={isAddOpen} 
        onClose={() => setIsAddOpen(false)} 
        onSuccess={() => {
          setLoading(true);
          // Manually call fetch using apiClient since we extracted fetchExpenses outside initially or just reload
          apiClient.get('/finance/expenses').then(res => {
             setExpenses(res.data)
             setLoading(false)
          })
        }} 
      />
    </DashboardLayout>
  )
}
