import { useMemo, useState, type ReactNode } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Users, UserCheck,
  ClipboardCheck, FolderInput, FolderLock,
  MessageCircle, SlidersHorizontal, ChevronDown, Check,
} from 'lucide-react'

export type NavItemId =
  | 'dashboard' | 'onboarding' | 'traiteurs'
  | 'centre-validation' | 'centre-import' | 'document-vault' | 'ecoloop' | 'modules'

interface NavChild  { id: NavItemId; label: string; icon: ReactNode }
interface NavSection { id: NavItemId; label: string; icon: ReactNode; children?: NavChild[] }

const NAV: NavSection[] = [
  { id: 'dashboard',         label: 'Dashboard',                  icon: <LayoutDashboard size={15} strokeWidth={1.8} /> },
  {
    id: 'onboarding', label: 'Onboarding', icon: <Users size={15} strokeWidth={1.8} />,
    children: [
      { id: 'traiteurs',  label: 'Traiteurs',  icon: <UserCheck size={13} strokeWidth={1.8} /> },
    ],
  },
  { id: 'centre-validation', label: 'Centre de validation',       icon: <ClipboardCheck   size={15} strokeWidth={1.8} /> },
  { id: 'centre-import',     label: "Centre d'import / Smart Im…",icon: <FolderInput      size={15} strokeWidth={1.8} /> },
  { id: 'document-vault',    label: 'Document Vault',             icon: <FolderLock       size={15} strokeWidth={1.8} /> },
  { id: 'ecoloop',           label: 'EcoLoop',                    icon: <MessageCircle    size={15} strokeWidth={1.8} /> },
  { id: 'modules',           label: 'Modules / Configurations',   icon: <SlidersHorizontal size={15} strokeWidth={1.8} /> },
]

const PERMISSIONS = ['Création client', 'Configuration tiles', 'Demande corrections', 'Smart Import']

/* ── Nav row ────────────────────────────────────────────── */

function NavButtonRow({
  icon, label, isActive, hasChildren, isExpanded, depth = 0, onClick,
}: {
  icon: ReactNode; label: string; isActive: boolean
  hasChildren?: boolean; isExpanded?: boolean; depth?: number; onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-2.5 rounded-lg text-left transition-all cursor-pointer"
      style={{
        padding: depth === 1 ? '7px 12px 7px 36px' : '8px 12px',
        background: isActive ? 'var(--accent-dim)' : 'transparent',
        borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
        color: isActive ? 'var(--text-1)' : 'var(--text-3)',
      }}
    >
      <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-4)', flexShrink: 0 }}>
        {icon}
      </span>
      <span className="flex-1 text-[12.5px] font-medium truncate">{label}</span>
      {hasChildren && (
        <ChevronDown
          size={13} strokeWidth={2}
          className={`shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
          style={{ color: 'var(--text-4)' }}
        />
      )}
    </button>
  )
}

function NavLinkRow({
  to, icon, label, depth = 0,
}: {
  to: string; icon: ReactNode; label: string; depth?: number
}) {
  return (
    <NavLink
      to={to}
      className="w-full flex items-center gap-2.5 rounded-lg text-left transition-all cursor-pointer"
      style={({ isActive }) => ({
        padding: depth === 1 ? '7px 12px 7px 36px' : '8px 12px',
        background: isActive ? 'var(--accent-dim)' : 'transparent',
        borderLeft: isActive ? '2px solid var(--accent)' : '2px solid transparent',
        color: isActive ? 'var(--text-1)' : 'var(--text-3)',
      })}
      end
    >
      {({ isActive }) => (
        <>
          <span style={{ color: isActive ? 'var(--accent)' : 'var(--text-4)', flexShrink: 0 }}>
            {icon}
          </span>
          <span className="flex-1 text-[12.5px] font-medium truncate">{label}</span>
        </>
      )}
    </NavLink>
  )
}

/* ── Sidebar ────────────────────────────────────────────── */

const ADMIN_PATHS: Partial<Record<NavItemId, string>> = {
  dashboard: '/admin/dashboard',
  traiteurs: '/admin/traiteurs',
  'centre-validation': '/admin/centre-validation',
  'centre-import': '/admin/centre-import',
  'document-vault': '/admin/document-vault',
  ecoloop: '/admin/ecoloop',
  modules: '/admin/modules',
}

function inferActiveAdminNavId(pathname: string): NavItemId {
  if (pathname.startsWith('/admin/traiteurs')) return 'traiteurs'
  if (pathname.startsWith('/admin/centre-validation')) return 'centre-validation'
  if (pathname.startsWith('/admin/centre-import')) return 'centre-import'
  if (pathname.startsWith('/admin/document-vault')) return 'document-vault'
  if (pathname.startsWith('/admin/ecoloop')) return 'ecoloop'
  if (pathname.startsWith('/admin/modules')) return 'modules'
  return 'dashboard'
}

export function Sidebar() {
  const [expanded, setExpanded] = useState<Set<NavItemId>>(new Set(['onboarding']))
  const { pathname } = useLocation()
  const activeItem = useMemo(() => inferActiveAdminNavId(pathname), [pathname])

  function toggle(id: NavItemId) {
    setExpanded(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  return (
    /* Layer 1 — surface */
    <aside
      className="fixed left-0 top-[52px] bottom-0 w-[232px] flex flex-col overflow-y-auto"
      style={{ background: 'var(--bg-surface)', borderRight: '1px solid var(--border-subtle)' }}
    >
      {/* Persona card */}
      <div className="mx-3 mt-3 mb-1">
        <div
          className="rounded-xl px-3.5 py-3"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
        >
          <p className="text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-2" style={{ color: 'var(--text-4)' }}>
            Persona
          </p>
          <div className="flex items-start gap-2">
            <div className="mt-[5px] w-1.5 h-1.5 rounded-full bg-[#4ade80] shrink-0" />
            <div>
              <p className="text-[12.5px] font-semibold leading-tight" style={{ color: 'var(--text-1)' }}>
                Onboarding Admin
              </p>
              <p className="text-[11px] mt-[3px] leading-tight" style={{ color: 'var(--text-4)' }}>
                Pilote l'embarquement client
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 pt-4 pb-2">
        <p className="px-3 mb-2 text-[9.5px] uppercase tracking-[0.13em] font-semibold" style={{ color: 'var(--text-4)' }}>
          EcoLunch Admin
        </p>
        <div className="space-y-0.5">
          {NAV.map((item) => {
            const isExpanded = expanded.has(item.id)
            const itemPath = ADMIN_PATHS[item.id]
            return (
              <div key={item.id}>
                {item.children?.length ? (
                  <NavButtonRow
                    icon={item.icon} label={item.label}
                    isActive={item.id === activeItem}
                    hasChildren
                    isExpanded={isExpanded}
                    onClick={() => toggle(item.id)}
                  />
                ) : itemPath ? (
                  <NavLinkRow to={itemPath} icon={item.icon} label={item.label} />
                ) : (
                  <NavButtonRow
                    icon={item.icon} label={item.label}
                    isActive={item.id === activeItem}
                    onClick={() => {}}
                  />
                )}
                {item.children && isExpanded && (
                  <div className="mt-0.5 space-y-0.5">
                    {item.children.map(child => (
                      <NavLinkRow
                        key={child.id}
                        to={ADMIN_PATHS[child.id] ?? '/admin/dashboard'}
                        icon={child.icon}
                        label={child.label}
                        depth={1}
                      />
                    ))}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </nav>

      {/* Permissions */}
      <div className="mx-3 mb-3">
        <div
          className="rounded-xl px-3.5 py-3"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
        >
          <p className="text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-2.5" style={{ color: 'var(--text-4)' }}>
            Permissions ({PERMISSIONS.length})
          </p>
          <div className="space-y-2">
            {PERMISSIONS.map(p => (
              <div key={p} className="flex items-center gap-2">
                <Check size={10} strokeWidth={3} style={{ color: 'var(--accent)', flexShrink: 0 }} />
                <span className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>{p}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  )
}
