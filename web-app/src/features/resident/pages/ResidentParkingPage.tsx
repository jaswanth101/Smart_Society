import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Car, Zap, Clock } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ResidentParkingPage — My parking, guest booking
// ─────────────────────────────────────────────────────────

export default function ResidentParkingPage() {
  return (
    <ResidentLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Parking</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Your assigned slots, guest booking, and EV charging.</p>
      </div>

      {/* My slots */}
      <Card title="Assigned slots" className="mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          {[
            { slot: 'B1-042', vehicle: 'KA-05-CD-5678', type: 'CAR' },
            { slot: 'B2-018', vehicle: 'KA-05-EF-1234', type: 'BIKE' },
          ].map(s => (
            <div key={s.slot} className="p-4 rounded-[4px] flex items-center gap-3" style={{ background: 'var(--color-light-ash)' }}>
              <div className="w-10 h-10 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>
                <Car size={18} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>Slot {s.slot}</p>
                <p className="text-xs font-mono" style={{ color: 'var(--color-tertiary)' }}>{s.vehicle} · {s.type}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Guest booking */}
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
