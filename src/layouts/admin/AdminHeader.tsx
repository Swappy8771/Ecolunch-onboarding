import { LayoutGrid, Crown, Settings } from 'lucide-react'
import { Link } from 'react-router-dom'

export function AdminHeader() {
  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 h-[52px] flex items-center px-5 gap-4"
      style={{ background: 'var(--bg-surface)', borderBottom: '1px solid var(--border-subtle)' }}
    >
      {/* Brand */}
      <div className="flex items-center gap-2.5 shrink-0">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--accent)' }}>
          <LayoutGrid size={15} className="text-[#07070a]" strokeWidth={2.5} />
        </div>
        <div>
          <div className="text-[13px] font-bold leading-none tracking-tight" style={{ color: 'var(--text-1)' }}>EcoLunch</div>
          <div className="text-[9.5px] uppercase tracking-[0.14em] font-semibold mt-[3px]" style={{ color: 'var(--text-4)' }}>
            PRS · ONBOARDING
          </div>
        </div>
      </div>

      {/* Portal badge */}
      <div className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[12px] font-semibold shrink-0"
        style={{ background: 'var(--accent)', color: '#07070a' }}>
        <Crown size={11} strokeWidth={2.5} />
        Portail Admin
      </div>

      <div className="flex-1" />

      <Link to="/client/client-dashboard" className="flex items-center gap-1.5 text-[11.5px] shrink-0 transition-colors hover:opacity-80" style={{ color: 'var(--text-4)' }}>
        <Settings size={12} strokeWidth={1.8} />
        Portail Client
      </Link>
    </header>
  )
}
