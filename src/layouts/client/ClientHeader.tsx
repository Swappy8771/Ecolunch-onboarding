import { LayoutGrid, LogOut } from 'lucide-react'
import { Link } from 'react-router-dom'

export function ClientHeader() {
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
        <LayoutGrid size={11} strokeWidth={2.5} />
        Portail Client
      </div>

      <div className="flex-1" />

      {/* User identity */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="text-right">
          <div className="text-[12.5px] font-semibold leading-tight" style={{ color: 'var(--text-1)' }}>
            Traiteur — Admin
          </div>
          <div className="text-[9.5px] uppercase tracking-[0.12em] font-semibold mt-[2px]" style={{ color: 'var(--text-4)' }}>
            Concept Gourmet
          </div>
        </div>
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[12px] font-bold shrink-0"
          style={{ background: 'var(--accent)', color: '#07070a' }}
        >
          ET
        </div>
        <div className="w-px h-5 shrink-0" style={{ background: 'var(--border-subtle)' }} />
        <Link to="/admin/dashboard" className="flex items-center gap-1.5 text-[11.5px] shrink-0 hover:opacity-80" style={{ color: 'var(--text-4)' }}>
          <LogOut size={12} strokeWidth={1.8} />
          Portail Admin
        </Link>
      </div>
    </header>
  )
}
