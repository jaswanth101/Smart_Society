import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Car, Zap, Search, Plus, Loader2, RefreshCcw, AlertCircle } from 'lucide-react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useApiMutation } from '@/hooks/useApiMutation'
import type { ParkingSlotRecord, CreateParkingSlotPayload } from '@/types/api-contracts'

// ─────────────────────────────────────────────────────────
// ParkingManagementPage — Live API + Create/Assign Flows
// ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, 'success' | 'warning' | 'neutral'> = { ASSIGNED: 'success', AVAILABLE: 'neutral', GUEST: 'warning' }

export default function ParkingManagementPage() {
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState<CreateParkingSlotPayload>({ slotNumber: '', zone: '' })

  const { data: slots, isLoading, error, refetch } = useApiQuery<ParkingSlotRecord[]>('/property/parking')

  const { mutate: createSlot, isLoading: creating } = useApiMutation<ParkingSlotRecord, CreateParkingSlotPayload>(
    '/property/parking', 'POST', {
      onSuccess: () => { setShowCreate(false); setForm({ slotNumber: '', zone: '' }); refetch() },
    }
  )

  const list = slots ?? []
  const filtered = list.filter(s =>
    s.slotNumber.toLowerCase().includes(search.toLowerCase()) ||
    (s.unit?.flatNumber || '').toLowerCase().includes(search.toLowerCase()) ||
    (s.vehicle || '').toLowerCase().includes(search.toLowerCase())
  )

  const assigned = list.filter(s => s.status === 'ASSIGNED').length
  const evSlots = list.filter(s => s.vehicleType === 'EV').length

  // ── Loading skeleton ───────────────────────────────────
  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <div className="h-10 w-72 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-3" />
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-20 bg-gray-200 rounded-[12px] animate-pulse" />
          ))}
        </div>
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-14 bg-gray-200 rounded-[8px] animate-pulse" />
          ))}
        </div>
      </DashboardLayout>
    )
  }

  // ── Error state ────────────────────────────────────────
  if (error) {
    return (
      <DashboardLayout>
        <div className="mb-8">
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Parking management</h1>
        </div>
        <Card className="text-center py-12">
          <AlertCircle className="mx-auto mb-3" size={32} style={{ color: 'var(--color-danger)' }} />
          <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-heading)' }}>Failed to load parking data</p>
          <p className="text-xs mb-4" style={{ color: 'var(--color-tertiary)' }}>{error}</p>
          <Button onClick={refetch} variant="primary" size="sm">Retry</Button>
        </Card>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Parking management</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>
            {list.length} total slots · {assigned} assigned · {list.length - assigned} available
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={refetch} className="p-2.5 rounded-[4px] transition-colors hover:bg-[#F4F4F4]" style={{ color: 'var(--color-tertiary)' }}>
            <RefreshCcw size={16} />
          </button>
          <button onClick={() => setShowCreate(true)} className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5" style={{ background: 'var(--color-electric-blue)' }}>
            <Plus size={16} /> Add slot
          </button>
        </div>
      </div>

      {/* Summary KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total slots', value: list.length, icon: <Car size={18} /> },
          { label: 'Assigned', value: assigned, icon: <Car size={18} /> },
          { label: 'Available', value: list.length - assigned, icon: <Car size={18} /> },
          { label: 'EV bays', value: evSlots, icon: <Zap size={18} /> },
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 flex items-center gap-3" style={{ background: 'var(--color-white)' }}>
            <div className="w-10 h-10 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>{s.icon}</div>
            <div>
              <p className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>{s.value}</p>
              <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Create Slot Modal */}
      {showCreate && (
        <Card className="mb-6 border-2" style={{ borderColor: 'var(--color-electric-blue)' }}>
          <h3 className="text-sm font-medium mb-4" style={{ color: 'var(--color-heading)' }}>Register new parking slot</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-tertiary)' }}>Slot Number *</label>
              <input type="text" placeholder="B1-001" value={form.slotNumber} onChange={e => setForm(f => ({ ...f, slotNumber: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-tertiary)' }}>Zone *</label>
              <input type="text" placeholder="Basement 1" value={form.zone} onChange={e => setForm(f => ({ ...f, zone: e.target.value }))}
                className="w-full px-3 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
            </div>
            <div>
              <label className="block text-xs font-medium mb-1" style={{ color: 'var(--color-tertiary)' }}>Vehicle Type</label>
              <select value={form.vehicleType || 'CAR'} onChange={e => setForm(f => ({ ...f, vehicleType: e.target.value as 'CAR' | 'BIKE' | 'EV' }))}
                className="w-full px-3 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}>
                <option value="CAR">Car</option>
                <option value="BIKE">Bike</option>
                <option value="EV">EV</option>
              </select>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button disabled={creating || !form.slotNumber || !form.zone} onClick={() => createSlot(form)}
              className="px-4 py-2 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 disabled:opacity-50"
              style={{ background: 'var(--color-electric-blue)' }}>
              {creating ? <><Loader2 size={14} className="animate-spin" /> Creating…</> : 'Create slot'}
            </button>
            <button onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm font-medium rounded-[4px]" style={{ color: 'var(--color-body)' }}>Cancel</button>
          </div>
        </Card>
      )}

      {/* Table */}
      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input type="text" placeholder="Search slot, flat, or vehicle..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }} />
          </div>
        </div>

        {list.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Car className="mx-auto mb-3 opacity-20" size={32} />
            <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>No parking slots registered yet</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>Click "Add slot" to register your first parking slot.</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                    {['Slot', 'Zone', 'Type', 'Assigned to', 'Vehicle', 'Status'].map(h => (
                      <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(s => (
                    <tr key={s.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{s.slotNumber}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{s.zone}</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-0.5 rounded-[4px] text-xs font-medium" style={{
                          background: s.vehicleType === 'EV' ? '#10b98114' : 'var(--color-light-ash)',
                          color: s.vehicleType === 'EV' ? '#10b981' : 'var(--color-body)',
                        }}>{s.vehicleType}</span>
                      </td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-heading)' }}>
                        {s.unit ? `${s.unit.building?.name || ''} ${s.unit.flatNumber} ${s.unit.residents?.[0]?.name || ''}`.trim() : '—'}
                      </td>
                      <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--color-tertiary)' }}>{s.vehicle || '—'}</td>
                      <td className="px-4 py-3"><Badge variant={STATUS_MAP[s.status]}>{s.status.toLowerCase()}</Badge></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View */}
            <div className="md:hidden flex flex-col gap-3 p-4">
              {filtered.map(s => (
                <div key={s.id} className="border p-4 rounded-[8px] bg-white flex flex-col gap-2" style={{ borderColor: 'var(--color-cloud)' }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{s.slotNumber}</p>
                      <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{s.zone} · {s.vehicleType}</p>
                    </div>
                    <Badge variant={STATUS_MAP[s.status]}>{s.status.toLowerCase()}</Badge>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mt-1 pt-2 border-t" style={{ borderColor: 'var(--color-cloud)' }}>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: 'var(--color-placeholder)' }}>Assigned to</p>
                      <p className="text-sm" style={{ color: 'var(--color-heading)' }}>
                        {s.unit ? `${s.unit.flatNumber} ${s.unit.residents?.[0]?.name || ''}`.trim() : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] uppercase tracking-wide font-semibold" style={{ color: 'var(--color-placeholder)' }}>Vehicle</p>
                      <p className="text-sm font-mono" style={{ color: 'var(--color-heading)' }}>{s.vehicle || '—'}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {filtered.length === 0 && list.length > 0 && (
          <div className="text-center py-8">
            <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No slots match "{search}"</p>
          </div>
        )}
      </Card>
    </DashboardLayout>
  )
}
