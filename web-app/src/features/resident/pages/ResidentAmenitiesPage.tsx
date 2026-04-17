import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Dumbbell, Waves, Film, Gamepad2, Calendar, Clock } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ResidentAmenitiesPage — Book amenities, view availability
// ─────────────────────────────────────────────────────────

const AMENITIES = [
  { id: 'a1', name: 'Swimming pool', icon: <Waves size={20} />, timings: '6AM–10AM, 4PM–8PM', sessionsUsed: 2, sessionsMax: 3, nextSlot: 'Today, 4:00 PM' },
  { id: 'a2', name: 'Gym', icon: <Dumbbell size={20} />, timings: '5AM–10PM', sessionsUsed: 5, sessionsMax: 7, nextSlot: 'Open now' },
  { id: 'a3', name: 'Community hall', icon: <Film size={20} />, timings: 'By booking only', sessionsUsed: 0, sessionsMax: 1, nextSlot: 'Available' },
  { id: 'a4', name: 'Games room', icon: <Gamepad2 size={20} />, timings: '10AM–9PM', sessionsUsed: 3, sessionsMax: 5, nextSlot: 'Under maintenance' },
]

export default function ResidentAmenitiesPage() {
  return (
    <ResidentLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Amenities</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Book facilities and check your weekly quota.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AMENITIES.map(a => (
          <Card key={a.id}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>{a.icon}</div>
              <div>
                <h3 className="text-[17px] font-medium" style={{ color: 'var(--color-heading)' }}>{a.name}</h3>
                <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{a.timings}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs" style={{ color: 'var(--color-placeholder)' }}>Weekly quota</span>
              <span className="text-xs font-medium" style={{ color: a.sessionsUsed >= a.sessionsMax ? 'var(--color-danger)' : 'var(--color-heading)' }}>
                {a.sessionsUsed}/{a.sessionsMax} used
              </span>
            </div>
            <div className="w-full h-1.5 rounded-full mb-4" style={{ background: 'var(--color-light-ash)' }}>
              <div className="h-1.5 rounded-full transition-all duration-[330ms]" style={{ width: `${(a.sessionsUsed / a.sessionsMax) * 100}%`, background: a.sessionsUsed >= a.sessionsMax ? 'var(--color-danger)' : 'var(--color-electric-blue)' }} />
            </div>

            <button
              className="w-full py-2.5 rounded-[4px] text-sm font-medium transition-colors duration-[330ms]"
              style={{
                background: a.nextSlot === 'Under maintenance' ? 'var(--color-light-ash)' : 'var(--color-electric-blue)',
                color: a.nextSlot === 'Under maintenance' ? 'var(--color-placeholder)' : 'white',
                cursor: a.nextSlot === 'Under maintenance' ? 'not-allowed' : 'pointer',
              }}
              disabled={a.nextSlot === 'Under maintenance'}
            >
              {a.nextSlot === 'Under maintenance' ? 'Under maintenance' : `Book — ${a.nextSlot}`}
            </button>
          </Card>
        ))}
      </div>
    </ResidentLayout>
  )
}
