import { useState, useEffect } from 'react'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { Building2, Search, Plus, Edit2, ChevronRight, Loader2 } from 'lucide-react'
import { apiClient } from '@/lib/api'
import { AddBuildingModal } from '../components/AddBuildingModal'
import { AddUnitModal } from '../components/AddUnitModal'

// ─────────────────────────────────────────────────────────
// PropertyUnitsPage — Live Backend Integration
// ─────────────────────────────────────────────────────────

const STATUS_MAP: Record<string, 'success' | 'warning' | 'neutral' | 'danger'> = {
  OCCUPIED: 'success',
  RENTED: 'warning',
  VACANT: 'neutral',
}

export default function PropertyUnitsPage() {
  const [search, setSearch] = useState('')
  const [filterWing, setFilterWing] = useState('ALL')
  
  // Real Data State
  const [units, setUnits] = useState<any[]>([])
  const [buildings, setBuildings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // Modals
  const [isAddUnitOpen, setIsAddUnitOpen] = useState(false)
  const [isAddBuildingOpen, setIsAddBuildingOpen] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const [bRes, uRes] = await Promise.all([
        apiClient.get('/property/buildings'),
        apiClient.get('/property/units')
      ])
      setBuildings(bRes.data)
      setUnits(uRes.data)
    } catch (err) {
      console.error('Failed to fetch property data:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Derive wings dynamically from real buildings
  const wings = ['ALL', ...buildings.map((b: any) => b.name)]
  
  // Filter logic
  const filtered = units.filter((u: any) => {
    const flatStr = String(u.flatNumber).toLowerCase()
    const ownerStr = u.residents?.[0]?.name?.toLowerCase() || ''
    const matchSearch = flatStr.includes(search.toLowerCase()) || ownerStr.includes(search.toLowerCase())
    const matchWing = filterWing === 'ALL' || u.building?.name === filterWing
    return matchSearch && matchWing
  })

  // Summary Metrics
  const totalOccupied = units.filter((u: any) => u.occupancy === 'OCCUPIED' || u.occupancy === 'RENTED').length
  const totalVacant = units.filter((u: any) => u.occupancy === 'VACANT').length

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>Property & units</h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>Manage zones, wings, and real flat mappings across the society.</p>
      </div>

      {/* Summary strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Total units', value: units.length },
          { label: 'Occupied/Rented', value: totalOccupied },
          { label: 'Vacant', value: totalVacant },
          { label: 'Buildings (Wings)', value: buildings.length },
        ].map(s => (
          <div key={s.label} className="rounded-[12px] p-4 text-center" style={{ background: 'var(--color-white)' }}>
            <p className="text-2xl font-medium" style={{ color: 'var(--color-heading)' }}>{loading ? '-' : s.value}</p>
            <p className="text-xs mt-1" style={{ color: 'var(--color-tertiary)' }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <Card noPadding>
        <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center gap-3" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
          <div className="relative flex-1 w-full sm:max-w-xs">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--color-placeholder)' }} />
            <input
              type="text"
              placeholder="Search flat or owner..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-[4px] transition-all duration-[330ms]"
              style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
            />
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {wings.map(w => (
              <button
                key={w}
                onClick={() => setFilterWing(w)}
                className="px-3 py-1.5 rounded-[4px] text-xs font-medium transition-colors duration-[330ms]"
                style={{
                  background: filterWing === w ? 'var(--color-electric-blue)' : 'var(--color-light-ash)',
                  color: filterWing === w ? 'white' : 'var(--color-body)',
                }}
              >
                {w === 'ALL' ? 'All wings' : w}
              </button>
            ))}
          </div>

          <div className="ml-auto flex gap-2">
            <button
              onClick={() => setIsAddBuildingOpen(true)}
              className="px-4 py-2 rounded-[4px] text-sm font-medium transition-colors duration-[330ms]"
              style={{ background: 'var(--color-light-ash)', color: 'var(--color-heading)' }}
            >
              Add Building
            </button>
            <button
              onClick={() => setIsAddUnitOpen(true)}
              className="px-4 py-2 rounded-[4px] text-sm font-medium text-white flex items-center gap-1.5 transition-colors duration-[330ms]"
              style={{ background: 'var(--color-electric-blue)' }}
            >
              <Plus size={16} /> Add Unit
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                {['Flat', 'Wing', 'Type', 'Sqft', 'Owner/Tenant', 'Status', ''].map(h => (
                  <th key={h} className="text-left px-4 py-3 font-medium text-xs" style={{ color: 'var(--color-placeholder)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>
                    <div className="flex flex-col items-center justify-center gap-2">
                      <Loader2 className="animate-spin" size={24} style={{ color: 'var(--color-electric-blue)' }} />
                      Loading property data...
                    </div>
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center" style={{ color: 'var(--color-placeholder)' }}>
                    No units found matching your criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((u: any) => {
                  const ownerObj = u.residents?.[0]; // Simplification for MVP
                  
                  return (
                    <tr key={u.id} className="transition-colors duration-[330ms] hover:bg-[#F4F4F4] cursor-pointer" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                      <td className="px-4 py-3 font-medium" style={{ color: 'var(--color-heading)' }}>{u.flatNumber}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{u.building?.name || '—'}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{u.type}</td>
                      <td className="px-4 py-3" style={{ color: 'var(--color-body)' }}>{u.sqft} sq.ft</td>
                      
                      <td className="px-4 py-3">
                        {ownerObj ? (
                           <div>
                             <p className="font-medium leading-none" style={{ color: 'var(--color-heading)' }}>{ownerObj.name}</p>
                             <p className="text-[11px] mt-1" style={{ color: 'var(--color-tertiary)' }}>{ownerObj.phone}</p>
                           </div>
                        ) : (
                           <span style={{ color: 'var(--color-placeholder)' }}>Unassigned</span>
                        )}
                      </td>
                      
                      <td className="px-4 py-3">
                        <Badge variant={STATUS_MAP[u.occupancy] ?? 'neutral'}>{u.occupancy}</Badge>
                      </td>
                      <td className="px-4 py-3">
                        <button className="p-1.5 rounded-[4px] transition-colors duration-[330ms]" style={{ color: 'var(--color-tertiary)' }}>
                          <Edit2 size={14} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
      
      <AddBuildingModal 
        isOpen={isAddBuildingOpen} 
        onClose={() => setIsAddBuildingOpen(false)} 
        onSuccess={fetchData} 
      />
      <AddUnitModal 
        isOpen={isAddUnitOpen} 
        onClose={() => setIsAddUnitOpen(false)} 
        onSuccess={fetchData}
        buildings={buildings}
      />
    </DashboardLayout>
  )
}
