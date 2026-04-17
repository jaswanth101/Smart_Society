import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Vote, Users, UserCheck, ShieldCheck, ArrowRight, Lock } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ElectionsPage — Transition of Power Module
// Monochrome high-contrast design per Design.md requirements.
// ─────────────────────────────────────────────────────────

type Nominee = { id: string, name: string, role: string, votes: number }

const MOCK_NOMINEES: Nominee[] = [
  { id: 'n1', name: 'Alisha Verma', role: 'President candidate', votes: 142 },
  { id: 'n2', name: 'Sanjay Kumar', role: 'President candidate', votes: 89 },
  { id: 'n3', name: 'David D',      role: 'Secretary candidate', votes: 201 },
]

export default function ElectionsPage() {
  const [stage, setStage] = useState<'SETUP' | 'LIVE' | 'RESOLVED'>('LIVE')
  const [handoverConfirm, setHandoverConfirm] = useState(false)

  const handleHandover = () => {
    alert("CRITICAL: Root permissions transferred to Alisha Verma! You will now be downgraded to FLAT_OWNER.")
    setStage('SETUP') // Mock reset
  }

  return (
    <DashboardLayout>
      <div className="mb-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-black tracking-tight" style={{ letterSpacing: '-0.96px' }}>Digital Elections</h1>
        <p className="text-xl text-slate-500 mt-2 font-light" style={{ letterSpacing: '-0.26px' }}>
          Transition of power and committee handover protocol.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Election Status */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-8">
          
          {/* Quorum Status (Monochrome Display) */}
          <Card className="border border-black shadow-none bg-black text-white" noPadding>
            <div className="p-8 flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <span className="font-mono uppercase text-[12px] tracking-[0.6px] text-slate-400 mb-1 block">Live Status</span>
                <h2 className="text-3xl font-bold text-white tracking-tight">Voting in Progress</h2>
                <div className="flex items-center gap-2 mt-2">
                  <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span className="text-sm font-medium">Closes in 4h 12m</span>
                </div>
              </div>

              <div className="text-center md:text-right">
                <span className="font-mono uppercase text-[12px] tracking-[0.6px] text-slate-400 mb-1 block">Quorum Met</span>
                <p className="text-5xl font-light tracking-tighter">
                  72<span className="text-2xl text-slate-500">%</span>
                </p>
                <p className="text-sm text-slate-400 mt-1">340/472 Flats voted</p>
              </div>
            </div>
          </Card>

          {/* Leaderboard */}
          <Card className="border border-black shadow-none bg-white" title={<span className="font-mono uppercase tracking-[0.54px] text-black">Live Leaderboard</span>}>
             <div className="mt-4 space-y-0">
               {MOCK_NOMINEES.map((nominee, i) => (
                 <div key={nominee.id} className="flex items-center justify-between py-4 border-b border-black border-dashed last:border-0 border-opacity-20">
                   <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-[50px] border border-black flex items-center justify-center font-bold text-black">
                       {i + 1}
                     </div>
                     <div>
                       <p className="text-[20px] font-bold text-black tracking-tight leading-none mb-1">{nominee.name}</p>
                       <p className="text-[14px] text-slate-500 font-light">{nominee.role}</p>
                     </div>
                   </div>
                   <div className="text-right">
                     <span className="font-mono text-[18px] font-bold tracking-tight text-black">{nominee.votes}</span>
                     <span className="text-[12px] text-slate-500 block uppercase font-mono tracking-widest mt-0.5">Votes</span>
                   </div>
                 </div>
               ))}
             </div>
          </Card>
        </div>

        {/* Handover Protocol Sidebar */}
        <div className="col-span-1">
          <Card className="border-2 border-black shadow-none bg-white h-full sticky top-24" noPadding>
            <div className="p-6 md:p-8 flex flex-col h-full items-center text-center">
              <div className="w-20 h-20 rounded-full border border-black flex items-center justify-center mb-6">
                <ShieldCheck size={40} className="text-black" />
              </div>
              
              <h3 className="text-2xl font-bold tracking-tight text-black mb-2" style={{ letterSpacing: '-0.26px' }}>
                Handover Protocol
              </h3>
              <p className="text-slate-600 mb-8 font-light leading-relaxed">
                Ratify the election results and transfer the `PRESIDENT` root access token to the winning candidate.
              </p>

              {!handoverConfirm ? (
                <button 
                  onClick={() => setHandoverConfirm(true)}
                  disabled={stage !== 'LIVE'}
                  className="w-full mt-auto py-4 rounded-[50px] bg-white text-black border-2 border-black font-bold uppercase tracking-widest text-[14px] hover:bg-slate-50 transition-colors focus:outline-dashed focus:outline-2 focus:outline-black focus:outline-offset-2 disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  Initiate Handover
                </button>
              ) : (
                <div className="w-full mt-auto flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-[8px]">
                  <p className="text-xs font-bold text-red-600 uppercase tracking-widest flex items-center justify-center gap-1">
                    <Lock size={12} /> Confirm action
                  </p>
                  <p className="text-xs text-slate-600">This action demotes your account permanently.</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button onClick={() => setHandoverConfirm(false)} className="flex-1 py-2 text-sm border border-slate-300 rounded-[50px] font-medium text-black">Cancel</button>
                    <button onClick={handleHandover} className="flex-1 py-2 text-sm bg-black text-white rounded-[50px] font-medium transition-colors hover:bg-black/80">Confirm</button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>

      </div>
    </DashboardLayout>
  )
}
