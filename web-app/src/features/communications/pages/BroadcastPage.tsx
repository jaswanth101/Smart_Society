import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { BellRing, Send, CheckCircle2, MessageSquare, Smartphone } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// BroadcastPage — President's Emergency Broadcast Console
// Strictly styled according to Design.md (Monochrome, Pill buttons)
// ─────────────────────────────────────────────────────────

export default function BroadcastPage() {
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'CRITICAL' | 'INFO'>('INFO')
  const [channels, setChannels] = useState({ push: true, whatsapp: true, sms: false })
  const [sent, setSent] = useState(false)

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!message.trim()) return
    // Mock send
    setSent(true)
    setTimeout(() => {
      setSent(false)
      setMessage('')
    }, 3000)
  }

  return (
    <DashboardLayout>
      <div className="mb-8 max-w-4xl">
        <h1 className="text-4xl font-bold text-black tracking-tight" style={{ letterSpacing: '-0.96px' }}>Emergency Broadcast</h1>
        <p className="text-xl text-slate-500 mt-2 font-light" style={{ letterSpacing: '-0.26px' }}>
          Push un-mutable alerts to all registered residents and staff.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        {/* Main Broadcast Form */}
        <div className="col-span-1 md:col-span-2">
          <Card className="border border-black shadow-none bg-white h-full" noPadding>
            <form onSubmit={handleSend} className="p-6 md:p-8 flex flex-col h-full">
              
              {/* Priority Toggle */}
              <div className="mb-6">
                <label className="block text-[18px] uppercase font-mono tracking-[0.54px] text-black mb-3">Priority Level</label>
                <div className="flex gap-3">
                  {(['INFO', 'CRITICAL'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className={`px-6 py-2.5 rounded-full text-base font-medium transition-all focus:outline-dashed focus:outline-2 focus:outline-black focus:outline-offset-2 ${
                        priority === level 
                          ? 'bg-black text-white' 
                          : 'bg-white text-black border border-black hover:bg-slate-50'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message Content */}
              <div className="mb-8 flex-1">
                <label className="block text-[18px] uppercase font-mono tracking-[0.54px] text-black mb-3">Message payload</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type emergency alert here..."
                  className="w-full h-32 md:h-48 p-4 bg-white border border-black rounded-[8px] text-[20px] text-black placeholder:text-slate-400 focus:outline-dashed focus:outline-2 focus:outline-black focus:outline-offset-2 resize-none"
                  style={{ letterSpacing: '-0.14px', lineHeight: '1.4' }}
                  required
                />
              </div>

              {/* Action */}
              <div className="flex items-center justify-between border-t border-slate-200 pt-6 mt-auto">
                <span className="text-sm font-mono text-slate-500 tracking-wider">CHARACTERS: {message.length}</span>
                <button
                  type="submit"
                  disabled={!message.trim() || sent}
                  className="px-8 py-3 bg-black text-white rounded-[50px] font-medium flex items-center gap-2 hover:bg-black/80 transition-colors disabled:opacity-30 disabled:cursor-not-allowed focus:outline-dashed focus:outline-2 focus:outline-black focus:outline-offset-2"
                >
                  {sent ? (
                    <><CheckCircle2 size={18} /> Broadcast Sent</>
                  ) : (
                    <><Send size={18} /> Send Alert</>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Configuration Sidebar */}
        <div className="col-span-1 flex flex-col gap-6">
          <Card className="border border-black shadow-none bg-white" title={<span className="font-mono uppercase tracking-[0.54px] text-black">Delivery Channels</span>}>
            <div className="space-y-4 mt-2">
              <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-[8px] hover:bg-slate-50">
                <input 
                  type="checkbox" 
                  checked={channels.push} 
                  onChange={(e) => setChannels({...channels, push: e.target.checked})}
                  className="w-5 h-5 accent-black" 
                />
                <Smartphone size={20} className="text-black" />
                <div className="flex-1">
                  <p className="font-bold text-black text-[16px] tracking-tight">Push Notification</p>
                  <p className="text-[14px] text-slate-500">iOS & Android App</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-[8px] hover:bg-slate-50">
                <input 
                  type="checkbox" 
                  checked={channels.whatsapp} 
                  onChange={(e) => setChannels({...channels, whatsapp: e.target.checked})}
                  className="w-5 h-5 accent-black" 
                />
                <MessageSquare size={20} className="text-emerald-600" />
                <div className="flex-1">
                  <p className="font-bold text-black text-[16px] tracking-tight">WhatsApp Blast</p>
                  <p className="text-[14px] text-slate-500">Via WATI API</p>
                </div>
              </label>

              <label className="flex items-center gap-3 cursor-pointer p-3 border border-slate-200 rounded-[8px] hover:bg-slate-50">
                <input 
                  type="checkbox" 
                  checked={channels.sms} 
                  onChange={(e) => setChannels({...channels, sms: e.target.checked})}
                  className="w-5 h-5 accent-black" 
                />
                <MessageSquare size={20} className="text-blue-600" />
                <div className="flex-1">
                  <p className="font-bold text-black text-[16px] tracking-tight">SMS Fallback</p>
                  <p className="text-[14px] text-slate-500">Only if app offline</p>
                </div>
              </label>
            </div>
          </Card>

          <Card className="border border-black shadow-none bg-black text-white" noPadding>
             <div className="p-6">
                <div className="flex items-center gap-3 mb-4 text-white">
                  <BellRing size={24} />
                  <span className="font-mono uppercase tracking-[0.54px] font-bold">Policy Note</span>
                </div>
                <p className="text-[18px] font-light leading-relaxed opacity-90" style={{ letterSpacing: '-0.26px' }}>
                  CRITICAL alerts bypass 'Do Not Disturb' modes on mobile devices. Misuse of this feature is audited by the platform owner.
                </p>
             </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
