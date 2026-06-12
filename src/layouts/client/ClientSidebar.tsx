import type { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, Briefcase, CreditCard, MapPin,
  UtensilsCrossed, FolderLock, FileSignature,
  Layers, Flag, MessageCircle, ClipboardList,
  ChevronsLeft, ChevronsRight, X,
} from 'lucide-react'

export type ClientNavId =
  | 'client-dashboard'
  | 'profil'
  | 'banques'
  | 'mes-clients'
  | 'menus'
  | 'document-vault'
  | 'contracts'
  | 'modules'
  | 'corrections'
  | 'go-live'
  | 'ecoloop'

interface NavItem {
  id: ClientNavId
  label: string
  icon: ReactNode
}

const NAV: NavItem[] = [
  { id: 'client-dashboard', label: 'Dashboard Onboarding',       icon: <LayoutDashboard  size={16} strokeWidth={1.8} /> },
  { id: 'profil',           label: 'Profile',                    icon: <Briefcase        size={16} strokeWidth={1.8} /> },
  { id: 'banques',          label: 'Banks & Banking Information', icon: <CreditCard       size={16} strokeWidth={1.8} /> },
  { id: 'mes-clients',      label: 'My Clients / Establishments', icon: <MapPin           size={16} strokeWidth={1.8} /> },
  { id: 'menus',            label: 'Menus & Packages',           icon: <UtensilsCrossed  size={16} strokeWidth={1.8} /> },
  { id: 'document-vault',   label: 'Document Vault',             icon: <FolderLock       size={16} strokeWidth={1.8} /> },
  { id: 'contracts',        label: 'Contracts & Signatures',     icon: <FileSignature    size={16} strokeWidth={1.8} /> },
  { id: 'modules',          label: 'Modules & Required Setup',   icon: <Layers           size={16} strokeWidth={1.8} /> },
  { id: 'corrections',      label: 'Corrections & Follow-up',   icon: <ClipboardList    size={16} strokeWidth={1.8} /> },
  { id: 'go-live',          label: 'Go-live',                    icon: <Flag             size={16} strokeWidth={1.8} /> },
  { id: 'ecoloop',          label: 'EcoLoop',                    icon: <MessageCircle    size={16} strokeWidth={1.8} /> },
]

const CLIENT_PATHS: Record<ClientNavId, string> = {
  'client-dashboard': '/client/client-dashboard',
  profil:             '/client/profil',
  banques:            '/client/banques',
  'mes-clients':      '/client/mes-clients',
  menus:              '/client/menus',
  'document-vault':   '/client/document-vault',
  contracts:          '/client/contrats',
  modules:            '/client/modules',
  corrections:        '/client/corrections',
  'go-live':          '/client/go-live',
  ecoloop:            '/client/ecoloop',
}

const GLOBAL_PROGRESS = 0

export interface ClientSidebarProps {
  isDesktop: boolean
  collapsed: boolean
  onToggle: () => void
  drawerOpen: boolean
  onDrawerClose: () => void
}

/* ── Shared nav content ─────────────────────────────────── */
function NavContent({ collapsed, onClose }: { collapsed: boolean; onClose?: () => void }) {
  return (
    <>
      {/* Persona card */}
      {!collapsed ? (
        <div className="mx-4 mb-1">
          <div className="rounded-xl px-4 py-4"
            style={{ background: 'linear-gradient(135deg, var(--bg-card), var(--bg-inner))', border: '1px solid var(--border-default)' }}>
            <p className="text-[11px] uppercase tracking-[0.15em] font-bold mb-3" style={{ color: 'var(--text-4)' }}>
              Client Portal
            </p>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0 text-[12px] font-bold"
                style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
                CG
              </div>
              <div className="min-w-0">
                <p className="text-[13.5px] font-semibold leading-tight truncate" style={{ color: 'var(--text-1)' }}>
                  Concept Gourmet
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0" />
                  <p className="text-[12px] leading-tight" style={{ color: 'var(--text-3)' }}>Onboarding</p>
                </div>
              </div>
            </div>
            <div className="mt-3.5 pt-3.5" style={{ borderTop: '1px solid var(--border-subtle)' }}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[11px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                  Progress
                </span>
                <span className="text-[12px] font-bold" style={{ color: 'var(--accent)' }}>
                  {GLOBAL_PROGRESS}%
                </span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border-default)' }}>
                <div className="h-full rounded-full" style={{ width: `${GLOBAL_PROGRESS}%`, background: 'var(--accent)' }} />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-center mb-2">
          <div className="w-9 h-9 rounded-lg flex items-center justify-center text-[12px] font-bold"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
            CG
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 pt-3 pb-4 overflow-y-auto overflow-x-hidden">
        {!collapsed && (
          <p className="px-2 mb-3 text-[11px] uppercase tracking-[0.15em] font-bold" style={{ color: 'var(--text-4)' }}>
            Navigation
          </p>
        )}
        <div className="space-y-0.5">
          {NAV.map(item => {
            if (collapsed) {
              return (
                <div key={item.id} className="flex justify-center">
                  <NavLink
                    to={CLIENT_PATHS[item.id]}
                    title={item.label}
                    className="w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-150"
                    style={({ isActive }) => ({
                      background: isActive ? 'var(--accent-dim)' : 'transparent',
                      color:      isActive ? 'var(--accent)'     : 'var(--text-3)',
                      borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                    })}
                    end>
                    {item.icon}
                  </NavLink>
                </div>
              )
            }

            return (
              <NavLink
                key={item.id}
                to={CLIENT_PATHS[item.id]}
                className="w-full flex items-center gap-3 rounded-xl text-left transition-all duration-150 cursor-pointer"
                style={({ isActive }) => ({
                  padding:    '9px 12px',
                  background: isActive ? 'var(--accent-dim)' : 'transparent',
                  borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
                  color:      isActive ? 'var(--text-1)'     : 'var(--text-3)',
                })}
                onClick={onClose}
                end>
                {({ isActive }) => (
                  <>
                    <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-3)', flexShrink: 0 }}>
                      {item.icon}
                    </span>
                    <span className="flex-1 text-[13px] font-medium leading-snug">
                      {item.label}
                    </span>
                  </>
                )}
              </NavLink>
            )
          })}
        </div>
      </nav>
    </>
  )
}

/* ── ClientSidebar ───────────────────────────────────────── */
export function ClientSidebar({ isDesktop, collapsed, onToggle, drawerOpen, onDrawerClose }: ClientSidebarProps) {

  /* ── Desktop: fixed sidebar ── */
  if (isDesktop) {
    return (
      <aside
        className="fixed left-0 top-[52px] bottom-0 flex flex-col overflow-hidden"
        style={{
          width: collapsed ? 68 : 280,
          background: 'var(--bg-surface)',
          borderRight: '1px solid var(--border-subtle)',
          transition: 'width 260ms cubic-bezier(0.4,0,0.2,1)',
        }}>

        {/* Collapse toggle */}
        <div className="flex items-center mx-3 mt-3 mb-1"
          style={{ justifyContent: collapsed ? 'center' : 'flex-end' }}>
          <button
            onClick={onToggle}
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all cursor-pointer"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)', color: 'var(--text-3)' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--accent-border)'; el.style.color = 'var(--accent)' }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLButtonElement; el.style.borderColor = 'var(--border-default)'; el.style.color = 'var(--text-3)' }}>
            {collapsed
              ? <ChevronsRight size={13} strokeWidth={2.5} />
              : <ChevronsLeft  size={13} strokeWidth={2.5} />}
          </button>
        </div>

        <NavContent collapsed={collapsed} />
      </aside>
    )
  }

  /* ── Mobile: slide-over drawer ── */
  return (
    <aside
      className="fixed top-0 left-0 bottom-0 flex flex-col overflow-hidden"
      style={{
        zIndex: 50,
        width: 280,
        background: 'var(--bg-surface)',
        borderRight: '1px solid var(--border-default)',
        transform:   drawerOpen ? 'translateX(0)' : 'translateX(-100%)',
        visibility:  drawerOpen ? 'visible' : 'hidden',
        transition:  'transform 280ms cubic-bezier(0.4,0,0.2,1), visibility 280ms',
        boxShadow:   drawerOpen ? 'var(--shadow-drawer)' : 'none',
        pointerEvents: drawerOpen ? 'auto' : 'none',
      }}>

      {/* Drawer header */}
      <div
        className="flex items-center justify-between px-4 h-[52px] shrink-0"
        style={{ borderBottom: '1px solid var(--border-subtle)', background: 'var(--bg-surface)' }}>
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[11px] font-bold"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)', color: 'var(--accent)' }}>
            CG
          </div>
          <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>Concept Gourmet</span>
        </div>
        <button
          onClick={onDrawerClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg transition-all cursor-pointer"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)', color: 'var(--text-3)' }}>
          <X size={14} strokeWidth={2.5} />
        </button>
      </div>

      <NavContent collapsed={false} onClose={onDrawerClose} />
    </aside>
  )
}
