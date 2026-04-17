import { Link } from 'react-router-dom'
import { ShieldX } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// UnauthorizedPage (/403-unauthorized)
// Shown when a user tries to access a route outside their role.
// ─────────────────────────────────────────────────────────
export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
      <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mb-6">
        <ShieldX size={40} color="#DC2626" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">403 — Access Denied</h1>
      <p className="text-slate-500 max-w-sm mb-8">
        You don't have permission to view this page.<br />
        Contact your society administrator if this is a mistake.
      </p>
      <Link
        to="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Go to Login
      </Link>
    </div>
  )
}
