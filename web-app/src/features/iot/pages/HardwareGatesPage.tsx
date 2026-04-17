import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { RadioTower, AlertTriangle, ShieldAlert, DoorOpen, Server } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// HardwareGatesPage — Tesla-inspired IoT Control Center
// ─────────────────────────────────────────────────────────

type ZonalGate = {
  id: string
  name: string
  status: 'LOCKED' | 'UNLOCKED' | 'OFFLINE'
  lastActive: string
}

const ZONAL_GATES_MOCK: ZonalGate[] = [
  { id: 'g01', name: 'Main gate boom barrier', status: 'LOCKED', lastActive: '2m ago' },
  { id: 'g02', name: 'Tower A pedestrian', status: 'LOCKED', lastActive: '12m ago' },
  { id: 'g03', name: 'Swimming pool access', status: 'UNLOCKED', lastActive: '45m ago' },
  { id: 'g04', name: 'Basement parking', status: 'OFFLINE', lastActive: '2h ago' },
]

export default function HardwareGatesPage() {
  const [gates, setGates] = useState(ZONAL_GATES_MOCK)
  const [overrideModal, setOverrideModal] = useState<'LOCKDOWN' | 'EVACUATE' | null>(null)
  const [confirmText, setConfirmText] = useState('')

  const handleToggleGate = (id: string) => {
    setGates((prev) =>
      prev.map((g) => {
        if (g.id === id) {
          if (g.status === 'OFFLINE') return g
          return { ...g, status: g.status === 'LOCKED' ? 'UNLOCKED' : 'LOCKED' }
        }
        return g
      })
    )
  }

  const executeMacroCommand = () => {
    if (confirmText !== 'CONFIRM') return
    if (overrideModal === 'LOCKDOWN') {
      setGates(prev => prev.map(g => ({ ...g, status: 'LOCKED' })))
    } else if (overrideModal === 'EVACUATE') {
      setGates(prev => prev.map(g => ({ ...g, status: 'UNLOCKED' })))
    }
    setOverrideModal(null)
    setConfirmText('')
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>
          IoT & hardware controls
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>
          Master authority over physical society infrastructure.
        </p>
      </div>

      {/* Macro Overrides */}
      <p className="text-[17px] font-medium mb-4" style={{ color: 'var(--color-heading)' }}>Macro overrides</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-10">
        <button
          onClick={() => setOverrideModal('EVACUATE')}
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-[12px] transition-colors duration-[330ms] cursor-pointer group"
          style={{ background: '#10b98114', color: '#10b981' }}
        >
          <div className="w-16 h-16 rounded-[4px] bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-[330ms]">
            <DoorOpen size={32} />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-[17px]" style={{ color: 'var(--color-heading)' }}>Evacuation protocol</h3>
            <p className="text-xs max-w-[280px] mx-auto mt-1" style={{ color: 'var(--color-tertiary)' }}>
              Instantly raises all boom barriers and unlocks all magnetic RFID doors across the premises.
            </p>
          </div>
        </button>

        <button
          onClick={() => setOverrideModal('LOCKDOWN')}
          className="flex flex-col items-center justify-center gap-3 p-8 rounded-[12px] transition-colors duration-[330ms] cursor-pointer group"
          style={{ background: '#ef444414', color: '#ef4444' }}
        >
          <div className="w-16 h-16 rounded-[4px] bg-white flex items-center justify-center group-hover:scale-105 transition-transform duration-[330ms]">
            <ShieldAlert size={32} />
          </div>
          <div className="text-center">
            <h3 className="font-medium text-[17px]" style={{ color: 'var(--color-heading)' }}>Global lockdown</h3>
            <p className="text-xs max-w-[280px] mx-auto mt-1" style={{ color: 'var(--color-tertiary)' }}>
              Drops all barriers and hard-locks all turnstiles. Overrides valid RFIDs until lockdown is lifted.
            </p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Zonal Control */}
        <div className="col-span-1 xl:col-span-2">
          <Card title="Targeted zone overrides" subtitle="Locally manage individual IoT endpoints">
            <div className="space-y-0 text-sm">
              {gates.map((g) => (
                <div key={g.id} className="flex flex-col sm:flex-row sm:items-center justify-between py-4 gap-4" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <div className="flex items-center gap-3">
                    <RadioTower size={18} style={{ color: g.status === 'OFFLINE' ? 'var(--color-pale)' : 'var(--color-electric-blue)' }} />
                    <div>
                      <span className="font-medium" style={{ color: 'var(--color-heading)' }}>{g.name}</span>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--color-placeholder)' }}>Last ping: {g.lastActive}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant={g.status === 'LOCKED' ? 'success' : g.status === 'UNLOCKED' ? 'warning' : 'neutral'}>
                      {g.status.toLowerCase()}
                    </Badge>
                    <button
                      onClick={() => handleToggleGate(g.id)}
                      disabled={g.status === 'OFFLINE'}
                      className="px-4 py-1.5 rounded-[4px] text-xs font-medium transition-colors duration-[330ms] w-full sm:w-auto disabled:opacity-40 disabled:cursor-not-allowed"
                      style={{
                        background: g.status === 'OFFLINE' ? 'var(--color-light-ash)' : 'var(--color-light-ash)',
                        color: g.status === 'OFFLINE' ? 'var(--color-placeholder)' : 'var(--color-heading)',
                      }}
                    >
                      {g.status === 'LOCKED' ? 'Force unlock' : g.status === 'UNLOCKED' ? 'Force lock' : 'Offline'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Telemetry */}
        <div className="col-span-1 flex flex-col gap-6">
          <div className="rounded-[12px] p-5" style={{ background: 'var(--color-carbon-dark)', color: 'var(--color-white)' }}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium" style={{ color: 'var(--color-placeholder)' }}>Edge server</span>
              <span className="flex items-center gap-1.5 text-xs font-medium px-2 py-0.5 rounded-[4px]" style={{ color: '#10b981', background: '#10b98114' }}>
                <div className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-pulse" /> online
              </span>
            </div>
            <div className="space-y-4 text-xs" style={{ color: 'var(--color-placeholder)' }}>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span>CPU load</span><span style={{ color: 'var(--color-white)' }}>14%</span>
              </div>
              <div className="flex justify-between pb-2" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <span>MQTT broker</span><span style={{ color: '#10b981' }}>connected</span>
              </div>
              <div className="flex justify-between">
                <span>Queued logs</span><span style={{ color: 'var(--color-white)' }}>0</span>
              </div>
            </div>
          </div>

          <Card title="Live camera feed">
            <div className="w-full aspect-video rounded-[4px] overflow-hidden relative flex items-center justify-center" style={{ background: 'var(--color-light-ash)' }}>
              <div className="absolute top-2 right-2 text-white text-[9px] font-medium px-1.5 py-0.5 rounded-[4px] z-10 flex items-center gap-1" style={{ background: '#ef4444' }}>
                <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> rec
              </div>
              <span className="text-sm" style={{ color: 'var(--color-placeholder)' }}>CAM_01_MAIN_GATE</span>
            </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {overrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(128,128,128,0.65)' }}>
          <div className="bg-white rounded-[12px] w-full max-w-sm p-6 relative">
            <button onClick={() => { setOverrideModal(null); setConfirmText('') }} className="absolute top-4 right-4" style={{ color: 'var(--color-placeholder)' }}>✕</button>
            <div className="flex flex-col items-center mb-6 mt-2 text-center">
              <div className="w-12 h-12 rounded-[4px] flex items-center justify-center mb-3" style={{ background: '#ef444414', color: '#ef4444' }}>
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-[22px] font-medium" style={{ color: 'var(--color-heading)' }}>Confirm global override</h2>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--color-tertiary)' }}>
                You are about to initiate a global <strong>{overrideModal.toLowerCase()}</strong>. This command physically bypasses local security staff.
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: 'var(--color-heading)' }}>Type CONFIRM to proceed</label>
                <input
                  type="text"
                  placeholder="CONFIRM"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full h-11 rounded-[4px] text-center tracking-widest text-sm"
                  style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
                />
              </div>
              <button
                onClick={executeMacroCommand}
                disabled={confirmText !== 'CONFIRM'}
                className="w-full h-11 rounded-[4px] font-medium text-white text-sm transition-colors duration-[330ms] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: '#ef4444' }}
              >
                Execute command
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
