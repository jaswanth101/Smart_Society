import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Wallet, AlertCircle, FileText, CheckCircle, Package } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ResidentHomePage — Tesla-inspired resident landing view.
// ─────────────────────────────────────────────────────────

export default function ResidentHomePage() {
  return (
    <ResidentLayout>
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Welcome, Priya</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Flat B-404 · Alpha Society</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Dues */}
        <div className="col-span-1 md:col-span-2">
          <Card noPadding className="h-full">
            <div className="p-6 flex flex-col sm:flex-row items-start justify-between gap-4">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--color-tertiary)' }}>Maintenance dues</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-medium" style={{ color: 'var(--color-heading)' }}>₹4,500</h2>
                  <span className="text-sm" style={{ color: 'var(--color-placeholder)' }}>/ Apr 2026</span>
                </div>
                <p className="text-xs mt-1.5 flex items-center gap-1 font-medium" style={{ color: 'var(--color-danger)' }}>
                  <AlertCircle size={12} /> Due in 3 days
                </p>
              </div>
              <button
                className="w-full sm:w-auto px-6 py-2.5 text-white font-medium rounded-[4px] transition-colors duration-[330ms] cursor-pointer text-sm"
                style={{ background: 'var(--color-electric-blue)' }}
              >
                Pay now
              </button>
            </div>
          </Card>
        </div>

        {/* Parcel */}
        <div className="col-span-1">
          <Card className="h-full flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-3">
              <div
                className="w-10 h-10 rounded-[4px] flex items-center justify-center"
                style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}
              >
                <Package size={20} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>1 parcel arrived</p>
                <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>At main gate</p>
              </div>
            </div>
            <button
              className="w-full mt-2 py-2 text-sm font-medium rounded-[4px] transition-colors duration-[330ms]"
              style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
            >
              View delivery PIN
            </button>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tickets */}
        <Card
          title="My helpdesk tickets"
          action={<button className="text-sm font-medium transition-colors duration-[330ms]" style={{ color: 'var(--color-electric-blue)' }}>View all</button>}
        >
          <div className="space-y-2 mt-1">
            <div className="flex items-center justify-between p-3 rounded-[4px] transition-colors duration-[330ms] hover:bg-[#F4F4F4]">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-[4px]" style={{ background: '#f59e0b14', color: '#f59e0b' }}><AlertCircle size={16} /></span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>Geyser not working</p>
                  <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>TK-0042 • Raised yesterday</p>
                </div>
              </div>
              <Badge variant="warning">In progress</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-[4px] transition-colors duration-[330ms] hover:bg-[#F4F4F4]">
              <div className="flex items-center gap-3">
                <span className="p-2 rounded-[4px]" style={{ background: '#10b98114', color: '#10b981' }}><CheckCircle size={16} /></span>
                <div>
                  <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>Lift B stuck</p>
                  <p className="text-xs" style={{ color: 'var(--color-placeholder)' }}>TK-0010 • Resolved</p>
                </div>
              </div>
              <Badge variant="success">Fixed</Badge>
            </div>
          </div>
        </Card>

        {/* Notices */}
        <Card
          title="Society notices"
          action={<button className="text-sm font-medium transition-colors duration-[330ms]" style={{ color: 'var(--color-electric-blue)' }}>View all</button>}
        >
          <div className="space-y-2 mt-1">
            <div className="flex items-start gap-3 p-3 rounded-[4px] transition-colors duration-[330ms] cursor-pointer hover:bg-[#F4F4F4]">
              <div
                className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}
              >
                <FileText size={14} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>AGM meeting minutes - March 2026</p>
                <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--color-tertiary)' }}>Please find attached the official minutes of the meeting held on 25th March...</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-medium" style={{ color: 'var(--color-placeholder)' }}>
                  <span>Admin</span> • <span>2 days ago</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-[4px] transition-colors duration-[330ms] cursor-pointer hover:bg-[#F4F4F4]">
              <div
                className="w-8 h-8 rounded-[4px] flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'var(--color-light-ash)', color: 'var(--color-tertiary)' }}
              >
                <AlertCircle size={14} />
              </div>
              <div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>Scheduled power cut</p>
                <p className="text-xs mt-1 line-clamp-1" style={{ color: 'var(--color-tertiary)' }}>Bescom maintenance from 2 PM to 5 PM tomorrow for Tower B.</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-medium" style={{ color: 'var(--color-placeholder)' }}>
                  <span>Maintenance</span> • <span>1 week ago</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ResidentLayout>
  )
}
