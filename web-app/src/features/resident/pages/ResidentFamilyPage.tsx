import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { CreditCard, AlertTriangle, Plus, User } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ResidentFamilyPage — Family members & RFID cards
// ─────────────────────────────────────────────────────────

type FamilyMember = { id: string; name: string; relation: string; rfidStatus: 'ACTIVE' | 'LOST' | 'BLOCKED'; rfidUid: string; lastScan: string }
const MOCK: FamilyMember[] = [
  { id: 'f1', name: 'Priya Sharma', relation: 'Self (Owner)', rfidStatus: 'ACTIVE', rfidUid: 'RFID-A1B2C3', lastScan: 'Today, 8:45 AM — Main gate' },
  { id: 'f2', name: 'Vikram Sharma', relation: 'Spouse', rfidStatus: 'ACTIVE', rfidUid: 'RFID-D4E5F6', lastScan: 'Today, 9:10 AM — Main gate' },
  { id: 'f3', name: 'Arjun Sharma', relation: 'Child', rfidStatus: 'ACTIVE', rfidUid: 'RFID-G7H8I9', lastScan: 'Yesterday, 4:30 PM — Pool' },
  { id: 'f4', name: 'Kamla Devi', relation: 'Domestic help', rfidStatus: 'ACTIVE', rfidUid: 'RFID-J1K2L3', lastScan: 'Today, 6:00 AM — Service gate' },
]
const STATUS_MAP: Record<string, 'success' | 'warning' | 'danger'> = { ACTIVE: 'success', LOST: 'warning', BLOCKED: 'danger' }

export default function ResidentFamilyPage() {
  return (
    <ResidentLayout>
      <div className="mb-8 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Family & RFID</h1>
          <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Manage family members and RFID card status.</p>
        </div>
        <button className="px-4 py-2.5 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 shrink-0 self-start sm:self-auto" style={{ background: 'var(--color-electric-blue)' }}>
          <Plus size={16} /> Add member
        </button>
      </div>

      <div className="space-y-4">
        {MOCK.map(m => (
          <Card key={m.id} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms]">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-[4px] flex items-center justify-center text-white font-medium" style={{ background: 'var(--color-electric-blue)' }}>{m.name.charAt(0)}</div>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{m.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{m.relation}</p>
                  <p className="text-[11px] mt-1" style={{ color: 'var(--color-placeholder)' }}>{m.lastScan}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs px-2 py-1 rounded-[4px]" style={{ background: 'var(--color-light-ash)', color: 'var(--color-body)' }}>{m.rfidUid}</span>
                <Badge variant={STATUS_MAP[m.rfidStatus]}>{m.rfidStatus.toLowerCase()}</Badge>
                {m.rfidStatus === 'ACTIVE' && (
                  <button className="text-xs font-medium px-3 py-1.5 rounded-[4px] transition-colors duration-[330ms]" style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-danger)' }}>
                    Report lost
                  </button>
                )}
              </div>
            </div>
          </Card>
        ))}
      </div>
    </ResidentLayout>
  )
}
