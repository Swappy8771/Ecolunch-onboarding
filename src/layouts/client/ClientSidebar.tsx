import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, CreditCard, MapPin,
  UtensilsCrossed, FolderInput, FolderLock,
  ClipboardCheck, Layers, Flag, MessageCircle,
} from 'lucide-react'

export type ClientNavId =
  | 'client-dashboard' | 'profil' | 'banques' | 'mes-clients'
  | 'menus' | 'smart-import' | 'document-vault'
  | 'validation' | 'modules' | 'go-live' | 'ecoloop'

interface NavItem { id: ClientNavId; label: string; icon: ReactNode }

const NAV: NavItem[] = [
  { id: 'client-dashboard', label: 'Dashboard Onboarding',        icon: <LayoutDashboard  size={15} strokeWidth={1.8} /> },
  { id: 'profil',           label: 'Profil',                      icon: <Briefcase         size={15} strokeWidth={1.8} /> },
  { id: 'banques',          label: 'Banques & informations ba…',   icon: <CreditCard        size={15} strokeWidth={1.8} /> },
  { id: 'mes-clients',      label: 'Mes clients',                  icon: <MapPin            size={15} strokeWidth={1.8} /> },
  { id: 'menus',            label: 'Menus & Forfaits',             icon: <UtensilsCrossed   size={15} strokeWidth={1.8} /> },
  { id: 'smart-import',     label: 'Smart Import',                 icon: <FolderInput       size={15} strokeWidth={1.8} /> },
  { id: 'document-vault',   label: 'Document Vault',               icon: <FolderLock        size={15} strokeWidth={1.8} /> },
  { id: 'validation',       label: 'Validation & Corrections',     icon: <ClipboardCheck    size={15} strokeWidth={1.8} /> },
  { id: 'modules',          label: 'Modules',                      icon: <Layers            size={15} strokeWidth={1.8} /> },
  { id: 'go-live',          label: 'Go-live',                      icon: <Flag              size={15} strokeWidth={1.8} /> },
  { id: 'ecoloop',          label: 'EcoLoop',                      icon: <MessageCircle     size={15} strokeWidth={1.8} /> },
]

const CLIENT_PATHS: Record<ClientNavId, string> = {
  'client-dashboard': '/client/client-dashboard',
  profil: '/client/profil',
  banques: '/client/banques',
  'mes-clients': '/client/mes-clients',
  menus: '/client/menus',
  'smart-import': '/client/smart-import',
  'document-vault': '/client/document-vault',
  validation: '/client/validation',
  modules: '/client/modules',
  'go-live': '/client/go-live',
  ecoloop: '/client/ecoloop',
}

export function ClientSidebar() {
  return (
    <aside
      className="fixed left-0 top-[52px] bottom-0 w-[232px] flex flex-col overflow-y-auto"
      style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)' }}
    >
      {/* Persona card — client identity */}
      <div className="mx-3 mt-3 mb-1">
        <div
          className="rounded-xl px-3.5 py-3"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
        >
          <p className="text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
            Persona
          </p>
          <div className="flex items-start gap-2">
            {/* Amber dot for client */}
            <div className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[#fbbf24] shrink-0" />
            <div>
              <p className="text-[12.5px] font-semibold leading-tight" style={{ color: 'var(--text-1)' }}>
                Traiteur — Admin
              </p>
              <p className="text-[11px] mt-[3px] leading-tight" style={{ color: 'var(--text-4)' }}>
                Concept Gourmet
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 pt-4 pb-2">
        <p className="px-3 mb-2 text-[9.5px] uppercase tracking-[0.13em] font-semibold" style={{ color: 'var(--text-4)' }}>
          Espace Traiteur
        </p>
        <div className="space-y-0.5">
          {NAV.map(item => (
            <NavLink
              key={item.id}
              to={CLIENT_PATHS[item.id]}
              className="w-full flex items-center gap-2.5 rounded-lg text-left transition-all cursor-pointer"
              style={({ isActive }) => ({
                padding: '8px 12px',
                background: isActive ? 'var(--accent-dim)' : 'transparent',
                borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                color: isActive ? 'var(--text-1)' : 'var(--text-3)',
              })}
              end
            >
              {({ isActive }) => (
                <>
                  <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-4)', flexShrink: 0 }}>
                    {item.icon}
                  </span>
                  <span className="flex-1 text-[12.5px] font-medium truncate">{item.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>
    </aside>
  )
}
