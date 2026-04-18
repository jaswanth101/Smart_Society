import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Plus, Edit2, Trash2, Loader2, Zap } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { AddFeeRuleModal } from '../components/AddFeeRuleModal'

// ─────────────────────────────────────────────────────────
// FeeStructurePage — Live Ledger Automation Config
// ─────────────────────────────────────────────────────────

export default function FeeStructurePage() {
  const [rules, setRules] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [generating, setGenerating] = useState(false)
  const [isAddRuleOpen, setIsAddRuleOpen] = useState(false)

  const fetchRules = async () => {
    try {
      setLoading(true)
      const res = await apiClient.get('/finance/rules')
      setRules(res.data)
    } catch (err) {
      console.error('Failed to fetch fee rules', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRules()
  }, [])

  const handleGenerateInvoices = async () => {
    if (!window.confirm("Are you sure you want to sweep the database and generate invoices for all physical units using these rules?")) return;
    
    try {
      setGenerating(true)
      const res = await apiClient.post('/finance/invoices/generate-batch')
      alert(res.data.message)
    } catch (err: any) {
      alert(err.response?.data?.message || 'Generation failed.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Fee Configurations</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Set the monetary rules driving the monthly automated invoice generation.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleGenerateInvoices}
            disabled={generating}
            className="px-4 py-2.5 rounded-[4px] text-sm font-medium transition-colors flex items-center gap-1.5" 
            style={{ border: '1px solid var(--color-electric-blue)', color: 'var(--color-electric-blue)' }}
          >
            {generating ? <Loader2 size={16} className="animate-spin" /> : <Zap size={16} />} 
            Generate Invoices
          </button>
          
          <button 
            onClick={() => setIsAddRuleOpen(true)}
            className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5" 
            style={{ background: 'var(--color-electric-blue)' }}
          >
            <Plus size={16} /> Add rule
          </button>
        </div>
      </div>

      <Card noPadding>
        {/* Table/Card Views */}
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  {['Unit type', 'Base amount', 'Late penalty %', 'Due day', 'Frequency', ''].map(h => (
                    <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  Array.from({ length: 3 }).map((_, idx) => (
                    <tr key={idx} style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                      {Array.from({ length: 6 }).map((_, cIdx) => (
                        <td key={cIdx} className="px-4 py-4">
                          <div className="h-4 bg-gray-200 rounded-[4px] animate-pulse w-full"></div>
                        </td>
                      ))}
                    </tr>
                  ))
                ) : rules.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-4 py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>
                      No fee rules configured. Add a rule to begin tracking maintenance dues.
                    </td>
                  </tr>
                ) : rules.map(f => (
                  <tr key={f.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4]" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                    <td className="px-4 py-4 font-medium" style={{ color: 'var(--color-heading)' }}>{f.unitType}</td>
                    <td className="px-4 py-4 font-medium" style={{ color: 'var(--color-heading)' }}>₹{f.baseAmount.toLocaleString()}</td>
                    <td className="px-4 py-4" style={{ color: 'var(--color-body)' }}>{f.lateFeePercent}%</td>
                    <td className="px-4 py-4" style={{ color: 'var(--color-body)' }}>{f.dueDay}th of month</td>
                    <td className="px-4 py-4" style={{ color: 'var(--color-tertiary)' }}>{f.frequency}</td>
                    <td className="px-4 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-1.5 rounded-[4px] transition-colors duration-[330ms]" style={{ color: 'var(--color-tertiary)' }}><Edit2 size={14} /></button>
                        <button className="p-1.5 rounded-[4px] transition-colors duration-[330ms]" style={{ color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 p-4">
             {loading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="border p-4 rounded-[8px] bg-white shadow-sm flex flex-col gap-3 animate-pulse" style={{ borderColor: 'var(--color-cloud)' }}>
                    <div className="h-4 bg-gray-200 rounded-[4px] w-1/3"></div>
                    <div className="h-3 bg-gray-200 rounded-[4px] w-1/2"></div>
                    <div className="h-8 bg-gray-200 rounded-[4px] w-full mt-2"></div>
                  </div>
                ))
             ) : rules.length === 0 ? (
                <div className="py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>No fee rules configured. Add a rule to begin tracking maintenance dues.</div>
             ) : (
                rules.map(f => (
                   <div key={f.id} className="border p-4 rounded-[8px] bg-white shadow-sm flex flex-col gap-3" style={{ borderColor: 'var(--color-cloud)' }}>
                      <div className="flex justify-between items-start gap-2">
                         <div>
                            <p className="font-semibold text-sm" style={{ color: 'var(--color-heading)' }}>{f.unitType}</p>
                            <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>Due {f.dueDay}th • {f.frequency}</p>
                         </div>
                         <div className="text-right">
                            <p className="font-bold text-lg" style={{ color: 'var(--color-heading)' }}>₹{f.baseAmount.toLocaleString()}</p>
                            <p className="text-[10px] mt-0.5 uppercase tracking-wider font-semibold" style={{ color: 'var(--color-danger)' }}>{f.lateFeePercent}% Late</p>
                         </div>
                      </div>
                      <div className="flex justify-end gap-3 mt-1 pt-3 border-t" style={{ borderColor: 'var(--color-cloud)' }}>
                         <button className="p-2 rounded-[4px] transition-colors bg-blue-50" style={{ color: 'var(--color-electric-blue)' }}><Edit2 size={14} /></button>
                         <button className="p-2 rounded-[4px] transition-colors bg-red-50" style={{ color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
                      </div>
                   </div>
                ))
             )}
          </div>
        </div>
      </Card>
      
      {/* Modals */}
      <AddFeeRuleModal 
        isOpen={isAddRuleOpen} 
        onClose={() => setIsAddRuleOpen(false)} 
        onSuccess={fetchRules} 
      />
    </DashboardLayout>
  )
}
