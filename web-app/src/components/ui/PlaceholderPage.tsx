import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Construction } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function PlaceholderPage() {
  const location = useLocation()
  
  return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] border-2 border-dashed border-slate-200 rounded-xl bg-slate-50/50">
        <div className="w-16 h-16 bg-blue-100 text-blue-600 flex items-center justify-center rounded-full mb-4">
          <Construction size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-800 mb-2">Module Under Construction</h2>
        <p className="text-slate-500 text-center max-w-sm">
          The view for <code className="bg-slate-200 px-1.5 py-0.5 rounded text-sm text-slate-700">{location.pathname}</code> is currently being built.
        </p>
      </div>
    </DashboardLayout>
  )
}
