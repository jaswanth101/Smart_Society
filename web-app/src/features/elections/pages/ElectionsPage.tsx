import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { DashboardLayout } from '@/layouts/DashboardLayout'
import { Card } from '@/components/ui/Card'
import { ShieldCheck, Lock } from 'lucide-react'
import { apiClient } from '@/lib/api'

// ─────────────────────────────────────────────────────────
// ElectionsPage — Tesla-inspired Transition of Power
// ─────────────────────────────────────────────────────────

type Candidate = { id: string; name: string; manifesto: string; role: string; voteCount: number }
type ElectionLive = {
  id: string; title: string; status: string;
  candidates: Candidate[];
  liveStats: { totalFlats: number; votesCast: number; quorumPercentage: number; isQuorumMet: boolean }
}

export default function ElectionsPage() {
  const { tenantId } = useParams<{ tenantId: string }>()
  const [election, setElection] = useState<ElectionLive | null>(null)
  const [handoverConfirm, setHandoverConfirm] = useState(false)
  const [loading, setLoading] = useState(true)

  const fetchLiveElection = async () => {
    try {
      const { data } = await apiClient.get('/elections/active')
      setElection(data)
    } catch (err) {
      console.error('Failed to fetch active election', err)
    } finally {
      setLoading(false)
    }
  }

  // Poll for live votes every 5 seconds
  useEffect(() => {
    if (!tenantId) return
    fetchLiveElection()
    const interval = setInterval(fetchLiveElection, 5000)
    return () => clearInterval(interval)
  }, [tenantId])

  const handleHandover = async () => {
    if (!election) return
    try {
      await apiClient.post(`/elections/${election.id}/resolve`)
      alert("Election sealed and finalized. Manual Role reassignment is now required by Super Admin for safety.")
      fetchLiveElection()
    } catch (err) {
      alert("Failed to resolve election")
    }
  }

  return (
    <DashboardLayout>
      <div className="mb-8">
        <h1 className="text-[40px] font-medium leading-[1.2]" style={{ color: 'var(--color-heading)' }}>
          Digital elections
        </h1>
        <p className="text-sm mt-2" style={{ color: 'var(--color-tertiary)' }}>
          Transition of power and committee handover protocol.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main */}
        <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">
          {/* Quorum */}
          <div className="rounded-[12px] p-8" style={{ background: 'var(--color-carbon-dark)' }}>
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
              <div>
                <span className="text-[11px] font-medium block mb-1" style={{ color: 'var(--color-placeholder)' }}>Live status</span>
                <h2 className="text-[28px] font-medium text-white">
                  {election ? (election.status === 'VOTING_OPEN' ? 'Voting in progress' : 'Election Resolved') : 'No active election'}
                </h2>
                <div className="flex items-center gap-2 mt-2">
                  {election?.status === 'VOTING_OPEN' && <div className="w-2 h-2 rounded-full bg-white animate-pulse" />}
                  <span className="text-sm font-medium text-white">
                    {election ? election.title : 'Standby for inauguration'}
                  </span>
                </div>
              </div>
              <div className="text-left md:text-right">
                <span className="text-[11px] font-medium block mb-1" style={{ color: 'var(--color-placeholder)' }}>Quorum met</span>
                <p className="text-5xl font-medium text-white">
                  {election?.liveStats.quorumPercentage || 0}<span className="text-2xl" style={{ color: 'var(--color-placeholder)' }}>%</span>
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--color-placeholder)' }}>
                  {election?.liveStats.votesCast || 0}/{election?.liveStats.totalFlats || 0} flats voted
                </p>
              </div>
            </div>
          </div>

          {/* Leaderboard */}
          <Card title="Live leaderboard">
            <div className="mt-2 space-y-0">
              {!election || election.candidates.length === 0 ? (
                <p className="py-4 text-sm text-slate-500">No candidates polling data yet.</p>
              ) : (
                election.candidates.map((candidate, i) => (
                  <div key={candidate.id} className="flex items-center justify-between py-4" style={{ borderBottom: '1px solid var(--color-cloud)' }}>
                    <div className="flex items-center gap-4">
                      <div
                        className="w-10 h-10 rounded-[4px] flex items-center justify-center font-medium"
                        style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
                      >
                        {i + 1}
                      </div>
                      <div>
                        <p className="text-[17px] font-medium leading-none mb-1" style={{ color: 'var(--color-heading)' }}>{candidate.name}</p>
                        <p className="text-sm" style={{ color: 'var(--color-tertiary)' }}>{candidate.manifesto || 'Candidate'}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[17px] font-medium" style={{ color: 'var(--color-heading)' }}>{candidate.voteCount}</span>
                      <span className="text-[11px] block mt-0.5" style={{ color: 'var(--color-placeholder)' }}>votes</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Handover */}
        <div className="col-span-1">
          <Card className="h-full sticky top-24" noPadding>
            <div className="p-6 md:p-8 flex flex-col h-full items-center text-center">
              <div
                className="w-20 h-20 rounded-[4px] flex items-center justify-center mb-6"
                style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
              >
                <ShieldCheck size={40} />
              </div>

              <h3 className="text-[22px] font-medium mb-2" style={{ color: 'var(--color-heading)' }}>
                Handover protocol
              </h3>
              <p className="text-sm leading-relaxed mb-8" style={{ color: 'var(--color-tertiary)' }}>
                Ratify the election results and transfer the president root access token to the winning candidate.
              </p>

              {!handoverConfirm ? (
                <button
                  onClick={() => setHandoverConfirm(true)}
                  disabled={!election || election.status !== 'VOTING_OPEN'}
                  className="w-full mt-auto py-3 rounded-[4px] font-medium text-sm transition-colors duration-[330ms] disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: 'var(--color-white)', color: 'var(--color-heading)', border: '1px solid var(--color-cloud)' }}
                >
                  Initiate handover
                </button>
              ) : (
                <div className="w-full mt-auto flex flex-col gap-3 p-4 rounded-[4px]" style={{ background: 'var(--color-light-ash)' }}>
                  <p className="text-xs font-medium flex items-center justify-center gap-1" style={{ color: '#ef4444' }}>
                    <Lock size={12} /> Confirm action
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-tertiary)' }}>This action seals the election. Manual re-assignment required.</p>
                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => setHandoverConfirm(false)}
                      className="flex-1 py-2 text-sm rounded-[4px] font-medium transition-colors duration-[330ms]"
                      style={{ border: '1px solid var(--color-cloud)', color: 'var(--color-heading)' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleHandover}
                      className="flex-1 py-2 text-sm rounded-[4px] font-medium text-white transition-colors duration-[330ms]"
                      style={{ background: 'var(--color-electric-blue)' }}
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  )
}
