import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { ShieldCheck, PlusCircle, RefreshCcw } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// RfidManagementPage — Issue, revoke, and configure RFID cards.
// Role access: President, Secretary, Supervisor.
// ─────────────────────────────────────────────────────────
const MOCK_CARDS = [
  { uid: 'UID-7F3A', name: 'Anjali Mehta',   flat: 'A-101', status: 'ACTIVE',  type: 'Resident' },
  { uid: 'UID-9B2E', name: 'Ram Kumar',      flat: 'B-203', status: 'ACTIVE',  type: 'Domestic Help' },
  { uid: 'UID-4D1C', name: 'Suresh Bhat',    flat: 'C-405', status: 'REVOKED', type: 'Resident' },
  { uid: 'UID-2A8F', name: 'Gate Guard #1',  flat: 'Main Gate', status: 'ACTIVE', type: 'Staff' },
]

export default function RfidManagementPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">RFID Card Management</h1>
          <p className="text-sm text-slate-500">Issue, revoke, and configure physical access credentials</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" icon={<RefreshCcw size={15} />}>Sync to Edge Pi</Button>
          <Button icon={<PlusCircle size={15} />}>Issue New Card</Button>
        </div>
      </div>
      <Card title="All RFID Cards" subtitle={`${MOCK_CARDS.length} total credentials registered`}>
        <div>
          {/* Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Card UID', 'Holder Name', 'Flat / Post', 'Type', 'Status', 'Actions'].map((h) => (
                    <th key={h} className="text-left py-3 px-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {MOCK_CARDS.map((card) => (
                  <tr key={card.uid} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-2">
                      <code className="text-xs bg-slate-100 px-2 py-0.5 rounded font-mono">{card.uid}</code>
                    </td>
                    <td className="py-3 px-2 font-medium text-slate-800">{card.name}</td>
                    <td className="py-3 px-2 text-slate-600">{card.flat}</td>
                    <td className="py-3 px-2">
                      <Badge variant="neutral">{card.type}</Badge>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={card.status === 'ACTIVE' ? 'success' : 'danger'} dot>
                        {card.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2">
                      <div className="flex gap-2">
                        <button className="text-xs font-medium text-blue-600 hover:underline">Edit</button>
                        <button className="text-xs font-medium text-red-500 hover:underline">Revoke</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Mobile Card View */}
          <div className="md:hidden flex flex-col gap-3 mt-2">
             {MOCK_CARDS.map((card) => (
                <div key={card.uid} className="border border-slate-100 p-4 rounded-[8px] bg-white shadow-sm flex flex-col gap-3">
                   <div className="flex justify-between items-start gap-2">
                     <div className="flex-1 min-w-0">
                       <p className="font-medium text-slate-800 text-sm truncate">{card.name}</p>
                       <p className="text-xs text-slate-500 mt-1 flex items-center gap-1.5 flex-wrap">
                         <span>{card.flat}</span> 
                         <span className="text-slate-300">•</span>
                         <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-[10px] truncate">{card.uid}</code>
                       </p>
                     </div>
                     <Badge variant={card.status === 'ACTIVE' ? 'success' : 'danger'} dot>
                       {card.status}
                     </Badge>
                   </div>
                   <div className="flex justify-between items-center mt-1 pt-3 border-t border-slate-50">
                     <Badge variant="neutral">{card.type}</Badge>
                     <div className="flex gap-3">
                       <button className="text-xs font-medium text-blue-600 hover:underline px-2 py-1 bg-blue-50 rounded">Edit</button>
                       <button className="text-xs font-medium text-red-500 hover:underline px-2 py-1 bg-red-50 rounded">Revoke</button>
                     </div>
                   </div>
                </div>
             ))}
          </div>
        </div>
      </Card>
    </DashboardLayout>
  )
}
