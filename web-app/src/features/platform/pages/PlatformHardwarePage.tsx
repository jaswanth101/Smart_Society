import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Cpu, Wifi, WifiOff, HardDrive, Thermometer, Activity } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// PlatformHardwarePage — Global hardware asset tracking
// ─────────────────────────────────────────────────────────

type EdgeDevice = { id: string; society: string; device: string; type: string; ip: string; uptime: string; cpu: number; temp: number; status: 'ONLINE' | 'OFFLINE' }

const MOCK: EdgeDevice[] = [
  { id: 'e1', society: 'Alpha Society', device: 'Edge Pi 4-A', type: 'Raspberry Pi 4', ip: '192.168.1.100', uptime: '42 days', cpu: 23, temp: 52, status: 'ONLINE' },
  { id: 'e2', society: 'Alpha Society', device: 'RFID Reader — Main', type: 'UHF RFID', ip: '192.168.1.110', uptime: '42 days', cpu: 8, temp: 38, status: 'ONLINE' },
  { id: 'e3', society: 'Green Meadows', device: 'Edge Pi 4-GM', type: 'Raspberry Pi 4', ip: '10.0.0.50', uptime: '18 days', cpu: 31, temp: 55, status: 'ONLINE' },
  { id: 'e4', society: 'Sunrise Township', device: 'Edge Pi 4-ST', type: 'Raspberry Pi 4', ip: '—', uptime: '—', cpu: 0, temp: 0, status: 'OFFLINE' },
  { id: 'e5', society: 'Lake View', device: 'Edge Pi 4-LV', type: 'Raspberry Pi 4', ip: '172.16.0.10', uptime: '7 days', cpu: 18, temp: 48, status: 'ONLINE' },
]

export default function PlatformHardwarePage() {
  const online = MOCK.filter(d => d.status === 'ONLINE').length
  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Hardware assets</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Global edge server tracking and AMC renewals.</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total devices', value: MOCK.length, icon: <Cpu size={18} /> },
          { label: 'Online', value: online, icon: <Wifi size={18} /> },
          { label: 'Offline', value: MOCK.length - online, icon: <WifiOff size={18} /> },
          { label: 'Avg. uptime', value: '97.2%', icon: <Activity size={18} /> },
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 flex items-center gap-3" style={{ background: 'var(--color-white)' }}>
            <div className="w-10 h-10 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>{s.icon}</div>
            <div><p className="text-xl font-medium" style={{ color: 'var(--color-heading)' }}>{s.value}</p><p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p></div>
          </div>
        ))}
      </div>

      <Card noPadding>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
              {['Device', 'Society', 'Type', 'IP', 'Uptime', 'CPU', 'Temp', 'Status'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-medium" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {MOCK.map(d => (
                <tr key={d.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms]" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                  <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{d.device}</td>
                  <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{d.society}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-tertiary)' }}>{d.type}</td>
                  <td className="px-4 py-3 font-mono text-xs" style={{ color: 'var(--color-tertiary)' }}>{d.ip}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'var(--color-body)' }}>{d.uptime}</td>
                  <td className="px-4 py-3 text-xs font-medium" style={{ color: d.cpu > 80 ? 'var(--color-danger)' : 'var(--color-heading)' }}>{d.cpu}%</td>
                  <td className="px-4 py-3 text-xs" style={{ color: d.temp > 60 ? 'var(--color-danger)' : 'var(--color-body)' }}>{d.temp > 0 ? `${d.temp}°C` : '—'}</td>
                  <td className="px-4 py-3"><Badge variant={d.status === 'ONLINE' ? 'success' : 'danger'}>{d.status.toLowerCase()}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </DashboardLayout>
  )
}
