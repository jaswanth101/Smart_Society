import { useState, useEffect } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Dumbbell, Waves, Film, Gamepad2, MapPin } from 'lucide-react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// ResidentAmenitiesPage — Live amenities from PostgreSQL
// ─────────────────────────────────────────────────────────

const ICON_MAP: Record<string, React.ReactNode> = {
  GYM: <Dumbbell size={20} />,
  POOL: <Waves size={20} />,
  HALL: <Film size={20} />,
  GAMES: <Gamepad2 size={20} />,
}

export default function ResidentAmenitiesPage() {
  const [amenities, setAmenities] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    apiClient.get('/amenities')
      .then(res => setAmenities(res.data))
      .catch(err => console.error('Failed to load amenities', err))
      .finally(() => setLoading(false))
  }, [])

  return (
    <ResidentLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Amenities</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Book facilities and check your weekly quota.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-48 bg-gray-200 rounded-[8px] animate-pulse" />)}
        </div>
      ) : amenities.length === 0 ? (
        <div className="py-16 text-center">
          <MapPin size={32} className="mx-auto mb-3 opacity-30" />
          <p className="text-sm" style={{ color: 'var(--color-placeholder)' }}>No amenities configured for this society.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {amenities.map((a: any) => {
            const isBlocked = a.status === 'BLOCKED' || a.status === 'MAINTENANCE'
            const icon = ICON_MAP[a.type?.toUpperCase()] || <MapPin size={20} />
            const sessionsUsed = 0 // TODO: Track from booking API
            const sessionsMax = a.quotaPerWeek || 7

            return (
              <Card key={a.id}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>{icon}</div>
                  <div>
                    <h3 className="text-[17px] font-medium" style={{ color: 'var(--color-heading)' }}>{a.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{a.openTime || '6AM'} – {a.closeTime || '10PM'}</p>
                  </div>
                  {isBlocked && <Badge variant="danger" className="ml-auto">Closed</Badge>}
                </div>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs" style={{ color: 'var(--color-placeholder)' }}>Weekly quota</span>
                  <span className="text-xs font-medium" style={{ color: sessionsUsed >= sessionsMax ? 'var(--color-danger)' : 'var(--color-heading)' }}>
                    {sessionsUsed}/{sessionsMax} used
                  </span>
                </div>
                <div className="w-full h-1.5 rounded-full mb-4" style={{ background: 'var(--color-light-ash)' }}>
                  <div className="h-1.5 rounded-full transition-all duration-[330ms]" style={{ width: `${(sessionsUsed / sessionsMax) * 100}%`, background: 'var(--color-electric-blue)' }} />
                </div>

                <button
                  className="w-full py-2.5 rounded-[4px] text-sm font-medium transition-colors duration-[330ms]"
                  style={{
                    background: isBlocked ? 'var(--color-light-ash)' : 'var(--color-electric-blue)',
                    color: isBlocked ? 'var(--color-placeholder)' : 'white',
                    cursor: isBlocked ? 'not-allowed' : 'pointer',
                  }}
                  disabled={isBlocked}
                >
                  {isBlocked ? 'Under maintenance' : `Book — ${a.capacity || 0} capacity`}
                </button>
              </Card>
            )
          })}
        </div>
      )}
    </ResidentLayout>
  )
}
