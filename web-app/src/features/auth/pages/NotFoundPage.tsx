import { Link } from 'react-router-dom'
import { SearchX } from 'lucide-react'

// ─────────────────────────────────────────────────────────
// NotFoundPage (/404-not-found) — Standard fallback.
// ─────────────────────────────────────────────────────────
export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 text-center px-6">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-6">
        <SearchX size={40} color="#2563eb" />
      </div>
      <h1 className="text-3xl font-bold text-slate-900 mb-2">404 — Page Not Found</h1>
      <p className="text-slate-500 max-w-sm mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        to="/login"
        className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
      >
        Back to Home
      </Link>
    </div>
  )
}
