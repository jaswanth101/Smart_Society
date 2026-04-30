import { useState, useEffect } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Car, Zap, MapPin } from 'lucide-react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// ResidentParkingPage — Live parking slots from PostgreSQL
// ─────────────────────────────────────────────────────────

export default function ResidentParkingPage() {
  const [slots, setSlots] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/property/parking')
      .then(res => setSlots(Array.isArray(res.data) ? res.data : []))
      .catch(() => {
        // Endpoint not built yet (Sprint 2) — degrade gracefully to empty state
        setSlots([])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <ResidentLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Parking</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Your assigned slots, guest booking, and EV charging.</p>
      </div>

      {/* My slots */}
      <Card title="Assigned slots" className="mb-6">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {Array.from({ length: 2 }).map((_, i) => <div key={i} className="h-16 bg-gray-200 rounded-[4px] animate-pulse" />)}
          </div>
        ) : slots.length === 0 ? (
          <div className="mt-4 text-center py-8">
            <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No parking slots assigned to your flat.</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-placeholder)' }}>Contact management to request a slot.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {slots.map((s: any) => (
              <div key={s.id} className="p-4 rounded-[4px] flex items-center gap-3" style={{ background: 'var(--color-light-ash)' }}>
                <div className="w-10 h-10 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>
                  <Car size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>Slot {s.slotLabel || s.id?.slice(0, 8)}</p>
                  <p className="text-xs font-mono" style={{ color: 'var(--color-tertiary)' }}>
                    {s.vehiclePlate || 'No vehicle'} · {s.vehicleType || s.type || 'CAR'}
                  </p>
                </div>
                <Badge variant={s.status === 'OCCUPIED' ? 'warning' : 'success'} className="ml-auto">{s.status?.toLowerCase()}</Badge>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Guest booking placeholder */}
      <Card title="Guest parking" action={
        <button className="text-sm font-medium" style={{ color: 'var(--color-electric-blue)' }}>Book slot</button>
      }>
        <div className="mt-4 text-center py-8">
          <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No active guest bookings.</p>
          <p className="text-xs mt-1" style={{ color: 'var(--color-placeholder)' }}>Book a temporary slot for visitors (max 2 hours).</p>
        </div>
      </Card>

      {/* EV */}
      <Card title="EV charging" className="mt-6">
        <div className="p-4 rounded-[4px] mt-4 flex items-center gap-3" style={{ background: 'var(--color-light-ash)' }}>
          <Zap size={20} style={{ color: '#10b981' }} />
          <div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>No EV slot assigned</p>
            <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>Contact management to request an EV bay allocation.</p>
          </div>
        </div>
      </Card>
    </ResidentLayout>
  )
}
