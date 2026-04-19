import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Building2, Bell, Shield, Globe, Palette, Database, Layers } from 'lucide-react'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// SettingsPage — Tesla-inspired society settings panel
// ─────────────────────────────────────────────────────────

type SettingSection = { icon: React.ReactNode; title: string; description: string; fields: { label: string; value: string; type: 'text' | 'toggle' }[] }

const SECTIONS: SettingSection[] = [
  {
    icon: <Building2 size={20} />, title: 'Society profile', description: 'Basic information about your society.',
    fields: [
      { label: 'Society name', value: 'Alpha Society', type: 'text' },
      { label: 'Address', value: '123 Tech Park, Bangalore 560001', type: 'text' },
      { label: 'Total units', value: '486', type: 'text' },
      { label: 'RERA registration', value: 'PRM/KA/RERA/1251/2024', type: 'text' },
    ],
  },
  {
    icon: <Bell size={20} />, title: 'Notification preferences', description: 'Control how alerts are delivered.',
    fields: [
      { label: 'Push notifications', value: 'Enabled', type: 'toggle' },
      { label: 'WhatsApp alerts', value: 'Enabled', type: 'toggle' },
      { label: 'SMS fallback', value: 'Disabled', type: 'toggle' },
      { label: 'Email digests', value: 'Weekly', type: 'text' },
    ],
  },
  {
    icon: <Shield size={20} />, title: 'Security & access', description: 'RFID, gate, and curfew rules.',
    fields: [
      { label: 'Curfew alert time', value: '11:00 PM', type: 'text' },
      { label: 'Guest parking limit', value: '2 hours', type: 'text' },
      { label: 'RFID auto-block after', value: '3 failed attempts', type: 'text' },
      { label: 'Emergency override', value: 'President only', type: 'text' },
    ],
  },
  {
    icon: <Database size={20} />, title: 'Data & exports', description: 'Backup and data management.',
    fields: [
      { label: 'Auto backup', value: 'Daily at 2:00 AM', type: 'text' },
      { label: 'Data retention', value: '5 years', type: 'text' },
      { label: 'Audit logging', value: 'Enabled', type: 'toggle' },
    ],
  },
]

export default function SettingsPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  
  const [features, setFeatures] = useState({
    hasAmenities: false,
    hasElections: false,
    hasHelpdesk: true,
    hasVisitorGate: true
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!tenantId) return
    apiClient.get(`/tenants/${tenantId}`)
      .then(res => {
        setFeatures({
          hasAmenities: res.data.hasAmenities,
          hasElections: res.data.hasElections,
          hasHelpdesk: res.data.hasHelpdesk,
          hasVisitorGate: res.data.hasVisitorGate
        })
      })
      .finally(() => setLoading(false))
  }, [tenantId])

  const toggleFeature = async (featureKey: keyof typeof features) => {
    if (!tenantId) return
    const newValue = !features[featureKey]
    
    // Optimistic UI Update
    setFeatures(prev => ({ ...prev, [featureKey]: newValue }))
    
    try {
      await apiClient.post(`/tenants/${tenantId}/features`, {
        [featureKey]: newValue
      })
      // Optional: Inform a global context so Sidebar updates instantly
      // For now, the user can refresh to see Sidebar changes or we handle it via context reload.
    } catch (err) {
      console.error('Failed to update feature toggle', err)
      // Revert optimistic update
      setFeatures(prev => ({ ...prev, [featureKey]: !newValue }))
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Settings</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Society configuration, modules, notifications, and security preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Dynamic Modules Section */}
        <Card>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>
              <Layers size={20} />
            </div>
            <div>
              <h3 className="text-[17px] font-medium" style={{ color: 'var(--color-heading)' }}>Active Modules</h3>
              <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>Toggle core SaaS platform features for your society.</p>
            </div>
          </div>
          
          <div className="space-y-0">
            {loading ? <p className="py-3 text-sm" style={{ color: 'var(--color-placeholder)' }}>Loading module states...</p> : (
              [
                { key: 'hasHelpdesk', label: 'Helpdesk & Ticketing', desc: 'Allow residents to raise maintenance complaints.' },
                { key: 'hasAmenities', label: 'Amenities Booking', desc: 'Enable digital bookings for pool, gym, etc.' },
                { key: 'hasElections', label: 'Digital Elections', desc: 'Run society voting and polls.' },
                { key: 'hasVisitorGate', label: 'Visitor & Gate Security', desc: 'Track visitor check-ins and gate passes.' }
              ].map((mod, i, arr) => (
                <div key={mod.key} className="flex flex-col py-3 gap-2" style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--color-cloud)' : 'none' }}>
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-sm font-medium" style={{ color: 'var(--color-heading)' }}>{mod.label}</span>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-tertiary)' }}>{mod.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                       <span className="text-sm font-medium" style={{ color: features[mod.key as keyof typeof features] ? 'var(--color-success)' : 'var(--color-placeholder)' }}>
                         {features[mod.key as keyof typeof features] ? 'Active' : 'Paused'}
                       </span>
                       <button
                         onClick={() => toggleFeature(mod.key as keyof typeof features)}
                         className="w-10 h-5 rounded-full relative transition-colors duration-[330ms]"
                         style={{ background: features[mod.key as keyof typeof features] ? 'var(--color-electric-blue)' : 'var(--color-pale)' }}
                       >
                         <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-[330ms]"
                           style={{ left: features[mod.key as keyof typeof features] ? 'calc(100% - 18px)' : '2px' }} />
                       </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>

        {SECTIONS.map(section => (
          <Card key={section.title}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-[4px] flex items-center justify-center" style={{ background: '#3E6AE114', color: 'var(--color-electric-blue)' }}>
                {section.icon}
              </div>
              <div>
                <h3 className="text-[17px] font-medium" style={{ color: 'var(--color-heading)' }}>{section.title}</h3>
                <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>{section.description}</p>
              </div>
            </div>

            <div className="space-y-0">
              {section.fields.map((field, i) => (
                <div key={field.label} className="flex flex-col sm:flex-row sm:items-center justify-between py-3 gap-2"
                  style={{ borderBottom: i < section.fields.length - 1 ? '1px solid var(--color-cloud)' : 'none' }}>
                  <span className="text-sm" style={{ color: 'var(--color-body)' }}>{field.label}</span>
                  {field.type === 'toggle' ? (
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium" style={{ color: field.value === 'Enabled' ? 'var(--color-success)' : 'var(--color-placeholder)' }}>{field.value}</span>
                      <button
                        className="w-10 h-5 rounded-full relative transition-colors duration-[330ms]"
                        style={{ background: field.value === 'Enabled' ? 'var(--color-electric-blue)' : 'var(--color-pale)' }}
                      >
                        <div className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all duration-[330ms]"
                          style={{ left: field.value === 'Enabled' ? 'calc(100% - 18px)' : '2px' }} />
                      </button>
                    </div>
                  ) : (
                    <input
                      type="text"
                      defaultValue={field.value}
                      className="text-sm font-medium px-3 py-1.5 rounded-[4px] text-right sm:w-64 w-full transition-all duration-[330ms]"
                      style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
                    />
                  )}
                </div>
              ))}
            </div>
          </Card>
        ))}

        <div className="flex justify-end">
          <button className="px-6 py-2.5 rounded-[4px] text-sm font-medium text-white transition-colors duration-[330ms]" style={{ background: 'var(--color-electric-blue)' }}>
            Save changes
          </button>
        </div>
      </div>
    </DashboardLayout>
  )
}
