import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Plus, Edit2, Trash2 } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// FeeStructurePage — Tesla-inspired fee config
// ─────────────────────────────────────────────────────────

type FeeRule = { id: string; unitType: string; baseAmount: number; lateFee: number; dueDay: number; frequency: string }

const MOCK_FEES: FeeRule[] = [
  { id: 'f1', unitType: '1BHK', baseAmount: 2500, lateFee: 5, dueDay: 5, frequency: 'Monthly' },
  { id: 'f2', unitType: '2BHK', baseAmount: 4500, lateFee: 5, dueDay: 5, frequency: 'Monthly' },
  { id: 'f3', unitType: '3BHK', baseAmount: 6500, lateFee: 5, dueDay: 5, frequency: 'Monthly' },
  { id: 'f4', unitType: 'Penthouse', baseAmount: 12000, lateFee: 3, dueDay: 5, frequency: 'Monthly' },
  { id: 'f5', unitType: 'Shop / Commercial', baseAmount: 8000, lateFee: 8, dueDay: 1, frequency: 'Monthly' },
]

export default function FeeStructurePage() {
  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Fee structures</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Configure maintenance fees per unit type with auto late-fee rules.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> Add rule
        </button>
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['Unit type', 'Base amount', 'Late fee %', 'Due day', 'Frequency', 'Actions'].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {MOCK_FEES.map(f => (
                <tr key={f.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4]" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-4 font-medium" style={{ color: 'var(--color-heading)' }}>{f.unitType}</td>
                  <td className="px-4 py-4 font-medium" style={{ color: 'var(--color-heading)' }}>₹{f.baseAmount.toLocaleString()}</td>
                  <td className="px-4 py-4" style={{ color: 'var(--color-body)' }}>{f.lateFee}%</td>
                  <td className="px-4 py-4" style={{ color: 'var(--color-body)' }}>{f.dueDay}th of month</td>
                  <td className="px-4 py-4" style={{ color: 'var(--color-tertiary)' }}>{f.frequency}</td>
                  <td className="px-4 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 rounded-[4px] transition-colors duration-[330ms]" style={{ color: 'var(--color-tertiary)' }}><Edit2 size={14} /></button>
                      <button className="p-1.5 rounded-[4px] transition-colors duration-[330ms]" style={{ color: 'var(--color-danger)' }}><Trash2 size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Auto-reminder config */}
      <Card title="Auto-reminder schedule" subtitle="Automated alerts sent before and after due date" className="mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {[
            { label: '7 days before due', channel: 'Push + WhatsApp', active: true },
            { label: '3 days before due', channel: 'Push + WhatsApp + SMS', active: true },
            { label: '1 day after due', channel: 'Push + WhatsApp + SMS + Email', active: true },
          ].map((r, i) => (
            <div key={i} className="p-4 rounded-[4px] flex items-start gap-3" style={{ background: 'var(--color-light-ash)' }}>
              <div className="w-2 h-2 rounded-full mt-1.5 shrink-0" style={{ background: r.active ? 'var(--color-success)' : 'var(--color-placeholder)' }} />
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{r.label}</p>
                <p className="text-xs mt-0.5" style={{ color: 'var(--color-tertiary)' }}>{r.channel}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </DashboardLayout>
  )
}
