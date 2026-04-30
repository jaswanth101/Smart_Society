import { useState } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { BellRing, Send, CheckCircle2, MessageSquare, Smartphone, Loader2 } from 'lucide-react'
import { useApiQuery } from '@/hooks/useApiQuery'
import { useApiMutation } from '@/hooks/useApiMutation'
import { formatRelativeTime } from '@/lib/format'
import type { CreateBroadcastPayload, BroadcastRecord } from '@/types/api-contracts'

// ─────────────────────────────────────────────────────────
// BroadcastPage — Tesla-inspired Emergency Broadcast Console
// POST /communications/broadcasts + GET /communications/broadcasts
// ─────────────────────────────────────────────────────────

export default function BroadcastPage() {
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [priority, setPriority] = useState<'CRITICAL' | 'INFO'>('INFO')
  const [channels, setChannels] = useState({ push: true, whatsapp: true, sms: false })
  const [successId, setSuccessId] = useState<string | null>(null)

  // ── Live broadcast history ───────────────────────────────
  const history = useApiQuery<BroadcastRecord[]>('/communications/broadcasts')

  // ── Mutation for sending broadcasts ──────────────────────
  const sendBroadcast = useApiMutation<CreateBroadcastPayload, BroadcastRecord>(
    '/communications/broadcasts',
    {
      onSuccess: (data) => {
        setSuccessId(data.id)
        setTitle('')
        setMessage('')
        // Refresh the history list
        history.refetch()
        // Clear success state after 4 seconds
        setTimeout(() => setSuccessId(null), 4000)
      },
    }
  )

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !message.trim()) return

    // Build the channel string from selections
    const selectedChannels = Object.entries(channels)
      .filter(([, v]) => v)
      .map(([k]) => k.toUpperCase())
      .join(',') || 'ALL'

    await sendBroadcast.execute({
      title: priority === 'CRITICAL' ? `⚠️ EMERGENCY: ${title}` : title,
      body: message,
      channel: selectedChannels,
    }).catch(() => {
      // Error is already captured in sendBroadcast.error
    })
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>
          Emergency broadcast
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>
          Push un-mutable alerts to all registered residents and staff.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="col-span-1 md:col-span-2">
          <Card className="h-full" noPadding>
            <form onSubmit={handleSend} className="p-6 flex flex-col h-full">
              {/* Priority */}
              <div className="mb-6">
                <label className="block text-[17px] font-medium mb-3" style={{ color: 'var(--color-heading)' }}>Priority level</label>
                <div className="flex gap-3">
                  {(['INFO', 'CRITICAL'] as const).map(level => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setPriority(level)}
                      className="px-6 py-2.5 rounded-[4px] text-sm font-medium transition-all duration-[330ms]"
                      style={{
                        background: priority === level ? 'var(--color-electric-blue)' : 'var(--color-white)',
                        color: priority === level ? 'var(--color-white)' : 'var(--color-body)',
                        border: priority === level ? 'none' : '1px solid var(--color-cloud)',
                      }}
                    >
                      {level.toLowerCase()}
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="mb-4">
                <label className="block text-[17px] font-medium mb-3" style={{ color: 'var(--color-heading)' }}>Alert title</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Water Supply Disruption"
                  className="w-full h-11 px-4 rounded-[4px] text-sm transition-all duration-[330ms]"
                  style={{
                    border: '1px solid var(--color-cloud)',
                    color: 'var(--color-heading)',
                    background: 'var(--color-white)',
                  }}
                  required
                />
              </div>

              {/* Message */}
              <div className="mb-8 flex-1">
                <label className="block text-[17px] font-medium mb-3" style={{ color: 'var(--color-heading)' }}>Message payload</label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type emergency alert here..."
                  className="w-full h-32 md:h-48 p-4 rounded-[4px] text-sm resize-none transition-all duration-[330ms]"
                  style={{
                    border: '1px solid var(--color-cloud)',
                    color: 'var(--color-heading)',
                    background: 'var(--color-white)',
                    lineHeight: '1.43',
                  }}
                  required
                />
              </div>

              {/* Error */}
              {sendBroadcast.error && (
                <div className="mb-4 px-4 py-3 rounded-[4px] text-sm" style={{ background: '#fee2e2', color: '#991b1b' }} role="alert">
                  {sendBroadcast.error.message}
                </div>
              )}

              {/* Action */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pt-6 mt-auto gap-4" style={{ borderTop: '1px solid var(--color-cloud)' }}>
                <span className="text-xs" style={{ color: 'var(--color-placeholder)' }}>Characters: {message.length}</span>
                <button
                  type="submit"
                  disabled={!title.trim() || !message.trim() || sendBroadcast.isLoading}
                  className="px-8 py-3 rounded-[4px] font-medium text-sm text-white flex items-center gap-2 transition-colors duration-[330ms] disabled:opacity-40 disabled:cursor-not-allowed w-full sm:w-auto justify-center"
                  style={{ background: successId ? '#10b981' : 'var(--color-electric-blue)' }}
                >
                  {sendBroadcast.isLoading ? (
                    <><Loader2 size={18} className="animate-spin" /> Sending…</>
                  ) : successId ? (
                    <><CheckCircle2 size={18} /> Broadcast sent</>
                  ) : (
                    <><Send size={18} /> Send alert</>
                  )}
                </button>
              </div>
            </form>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="col-span-1 flex flex-col gap-6">
          <Card title="Delivery channels">
            <div className="space-y-3 mt-2">
              {[
                { key: 'push' as const, icon: <Smartphone size={20} />, label: 'Push notification', sub: 'iOS & Android app', color: 'var(--color-heading)' },
                { key: 'whatsapp' as const, icon: <MessageSquare size={20} />, label: 'WhatsApp blast', sub: 'Via WATI API', color: '#10b981' },
                { key: 'sms' as const, icon: <MessageSquare size={20} />, label: 'SMS fallback', sub: 'Only if app offline', color: 'var(--color-electric-blue)' },
              ].map(ch => (
                <label key={ch.key} className="flex items-center gap-3 cursor-pointer p-3 rounded-[4px] transition-colors duration-[330ms] hover:bg-[#F4F4F4]">
                  <input
                    type="checkbox"
                    checked={channels[ch.key]}
                    onChange={(e) => setChannels({...channels, [ch.key]: e.target.checked})}
                    className="w-5 h-5 accent-[#3E6AE1] rounded-[4px]"
                  />
                  <span style={{ color: ch.color }}>{ch.icon}</span>
                  <div className="flex-1">
                    <p className="font-medium text-sm" style={{ color: 'var(--color-heading)' }}>{ch.label}</p>
                    <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{ch.sub}</p>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Broadcast History */}
          <Card title="Recent broadcasts" subtitle={history.data ? `${history.data.length} total` : 'Loading…'}>
            <div className="space-y-2 mt-2">
              {history.isLoading ? (
                Array.from({ length: 3 }).map((_, idx) => (
                  <div key={idx} className="py-3 animate-pulse">
                    <div className="h-4 bg-gray-200 rounded-[4px] w-2/3 mb-1" />
                    <div className="h-3 bg-gray-200 rounded-[4px] w-1/3" />
                  </div>
                ))
              ) : !history.data || history.data.length === 0 ? (
                <p className="text-xs py-2" style={{ color: 'var(--color-placeholder)' }}>No broadcasts sent yet.</p>
              ) : (
                history.data.slice(0, 5).map((b) => (
                  <div key={b.id} className="py-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                    <p className="text-sm font-medium truncate" style={{ color: 'var(--color-heading)' }}>{b.title}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="neutral">{b.channel}</Badge>
                      <span className="text-[10px]" style={{ color: 'var(--color-placeholder)' }}>{formatRelativeTime(b.sentAt)}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          <div className="rounded-[12px] p-6" style={{ background: 'var(--color-carbon-dark)' }}>
            <div className="flex items-center gap-3 mb-4 text-white">
              <BellRing size={20} />
              <span className="font-medium text-sm">Policy note</span>
            </div>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--color-placeholder)' }}>
              Critical alerts bypass 'Do Not Disturb' modes on mobile devices. Misuse of this feature is audited by the platform owner.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
