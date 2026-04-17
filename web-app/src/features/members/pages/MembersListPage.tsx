import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { UserPlus } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// MembersListPage — Resident & Tenant database.
// Role access: President, Secretary.
// ─────────────────────────────────────────────────────────
export default function MembersListPage() {
  return (
    <DashboardLayout>
      <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Members Directory</h1>
          <p className="text-sm text-slate-500">Manage residents, tenants, and family members</p>
        </div>
        <Button icon={<UserPlus size={16} />}>Add Member</Button>
      </div>
      <Card title="All Residents & Tenants">
        <div className="skeleton h-64 w-full" />
      </Card>
    </DashboardLayout>
  )
}
