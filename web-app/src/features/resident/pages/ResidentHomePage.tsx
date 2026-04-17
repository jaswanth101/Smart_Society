import { ResidentLayout } from '@/layouts/ResidentLayout'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Wallet, AlertCircle, FileText, CheckCircle, Package } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// ResidentHomePage — The main landing view for Flat Owners/Tenants.
// ─────────────────────────────────────────────────────────

export default function ResidentHomePage() {
  return (
    <ResidentLayout>
      {/* Welcome & Context */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Welcome, Priya</h1>
        <p className="text-sm text-slate-500 mt-1">Flat B-404 · Alpha Society</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Quick Outstanding Dues */}
        <div className="col-span-1 md:col-span-2">
          <Card noPadding className="h-full border border-blue-100 bg-gradient-to-r from-blue-50 to-white">
            <div className="p-6 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-blue-700 uppercase tracking-widest mb-1 shadow-sm">Maintenance Dues</p>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-3xl font-extrabold text-slate-900">₹4,500</h2>
                  <span className="text-sm text-slate-500 font-medium">/ Apr 2026</span>
                </div>
                <p className="text-xs text-red-500 mt-1.5 flex items-center gap-1 font-medium">
                  <AlertCircle size={12} /> Due in 3 days
                </p>
              </div>
              <button className="w-full sm:w-auto px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors cursor-pointer">
                Pay Now
              </button>
            </div>
          </Card>
        </div>

        {/* Quick Action / Notice */}
        <div className="col-span-1">
          <Card className="h-full flex flex-col justify-center border border-indigo-100 bg-indigo-50/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600">
                <Package size={20} />
              </div>
              <div>
                <p className="text-sm font-bold text-indigo-900">1 Parcel Arrived</p>
                <p className="text-xs text-indigo-700 font-medium">At Main Gate</p>
              </div>
            </div>
            <button className="w-full mt-2 py-2 text-sm font-semibold text-indigo-600 border border-indigo-200 rounded-md hover:bg-indigo-100 transition-colors">
              View Delivery PIN
            </button>
          </Card>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* My Tickets */}
        <Card title="My Helpdesk Tickets" action={<button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>}>
          <div className="space-y-3 mt-1">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-amber-100 text-amber-700 rounded-md"><AlertCircle size={16} /></span>
                <div>
                  <p className="text-sm font-medium text-slate-800">Geyser not working</p>
                  <p className="text-xs text-slate-500">TK-0042 • Raised yesterday</p>
                </div>
              </div>
              <Badge variant="warning">In Progress</Badge>
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors">
              <div className="flex items-center gap-3">
                <span className="p-2 bg-emerald-100 text-emerald-700 rounded-md"><CheckCircle size={16} /></span>
                <div>
                  <p className="text-sm font-medium text-slate-800">Lift B stuck</p>
                  <p className="text-xs text-slate-500">TK-0010 • Resolved</p>
                </div>
              </div>
              <Badge variant="success">Fixed</Badge>
            </div>
          </div>
        </Card>

        {/* Notices */}
        <Card title="Society Notices" action={<button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>}>
           <div className="space-y-3 mt-1">
            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center shrink-0 mt-0.5">
                <FileText size={14} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">AGM Meeting Minutes - March 2026</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">Please find attached the official minutes of the meeting held on 25th March...</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-semibold tracking-wide text-slate-400">
                  <span className="uppercase uppercase">Admin</span> • <span>2 Days ago</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-start gap-3 p-3 rounded-lg border border-slate-100 bg-slate-50/50 hover:bg-slate-50 transition-colors cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center shrink-0 mt-0.5">
                <AlertCircle size={14} className="text-slate-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-800">Scheduled Power Cut</p>
                <p className="text-xs text-slate-500 mt-1 line-clamp-1">Bescom maintenance from 2 PM to 5 PM tomorrow for Tower B.</p>
                <div className="flex items-center gap-2 mt-2 text-[10px] font-semibold tracking-wide text-slate-400">
                  <span className="uppercase uppercase">Maintenance</span> • <span>1 Week ago</span>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </ResidentLayout>
  )
}
