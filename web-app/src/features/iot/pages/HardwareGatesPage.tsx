import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { RadioTower, AlertTriangle, ShieldAlert, DoorOpen, Lock, Server } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// HardwareGatesPage — The President's IoT Control Center
// ─────────────────────────────────────────────────────────

type ZonalGate = {
  id: string
  name: string
  status: 'LOCKED' | 'UNLOCKED' | 'OFFLINE'
  lastActive: string
}

const ZONAL_GATES_MOCK: ZonalGate[] = [
  { id: 'g01', name: 'Main Gate Boom Barrier', status: 'LOCKED', lastActive: '2m ago' },
  { id: 'g02', name: 'Tower A Pedestrian',     status: 'LOCKED', lastActive: '12m ago' },
  { id: 'g03', name: 'Swimming Pool Access',   status: 'UNLOCKED', lastActive: '45m ago' },
  { id: 'g04', name: 'Basement Parking',       status: 'OFFLINE', lastActive: '2h ago' },
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
    alert(`Global ${overrideModal} initiated!`)
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">IoT & Hardware Controls</h1>
        <p className="text-sm text-slate-500 mt-1">Master authority over physical society infrastructure.</p>
      </div>

      {/* Red Button Overrides Section */}
      <h2 className="text-lg font-bold text-slate-900 mb-4 tracking-tight uppercase px-1">Macro Overrides</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xl:gap-8 mb-10">
        <button
          onClick={() => setOverrideModal('EVACUATE')}
          className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-emerald-500/30 rounded-2xl bg-emerald-50 text-emerald-700 hover:bg-emerald-100 hover:border-emerald-500 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-emerald-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <DoorOpen size={32} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg">Evacuation Protocol</h3>
            <p className="text-xs max-w-[250px] mx-auto text-emerald-600/80 mt-1">Instantly raises all boom barriers and unlocks all magnetic RFID doors across the premises.</p>
          </div>
        </button>

        <button
          onClick={() => setOverrideModal('LOCKDOWN')}
          className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed border-red-500/30 rounded-2xl bg-red-50 text-red-700 hover:bg-red-100 hover:border-red-500 transition-all cursor-pointer group"
        >
          <div className="w-16 h-16 rounded-full bg-red-200 flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <ShieldAlert size={32} />
          </div>
          <div className="text-center">
            <h3 className="font-bold text-lg">Global Lockdown</h3>
            <p className="text-xs max-w-[250px] mx-auto text-red-600/80 mt-1">Drops all barriers and hard-locks all turnstiles. Overrides valid RFIDs until lockdown is lifted.</p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Zonal Control Matrix */}
        <div className="col-span-1 xl:col-span-2">
          <Card title="Targeted Zone Overrides" subtitle="Locally manage individual IoT endpoints">
            <div className="space-y-0 text-sm">
              {gates.map((g) => (
                <div key={g.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors gap-4">
                  <div className="flex items-center gap-3">
                    <RadioTower size={18} className={g.status === 'OFFLINE' ? 'text-slate-300' : 'text-blue-500'} />
                    <div>
                      <span className="font-medium text-slate-800 tracking-tight">{g.name}</span>
                      <p className="text-[10px] text-slate-400 mt-0.5 font-mono uppercase tracking-widest leading-none">Last ping: {g.lastActive}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <Badge variant={g.status === 'LOCKED' ? 'success' : g.status === 'UNLOCKED' ? 'warning' : 'neutral'}>
                      {g.status}
                    </Badge>
                    <button
                      onClick={() => handleToggleGate(g.id)}
                      disabled={g.status === 'OFFLINE'}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all w-full sm:w-auto ${
                         g.status === 'OFFLINE' ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                       : g.status === 'LOCKED'  ? 'bg-amber-100 text-amber-700 hover:bg-amber-200 cursor-pointer'
                       : 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200 cursor-pointer'
                      }`}
                    >
                      {g.status === 'LOCKED' ? 'Force Unlock' : g.status === 'UNLOCKED' ? 'Force Lock' : 'Offline'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Telemetry and System Feed */}
        <div className="col-span-1 flex flex-col gap-6">
          <Card className="flex flex-col bg-slate-900 border-slate-800 text-slate-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Edge Server</span>
              <span className="flex items-center gap-1.5 text-xs text-emerald-400 font-mono bg-emerald-400/10 px-2 py-0.5 rounded">
                 <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" /> ONLINE
              </span>
            </div>
            <div className="space-y-4 font-mono text-xs text-slate-400">
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>CPU Load</span><span className="text-slate-200">14%</span>
              </div>
              <div className="flex justify-between border-b border-slate-800 pb-2">
                <span>MQTT Broker</span><span className="text-emerald-400">CONNECTED</span>
              </div>
              <div className="flex justify-between">
                <span>Queued Logs</span><span className="text-slate-200">0</span>
              </div>
            </div>
          </Card>

          <Card title="Live Camera Feed">
             <div className="w-full aspect-video bg-slate-200 rounded-md overflow-hidden relative border border-slate-300 shadow-inner flex items-center justify-center">
                <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] uppercase font-bold px-1.5 py-0.5 rounded tracking-widest z-10 flex items-center gap-1">
                  <div className="w-1 h-1 bg-white rounded-full animate-pulse" /> REC
                </div>
                {/* Simulated static image of a camera feed */}
                <div 
                  className="absolute inset-0 opacity-40 bg-cover bg-center" 
                  style={{ backgroundImage: 'radial-gradient(circle, #cbd5e1 10%, #94a3b8 100%)' }}
                />
                <div className="relative text-slate-500 font-mono text-sm opacity-50">CAM_01_MAIN_GATE</div>
             </div>
          </Card>
        </div>
      </div>

      {/* Confirmation Modal */}
      {overrideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-sm p-6 relative">
            <button onClick={() => { setOverrideModal(null); setConfirmText('') }} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">✕</button>
            <div className="flex flex-col items-center mb-6 mt-2 text-center">
              <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-3">
                <AlertTriangle size={24} />
              </div>
              <h2 className="text-xl font-bold tracking-tight text-slate-900">Confirm Global Override</h2>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed">
                You are about to initiate a global <strong>{overrideModal}</strong>. This command physically bypasses local security staff.
              </p>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 block mb-1">Type CONFIRM to proceed</label>
                <input 
                  type="text" 
                  placeholder="CONFIRM"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full h-11 border border-slate-300 rounded font-mono text-center tracking-widest focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500"
                />
              </div>
              <button 
                onClick={executeMacroCommand}
                disabled={confirmText !== 'CONFIRM'}
                className="w-full h-11 rounded font-bold text-white uppercase tracking-widest transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700"
              >
                Execute Command
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
