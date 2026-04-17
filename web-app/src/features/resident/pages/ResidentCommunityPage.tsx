import { useState } from 'react'
import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { MessageSquare, Vote, ShoppingBag, FileText, ThumbsUp, Send } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ResidentCommunityPage — Chat, Polls, Marketplace, Docs
// ─────────────────────────────────────────────────────────

type Tab = 'polls' | 'marketplace' | 'documents'

export default function ResidentCommunityPage() {
  const [tab, setTab] = useState<Tab>('polls')

  return (
    <ResidentLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Community</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Polls, marketplace, and society documents.</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {([['polls', 'Polls & voting', <Vote size={16} key="v" />], ['marketplace', 'Marketplace', <ShoppingBag size={16} key="m" />], ['documents', 'Documents', <FileText size={16} key="d" />]] as const).map(([key, label, icon]) => (
          <button key={key} onClick={() => setTab(key as Tab)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[4px] text-sm font-medium shrink-0 transition-colors duration-[330ms]"
            style={{ background: tab === key ? 'var(--color-electric-blue)' : 'var(--color-white)', color: tab === key ? 'white' : 'var(--color-body)' }}>
            {icon}{label}
          </button>
        ))}
      </div>

      {tab === 'polls' && (
        <div className="space-y-4">
          {[
            { q: 'Should we increase CCTV coverage in basement?', options: ['Yes', 'No', 'Need more info'], votes: [42, 12, 8], deadline: '2 days left' },
            { q: 'Preferred timing for Diwali celebration', options: ['6PM–9PM', '7PM–10PM', '5PM–8PM'], votes: [28, 35, 15], deadline: 'Ended' },
          ].map((poll, i) => (
            <Card key={i}>
              <h3 className="text-[17px] font-medium mb-1" style={{ color: 'var(--color-heading)' }}>{poll.q}</h3>
              <p className="text-xs mb-4 font-medium" style={{ color: poll.deadline === 'Ended' ? 'var(--color-placeholder)' : 'var(--color-electric-blue)' }}>{poll.deadline}</p>
              <div className="space-y-2">
                {poll.options.map((opt, j) => {
                  const total = poll.votes.reduce((a, b) => a + b, 0)
                  const pct = Math.round((poll.votes[j] / total) * 100)
                  return (
                    <div key={j} className="relative overflow-hidden rounded-[4px] h-10 flex items-center" style={{ background: 'var(--color-light-ash)' }}>
                      <div className="absolute left-0 top-0 h-full rounded-[4px] transition-all duration-[330ms]" style={{ width: `${pct}%`, background: '#3E6AE120' }} />
                      <span className="relative px-3 text-sm" style={{ color: 'var(--color-heading)' }}>{opt}</span>
                      <span className="relative ml-auto px-3 text-xs font-medium" style={{ color: 'var(--color-tertiary)' }}>{pct}%</span>
                    </div>
                  )
                })}
              </div>
            </Card>
          ))}
        </div>
      )}

      {tab === 'marketplace' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { title: 'Study table — teak wood', price: '₹3,500', seller: 'Flat A-301', time: '2 days ago' },
            { title: 'Yoga classes — weekends', price: '₹500/month', seller: 'Flat C-102', time: '5 days ago' },
            { title: 'Baby stroller (barely used)', price: '₹2,000', seller: 'Flat B-404', time: '1 week ago' },
            { title: 'Guitar lessons for beginners', price: '₹800/month', seller: 'Flat A-501', time: '2 weeks ago' },
          ].map((item, i) => (
            <Card key={i} className="hover:bg-[#F4F4F4] transition-colors duration-[330ms] cursor-pointer">
              <h3 className="text-sm font-medium mb-1" style={{ color: 'var(--color-heading)' }}>{item.title}</h3>
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-electric-blue)' }}>{item.price}</p>
              <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>{item.seller} · {item.time}</p>
            </Card>
          ))}
        </div>
      )}

      {tab === 'documents' && (
        <div className="space-y-3">
          {[
            { name: 'Society Bye-Laws (2024)', type: 'PDF', size: '1.2 MB' },
            { name: 'AGM Minutes — March 2026', type: 'PDF', size: '850 KB' },
            { name: 'Annual Budget 2025-26', type: 'PDF', size: '2.1 MB' },
            { name: 'Fire Safety Protocol', type: 'PDF', size: '600 KB' },
          ].map((doc, i) => (
            <div key={i} className="flex items-center justify-between p-4 rounded-[4px] hover:bg-[#F4F4F4] transition-colors duration-[330ms] cursor-pointer" style={{ background: 'var(--color-white)' }}>
              <div className="flex items-center gap-3">
                <FileText size={18} style={{ color: 'var(--color-electric-blue)' }} />
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{doc.name}</p>
                  <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>{doc.type} · {doc.size}</p>
                </div>
              </div>
              <button className="text-xs font-medium px-3 py-1.5 rounded-[4px]" style={{ color: 'var(--color-electric-blue)' }}>Download</button>
            </div>
          ))}
        </div>
      )}
    </ResidentLayout>
  )
}
