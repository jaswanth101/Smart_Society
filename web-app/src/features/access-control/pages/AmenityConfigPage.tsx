import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Dumbbell, Waves, Film, Gamepad2, Settings, Lock, Unlock, Plus } from 'lucide-react'
import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiClient } from '@/lib/api'
import { AddAmenityModal } from '../components/AddAmenityModal'

// ─────────────────────────────────────────────────────────
// AmenityConfigPage — Tesla-inspired amenity management
// ─────────────────────────────────────────────────────────

type Amenity = {
  id: string; name: string; icon: React.ReactNode; maxCapacity: number
  quotaPerWeek: number; timings: string; rfidRequired: boolean
  status: 'ACTIVE' | 'MAINTENANCE' | 'BLOCKED'
}

const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { ACTIVE: 'success', MAINTENANCE: 'warning', BLOCKED: 'danger' }

export default function AmenityConfigPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [amenities, setAmenities] = useState<Amenity[]>([])
  const [loading, setLoading] = useState(true)
  const [isAddOpen, setIsAddOpen] = useState(false)

  const fetchAmenities = async () => {
    setLoading(true)
    try {
      const { data } = await apiClient.get('/amenities')
      setAmenities(data)
    } catch (err) {
      console.error('Failed to fetch amenities', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchAmenities()
  }, [])

  const toggleStatus = async (id: string, currentStatus: string) => {
    if (!tenantId) return
    const newStatus = currentStatus === 'ACTIVE' ? 'MAINTENANCE' : 'ACTIVE'
    
    // Optimistic update
    setAmenities(prev => prev.map(a => a.id === id ? { ...a, status: newStatus } : a))
    
    try {
      await apiClient.post(`/amenities/${id}/status`, { status: newStatus })
    } catch (err) {
      console.error('Failed to update amenity status', err)
      // Revert optimistic update on failure
      setAmenities(prev => prev.map(a => a.id === id ? { ...a, status: currentStatus as any } : a))
    }
  }

  const getIcon = (name: string) => {
    const ln = name.toLowerCase()
    if (ln.includes('pool') || ln.includes('swim')) return <Waves size={20} />
    if (ln.includes('gym') || ln.includes('fit') || ln.includes('health')) return <Dumbbell size={20} />
    if (ln.includes('game') || ln.includes('tennis')) return <Gamepad2 size={20} />
    return <Film size={20} />
  }

  return (
    <DashboardLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Amenity configuration</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Manage time limits, quotas, RFID access, and maintenance blocks.</p>
        </div>
        <button onClick={() => setIsAddOpen(true)} className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> Add amenity
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p className="text-sm text-slate-500 col-span-2">Loading amenities...</p>
        ) : amenities.length === 0 ? (
          <div className="col-span-2 py-10 text-center text-sm" style={{ color: 'var(--color-placeholder)' }}>
            <p>No amenities found. Click "Add amenity" to set up your facility config.</p>
          </div>
        ) : (
          amenities.map(a => (
            <Card key={a.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms]">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>
                    {getIcon(a.name)}
                  </div>
                  <div>
                    <h3 className="text-[17px] font-medium" style={{ color: 'var(--color-heading)' }}>{a.name}</h3>
                    <Badge variant={STATUS_MAP[a.status] || 'neutral'}>{a.status.toLowerCase()}</Badge>
                  </div>
                </div>
                <button className="p-1.5 rounded-[4px]" style={{ color: 'var(--color-tertiary)' }}><Settings size={16} /></button>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                {[
                  { label: 'Max capacity', value: `${a.maxCapacity} persons` },
                  { label: 'Weekly quota', value: `${a.quotaPerWeek} sessions` },
                  { label: 'Timings', value: a.timings },
                  { label: 'RFID gate', value: a.rfidRequired ? 'Required' : 'Not required' },
                ].map(d => (
                  <div key={d.label} className="p-3 rounded-[4px]" style={{ background: 'var(--color-light-ash)' }}>
                    <p className="text-[11px] font-medium mb-0.5" style={{ color: 'var(--color-placeholder)' }}>{d.label}</p>
                    <p className="font-medium text-xs" style={{ color: 'var(--color-heading)' }}>{d.value}</p>
                  </div>
                ))}
              </div>

              <button 
                onClick={() => toggleStatus(a.id, a.status)}
                className="mt-4 w-full py-2 rounded-[4px] text-xs font-medium flex items-center justify-center gap-1.5 transition-colors duration-[330ms]"
                style={{ 
                  border: `1px solid ${a.status === 'ACTIVE' ? 'var(--color-danger)' : 'var(--color-success)'}`, 
                  color: a.status === 'ACTIVE' ? 'var(--color-danger)' : 'var(--color-success)' 
                }}
              >
                {a.status === 'ACTIVE' ? (
                  <><Lock size={12} /> Block / Pause amenity</>
                ) : (
                  <><Unlock size={12} /> Unblock amenity</>
                )}
              </button>
            </Card>
          ))
        )}
      </div>

      <AddAmenityModal 
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchAmenities}
      />
    </DashboardLayout>
  )
}
