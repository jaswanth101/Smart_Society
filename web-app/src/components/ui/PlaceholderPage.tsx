import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Construction } from 'lucide-react'
import { useLocation } from 'react-router-dom'

export default function PlaceholderPage() {
  const location = useLocation()
  
  return (
    <DashboardLayout>
      <div
        className="flex flex-col items-center justify-center h-[calc(100vh-12rem)] rounded-[12px]"
        style={{ background: 'var(--color-white)' }}
      >
        <div
          className="w-16 h-16 rounded-[4px] flex items-center justify-center mb-4"
          style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}
        >
          <Construction size={32} />
        </div>
        <h2 className="text-[22px] font-medium mb-2" style={{ color: 'var(--color-heading)' }}>Module under construction</h2>
        <p className="text-center max-w-sm text-sm" style={{ color: 'var(--color-tertiary)' }}>
          The view for{' '}
          <code
            className="px-1.5 py-0.5 rounded-[4px] text-xs"
            style={{ background: 'var(--color-light-ash)', color: 'var(--color-heading)' }}
          >
            {location.pathname}
          </code>{' '}
          is currently being built.
        </p>
      </div>
    </DashboardLayout>
  )
}
