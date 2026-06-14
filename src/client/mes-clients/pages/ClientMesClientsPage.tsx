import { type ReactNode } from 'react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import { RowMenu } from '../../../shared/components/DropdownMenu'
import {
  BookOpen, Baby, Tent,
  GraduationCap, Building2, Users, CalendarDays,
  Plus, Edit3, Trash2, Eye, Upload,
  Phone, Mail, MapPin, Lock,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ──────────────────────────────────────────────────

type SchoolType     = 'public' | 'private'
type DaycareType    = 'CPE' | 'Daycare' | 'Garderie'
type EntityStatus   = 'active' | 'pending' | 'incomplete'
type CalendarStatus = 'approved' | 'pending' | 'missing'

interface School {
  id: string; name: string; address: string; city: string
  type: SchoolType; cssId: string | null; cssName: string | null; status: EntityStatus
}
interface CSSDistrict {
  id: string; name: string; municipality: string; contactName: string; schoolCount: number; status: EntityStatus
}
interface Contact {
  id: string; name: string; entityName: string; role: string; email: string; phone: string
}
interface ClosureCalendar {
  id: string; name: string; linkedTo: string; year: string; uploadDate: string | null; status: CalendarStatus
}
interface Daycare {
  id: string; name: string; type: DaycareType; address: string; city: string; capacity: number; status: EntityStatus
}

// ─── Active module config ────────────────────────────────────

const ACTIVE_MODULES = { schoolMeals: true, daycare: true, campMeals: false } as const

// ─── Meta maps ───────────────────────────────────────────────

const ENTITY_META: Record<EntityStatus, { label: string; color: string; bg: string; border: string }> = {
  active:     { label: 'Active',     color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)'  },
  pending:    { label: 'Pending',    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  },
  incomplete: { label: 'Incomplete', color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
}

const CALENDAR_META: Record<CalendarStatus, { label: string; color: string; bg: string; border: string }> = {
  approved: { label: 'Approved', color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)'  },
  pending:  { label: 'Pending',  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  },
  missing:  { label: 'Missing',  color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
}

const SCHOOL_TYPE_META: Record<SchoolType, { label: string; color: string; bg: string; border: string }> = {
  public:  { label: 'Public',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)'  },
  private: { label: 'Private', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)' },
}

const DAYCARE_TYPE_META: Record<DaycareType, { label: string; color: string; bg: string; border: string }> = {
  CPE:      { label: 'CPE',      color: 'var(--accent)', bg: 'var(--accent-dim)',        border: 'var(--accent-border)'   },
  Daycare:  { label: 'Daycare',  color: '#60a5fa',        bg: 'rgba(96,165,250,0.12)',    border: 'rgba(96,165,250,0.25)'  },
  Garderie: { label: 'Garderie', color: '#fbbf24',        bg: 'rgba(251,191,36,0.12)',    border: 'rgba(251,191,36,0.25)'  },
}

// ─── Mock data ───────────────────────────────────────────────

const SCHOOLS: School[] = [
  { id: 's1', name: 'École Primaire Les Lilas',    address: '12 Rue des Lilas',           city: 'Paris 19e', type: 'public',  cssId: 'css1', cssName: 'Paris Centrale CSS', status: 'active'     },
  { id: 's2', name: 'Collège Molière',              address: '8 Avenue Molière',           city: 'Paris 16e', type: 'public',  cssId: 'css2', cssName: 'Paris Ouest CSS',    status: 'active'     },
  { id: 's3', name: 'École Privée Saint-Exupéry',  address: '3 Rue A. de Saint-Exupéry', city: 'Paris 14e', type: 'private', cssId: null,   cssName: null,                 status: 'pending'    },
  { id: 's4', name: 'École Jean Moulin',            address: '27 Bd Jean Moulin',         city: 'Paris 13e', type: 'public',  cssId: 'css3', cssName: 'Paris Sud CSS',      status: 'active'     },
]

const CSS_DISTRICTS: CSSDistrict[] = [
  { id: 'css1', name: 'Paris Centrale CSS', municipality: 'Paris 11e — 19e', contactName: 'Bertrand Noir', schoolCount: 2, status: 'active'  },
  { id: 'css2', name: 'Paris Ouest CSS',    municipality: 'Paris 15e — 16e', contactName: 'Claire Petit',  schoolCount: 1, status: 'active'  },
  { id: 'css3', name: 'Paris Sud CSS',      municipality: 'Paris 13e — 14e', contactName: 'Marc Durand',   schoolCount: 1, status: 'pending' },
]

const SCHOOL_CONTACTS: Contact[] = [
  { id: 'sc1', name: 'Sophie Laurent',    entityName: 'École Primaire Les Lilas',   role: 'Principal',    email: 's.laurent@ep-lilas.edu',  phone: '+33 1 42 11 22 33' },
  { id: 'sc2', name: 'Jean-Paul Martin',  entityName: 'Collège Molière',             role: 'Admin Coord.', email: 'jp.martin@moliere.edu',   phone: '+33 1 43 22 33 44' },
  { id: 'sc3', name: 'Isabelle Rousseau', entityName: 'École Privée Saint-Exupéry', role: 'Director',     email: 'i.rousseau@saint-ex.edu', phone: '+33 1 44 33 44 55' },
]

const SCHOOL_CALENDARS: ClosureCalendar[] = [
  { id: 'cal1', name: 'Paris Centrale CSS 2025-26',    linkedTo: 'Paris Centrale CSS',           year: '2025–26', uploadDate: '2025-09-01', status: 'approved' },
  { id: 'cal2', name: 'Collège Molière 2025-26',        linkedTo: 'Collège Molière',              year: '2025–26', uploadDate: '2025-09-05', status: 'pending'  },
  { id: 'cal3', name: 'École Saint-Exupéry Calendar',  linkedTo: 'École Privée Saint-Exupéry',   year: '2025–26', uploadDate: null,         status: 'missing'  },
]

const DAYCARES: Daycare[] = [
  { id: 'd1', name: 'CPE Les Petits Chaperons', type: 'CPE',      address: '15 Rue Gambetta',     city: 'Paris 20e', capacity: 45, status: 'active'  },
  { id: 'd2', name: 'Garderie Soleil',           type: 'Garderie', address: '7 Avenue de Flandre', city: 'Paris 19e', capacity: 22, status: 'active'  },
  { id: 'd3', name: 'CPE Arc-en-Ciel',           type: 'CPE',      address: '31 Rue Rébeval',      city: 'Paris 19e', capacity: 60, status: 'pending' },
]

const DAYCARE_CONTACTS: Contact[] = [
  { id: 'dc1', name: 'Nathalie Morin',  entityName: 'CPE Les Petits Chaperons', role: 'Director',    email: 'n.morin@cpe-chaperons.fr', phone: '+33 1 45 11 22 33' },
  { id: 'dc2', name: 'Pierre Fontaine', entityName: 'Garderie Soleil',           role: 'Coordinator', email: 'p.fontaine@soleil.fr',     phone: '+33 1 46 22 33 44' },
  { id: 'dc3', name: 'Amélie Girard',   entityName: 'CPE Arc-en-Ciel',           role: 'Director',    email: 'a.girard@arcenciel.fr',    phone: '+33 1 47 33 44 55' },
]

const DAYCARE_CALENDARS: ClosureCalendar[] = [
  { id: 'dcal1', name: 'CPE Chaperons 2025-26',   linkedTo: 'CPE Les Petits Chaperons', year: '2025–26', uploadDate: '2025-08-28', status: 'approved' },
  { id: 'dcal2', name: 'Garderie Soleil 2025-26', linkedTo: 'Garderie Soleil',           year: '2025–26', uploadDate: null,         status: 'missing'  },
  { id: 'dcal3', name: 'CPE Arc-en-Ciel 2025-26', linkedTo: 'CPE Arc-en-Ciel',           year: '2025–26', uploadDate: null,         status: 'missing'  },
]

// ─── Shared micro-components ─────────────────────────────────

function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  )
}


function ColHeader({ label }: { label: string }) {
  return (
    <span className="text-[10.5px] uppercase tracking-[0.11em] font-bold" style={{ color: 'var(--text-4)' }}>
      {label}
    </span>
  )
}

function EmptyState({ label }: { label: string }) {
  return (
    <div className="flex flex-col items-center gap-2.5 py-10 px-5 text-center">
      <div className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
        <Plus size={18} strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
      </div>
      <p className="text-[12.5px] font-semibold" style={{ color: 'var(--text-3)' }}>No {label} added yet</p>
      <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>Use the Add button above to get started</p>
    </div>
  )
}

// ─── SubSectionCard ──────────────────────────────────────────

interface SubSectionCardProps {
  Icon: LucideIcon; title: string; count: number; addLabel: string; children: ReactNode
}

function SubSectionCard({ Icon, title, count, addLabel, children }: SubSectionCardProps) {
  return (
    <div className="rounded-2xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', overflow: 'hidden' }}>

      {/* Section header */}
      <div className="flex items-center justify-between px-5 py-3.5"
        style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-2.5">
          <Icon size={14} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          <h3 className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>{title}</h3>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: 'var(--bg-card)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
            {count}
          </span>
        </div>
        <button
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer transition-opacity hover:opacity-90 shrink-0"
          style={{ background: 'var(--accent)', color: '#07070a' }}>
          <Plus size={12} strokeWidth={2.5} />
          {addLabel}
        </button>
      </div>

      {children}
    </div>
  )
}

// ─── ModuleSection wrapper ───────────────────────────────────

function ModuleSection({ Icon, title, accentColor, children }: {
  Icon: LucideIcon; title: string; accentColor: string; children: ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      {/* Module identity strip */}
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
        style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderLeft: `3px solid ${accentColor}`,
        }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}>
          <Icon size={15} strokeWidth={1.8} style={{ color: accentColor }} />
        </div>
        <h2 className="text-[15px] font-black flex-1" style={{ color: 'var(--text-1)' }}>{title}</h2>
        <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
          style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80', flexShrink: 0 }} />
          Active Module
        </span>
      </div>
      {/* Sub-sections */}
      <div className="flex flex-col gap-4 pl-4 border-l-2" style={{ borderColor: `${accentColor}30` }}>
        {children}
      </div>
    </section>
  )
}

// ─── Inactive module placeholder ─────────────────────────────

function InactiveModule({ Icon, title, description }: { Icon: LucideIcon; title: string; description: string }) {
  return (
    <section>
      <div className="flex items-start gap-4 px-5 py-5 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: '3px solid var(--border-strong)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
          <Icon size={16} strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <h2 className="text-[15px] font-black" style={{ color: 'var(--text-3)' }}>{title}</h2>
            <span className="flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
              <Lock size={9} strokeWidth={2.5} />
              Not Activated
            </span>
          </div>
          <p className="text-[12px]" style={{ color: 'var(--text-4)' }}>{description}</p>
        </div>
        <button
          className="text-[12px] font-semibold cursor-pointer shrink-0 transition-opacity hover:opacity-80"
          style={{ color: 'var(--accent)' }}>
          Activate →
        </button>
      </div>
    </section>
  )
}

// ─── Schools section ─────────────────────────────────────────

const SCHOOLS_COLS    = '2fr 72px 100px 140px 85px 40px'
const SCHOOLS_HEADERS = ['School Name', 'Type', 'City', 'CSS / District', 'Status', 'Actions']

function SchoolsSection() {
  if (SCHOOLS.length === 0) {
    return (
      <SubSectionCard Icon={GraduationCap} title="Schools" count={0} addLabel="Add School">
        <EmptyState label="schools" />
      </SubSectionCard>
    )
  }

  return (
    <SubSectionCard Icon={GraduationCap} title="Schools" count={SCHOOLS.length} addLabel="Add School">
      {/* Desktop header */}
      <div className="hidden md:grid px-5 py-2.5 gap-3"
        style={{ gridTemplateColumns: SCHOOLS_COLS, background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        {SCHOOLS_HEADERS.map(h => <ColHeader key={h} label={h} />)}
      </div>

      {SCHOOLS.map((school, idx) => {
        const tm = SCHOOL_TYPE_META[school.type]
        const em = ENTITY_META[school.status]
        const border = idx < SCHOOLS.length - 1 ? '1px solid var(--border-subtle)' : 'none'
        return (
          <div key={school.id} style={{ borderBottom: border }}>
            {/* Desktop row */}
            <div className="hidden md:grid items-center px-5 py-3.5 gap-3"
              style={{ gridTemplateColumns: SCHOOLS_COLS }}>
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{school.name}</p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-4)' }}>{school.address}</p>
              </div>
              <Badge {...tm} />
              <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{school.city}</span>
              {school.cssName
                ? <span className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{school.cssName}</span>
                : <span className="text-[11.5px] italic" style={{ color: 'var(--text-4)' }}>Not linked</span>}
              <Badge {...em} />
              <RowMenu actions={[
                { label: 'View',   icon: <Eye   size={12} strokeWidth={2} /> },
                { label: 'Edit',   icon: <Edit3 size={12} strokeWidth={2} /> },
                { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171' },
              ]} minWidth="140px" />
            </div>

            {/* Mobile card */}
            <div className="md:hidden px-4 py-4 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold" style={{ color: 'var(--text-1)' }}>{school.name}</p>
                  <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                    <MapPin size={10} strokeWidth={2} />{school.address} · {school.city}
                  </p>
                </div>
                <Badge {...em} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge {...tm} />
                {school.cssName && (
                  <span className="text-[11px] font-medium px-2 py-0.5 rounded"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                    {school.cssName}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <RowMenu actions={[
                  { label: 'View',   icon: <Eye   size={12} strokeWidth={2} /> },
                  { label: 'Edit',   icon: <Edit3 size={12} strokeWidth={2} /> },
                  { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171' },
                ]} minWidth="140px" />
              </div>
            </div>
          </div>
        )
      })}
    </SubSectionCard>
  )
}

// ─── CSS / School Districts section ──────────────────────────

const CSS_COLS    = '1fr 130px 120px 70px 85px 40px'
const CSS_HEADERS = ['District Name', 'Municipality', 'Contact', 'Schools', 'Status', 'Actions']

function CSSDistrictsSection() {
  if (CSS_DISTRICTS.length === 0) {
    return (
      <SubSectionCard Icon={Building2} title="CSS / School Districts" count={0} addLabel="Add District">
        <EmptyState label="CSS districts" />
      </SubSectionCard>
    )
  }

  return (
    <SubSectionCard Icon={Building2} title="CSS / School Districts" count={CSS_DISTRICTS.length} addLabel="Add District">
      <div className="hidden md:grid px-5 py-2.5 gap-3"
        style={{ gridTemplateColumns: CSS_COLS, background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        {CSS_HEADERS.map(h => <ColHeader key={h} label={h} />)}
      </div>

      {CSS_DISTRICTS.map((css, idx) => {
        const em = ENTITY_META[css.status]
        const border = idx < CSS_DISTRICTS.length - 1 ? '1px solid var(--border-subtle)' : 'none'
        return (
          <div key={css.id} style={{ borderBottom: border }}>
            {/* Desktop */}
            <div className="hidden md:grid items-center px-5 py-3.5 gap-3"
              style={{ gridTemplateColumns: CSS_COLS }}>
              <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{css.name}</p>
              <span className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{css.municipality}</span>
              <span className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{css.contactName}</span>
              <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>
                {css.schoolCount} school{css.schoolCount !== 1 ? 's' : ''}
              </span>
              <Badge {...em} />
              <RowMenu actions={[
                { label: 'Edit',   icon: <Edit3 size={12} strokeWidth={2} /> },
                { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171' },
              ]} minWidth="130px" />
            </div>

            {/* Mobile */}
            <div className="md:hidden px-4 py-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <p className="text-[13px] font-bold" style={{ color: 'var(--text-1)' }}>{css.name}</p>
                <Badge {...em} />
              </div>
              <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
                {css.municipality} · {css.contactName} · {css.schoolCount} schools
              </p>
              <div className="pt-0.5">
                <RowMenu actions={[
                  { label: 'Edit',   icon: <Edit3 size={12} strokeWidth={2} /> },
                  { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171' },
                ]} minWidth="130px" />
              </div>
            </div>
          </div>
        )
      })}
    </SubSectionCard>
  )
}

// ─── Contacts section (shared for school + daycare) ──────────

const CONTACTS_COLS    = '130px 1fr 100px 1fr 40px'
const CONTACTS_HEADERS = ['Name', 'Establishment', 'Role', 'Email', '']

function ContactsSection({ contacts, title, addLabel }: {
  contacts: Contact[]; title: string; addLabel: string
}) {
  if (contacts.length === 0) {
    return (
      <SubSectionCard Icon={Users} title={title} count={0} addLabel={addLabel}>
        <EmptyState label="contacts" />
      </SubSectionCard>
    )
  }

  return (
    <SubSectionCard Icon={Users} title={title} count={contacts.length} addLabel={addLabel}>
      <div className="hidden lg:grid px-5 py-2.5 gap-3"
        style={{ gridTemplateColumns: CONTACTS_COLS, background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        {CONTACTS_HEADERS.map(h => <ColHeader key={h} label={h} />)}
      </div>

      {contacts.map((c, idx) => {
        const border = idx < contacts.length - 1 ? '1px solid var(--border-subtle)' : 'none'
        return (
          <div key={c.id} style={{ borderBottom: border }}>
            {/* Desktop */}
            <div className="hidden lg:grid items-center px-5 py-3.5 gap-3"
              style={{ gridTemplateColumns: CONTACTS_COLS }}>
              <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{c.name}</p>
              <p className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{c.entityName}</p>
              <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-lg"
                style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                {c.role}
              </span>
              <p className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{c.email}</p>
              <RowMenu actions={[
                { label: 'Edit',   icon: <Edit3 size={12} strokeWidth={2} /> },
                { label: 'Call',   icon: <Phone size={12} strokeWidth={2} />, onClick: () => window.open(`tel:${c.phone}`) },
                { label: 'Email',  icon: <Mail  size={12} strokeWidth={2} />, onClick: () => window.open(`mailto:${c.email}`) },
                { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171' },
              ]} minWidth="150px" />
            </div>

            {/* Mobile card */}
            <div className="lg:hidden px-4 py-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2 flex-wrap">
                <div>
                  <p className="text-[13px] font-bold" style={{ color: 'var(--text-1)' }}>{c.name}</p>
                  <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>{c.entityName}</p>
                </div>
                <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-lg"
                  style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                  {c.role}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-[11.5px] flex items-center gap-1.5" style={{ color: 'var(--text-4)' }}>
                  <Mail size={11} strokeWidth={2} />{c.email}
                </p>
                <p className="text-[11.5px] flex items-center gap-1.5" style={{ color: 'var(--text-4)' }}>
                  <Phone size={11} strokeWidth={2} />{c.phone}
                </p>
              </div>
              <div className="pt-0.5">
                <RowMenu actions={[
                  { label: 'Edit',   icon: <Edit3 size={12} strokeWidth={2} /> },
                  { label: 'Call',   icon: <Phone size={12} strokeWidth={2} />, onClick: () => window.open(`tel:${c.phone}`) },
                  { label: 'Email',  icon: <Mail  size={12} strokeWidth={2} />, onClick: () => window.open(`mailto:${c.email}`) },
                  { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171' },
                ]} minWidth="150px" />
              </div>
            </div>
          </div>
        )
      })}
    </SubSectionCard>
  )
}

// ─── Calendars section (shared for school + daycare) ─────────

const CAL_COLS    = '1fr 145px 70px 90px 85px 40px'
const CAL_HEADERS = ['Calendar Name', 'Linked To', 'Year', 'Uploaded', 'Status', 'Actions']

function CalendarsSection({ calendars, title, addLabel }: {
  calendars: ClosureCalendar[]; title: string; addLabel: string
}) {
  if (calendars.length === 0) {
    return (
      <SubSectionCard Icon={CalendarDays} title={title} count={0} addLabel={addLabel}>
        <EmptyState label="calendars" />
      </SubSectionCard>
    )
  }

  return (
    <SubSectionCard Icon={CalendarDays} title={title} count={calendars.length} addLabel={addLabel}>
      <div className="hidden md:grid px-5 py-2.5 gap-3"
        style={{ gridTemplateColumns: CAL_COLS, background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        {CAL_HEADERS.map(h => <ColHeader key={h} label={h} />)}
      </div>

      {calendars.map((cal, idx) => {
        const cm = CALENDAR_META[cal.status]
        const border = idx < calendars.length - 1 ? '1px solid var(--border-subtle)' : 'none'
        const needsUpload = cal.status === 'missing'
        return (
          <div key={cal.id} style={{ borderBottom: border }}>
            {/* Desktop */}
            <div className="hidden md:grid items-center px-5 py-3.5 gap-3"
              style={{ gridTemplateColumns: CAL_COLS }}>
              <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{cal.name}</p>
              <p className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{cal.linkedTo}</p>
              <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{cal.year}</span>
              <span className="text-[12px]" style={{ color: cal.uploadDate ? 'var(--text-3)' : 'var(--text-4)' }}>
                {cal.uploadDate ?? '—'}
              </span>
              <Badge {...cm} />
              <RowMenu actions={[
                ...(needsUpload
                  ? [{ label: 'Upload', icon: <Upload size={12} strokeWidth={2} />, color: 'var(--accent)' }]
                  : [{ label: 'View', icon: <Eye size={12} strokeWidth={2} /> },
                     { label: 'Replace', icon: <Upload size={12} strokeWidth={2} /> }]
                ),
                { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171' },
              ]} minWidth="140px" />
            </div>

            {/* Mobile */}
            <div className="md:hidden px-4 py-4 flex flex-col gap-2">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-1)' }}>{cal.name}</p>
                  <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                    {cal.linkedTo} · {cal.year}
                  </p>
                </div>
                <Badge {...cm} />
              </div>
              <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
                {cal.uploadDate ? `Uploaded: ${cal.uploadDate}` : 'Not yet uploaded'}
              </p>
              <div className="pt-0.5">
                <RowMenu actions={[
                  ...(needsUpload
                    ? [{ label: 'Upload', icon: <Upload size={12} strokeWidth={2} />, color: 'var(--accent)' }]
                    : [{ label: 'View', icon: <Eye size={12} strokeWidth={2} /> },
                       { label: 'Replace', icon: <Upload size={12} strokeWidth={2} /> }]
                  ),
                  { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171' },
                ]} minWidth="140px" />
              </div>
            </div>
          </div>
        )
      })}
    </SubSectionCard>
  )
}

// ─── Daycares / CPEs section ─────────────────────────────────

const DAYCARE_COLS    = '1fr 80px 100px 70px 85px 40px'
const DAYCARE_HEADERS = ['Name', 'Type', 'City', 'Capacity', 'Status', 'Actions']

function DaycaresSection() {
  if (DAYCARES.length === 0) {
    return (
      <SubSectionCard Icon={Baby} title="Daycares / CPEs" count={0} addLabel="Add Daycare / CPE">
        <EmptyState label="daycares" />
      </SubSectionCard>
    )
  }

  return (
    <SubSectionCard Icon={Baby} title="Daycares / CPEs" count={DAYCARES.length} addLabel="Add Daycare / CPE">
      <div className="hidden md:grid px-5 py-2.5 gap-3"
        style={{ gridTemplateColumns: DAYCARE_COLS, background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        {DAYCARE_HEADERS.map(h => <ColHeader key={h} label={h} />)}
      </div>

      {DAYCARES.map((d, idx) => {
        const tm = DAYCARE_TYPE_META[d.type]
        const em = ENTITY_META[d.status]
        const border = idx < DAYCARES.length - 1 ? '1px solid var(--border-subtle)' : 'none'
        return (
          <div key={d.id} style={{ borderBottom: border }}>
            {/* Desktop */}
            <div className="hidden md:grid items-center px-5 py-3.5 gap-3"
              style={{ gridTemplateColumns: DAYCARE_COLS }}>
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{d.name}</p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-4)' }}>{d.address}</p>
              </div>
              <Badge {...tm} />
              <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{d.city}</span>
              <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{d.capacity} children</span>
              <Badge {...em} />
              <RowMenu actions={[
                { label: 'View',   icon: <Eye    size={12} strokeWidth={2} /> },
                { label: 'Edit',   icon: <Edit3  size={12} strokeWidth={2} /> },
                { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171' },
              ]} minWidth="140px" />
            </div>

            {/* Mobile */}
            <div className="md:hidden px-4 py-4 flex flex-col gap-2.5">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold" style={{ color: 'var(--text-1)' }}>{d.name}</p>
                  <p className="text-[11px] mt-0.5 flex items-center gap-1" style={{ color: 'var(--text-4)' }}>
                    <MapPin size={10} strokeWidth={2} />{d.address} · {d.city}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge {...em} />
                  <RowMenu actions={[
                    { label: 'View',   icon: <Eye    size={12} strokeWidth={2} /> },
                    { label: 'Edit',   icon: <Edit3  size={12} strokeWidth={2} /> },
                    { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171' },
                  ]} minWidth="140px" />
                </div>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge {...tm} />
                <span className="text-[11.5px] font-medium" style={{ color: 'var(--text-4)' }}>
                  Capacity: {d.capacity}
                </span>
              </div>
            </div>
          </div>
        )
      })}
    </SubSectionCard>
  )
}

// ─── Page ────────────────────────────────────────────────────

export function ClientMesClientsPage() {
  const totalSchools   = SCHOOLS.length
  const totalDaycares  = DAYCARES.length
  const totalContacts  = SCHOOL_CONTACTS.length + DAYCARE_CONTACTS.length
  const totalCalendars = SCHOOL_CALENDARS.length + DAYCARE_CALENDARS.length

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
              Client Portal / My Clients &amp; Establishments
            </p>
            <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              My Clients / Establishments
            </h1>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
              Module-driven configuration — showing sections for active modules only
            </p>
          </div>

          {/* Summary counts */}
          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: 'Schools',      value: totalSchools   },
              { label: 'Daycares',     value: totalDaycares  },
              { label: 'Contacts',     value: totalContacts  },
              { label: 'Calendars',    value: totalCalendars },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center px-4 py-2.5 rounded-xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', minWidth: 64 }}>
                <span className="text-[18px] font-black leading-none" style={{ color: 'var(--accent)' }}>{value}</span>
                <span className="text-[10px] mt-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active module pills */}
        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[11px] font-semibold" style={{ color: 'var(--text-4)' }}>Active modules:</span>
          {ACTIVE_MODULES.schoolMeals && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
              <BookOpen size={10} strokeWidth={2} /> School Meals
            </span>
          )}
          {ACTIVE_MODULES.daycare && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
              <Baby size={10} strokeWidth={2} /> Daycare / CPE
            </span>
          )}
          {!ACTIVE_MODULES.campMeals && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
              <Lock size={10} strokeWidth={2} /> Camp Meals — inactive
            </span>
          )}
        </div>
      </div>

      <PageTabs
        tabs={[
          { id: 'school',  label: 'School Meals',  icon: <BookOpen size={13} strokeWidth={1.8} /> },
          { id: 'daycare', label: 'Daycare / CPE', icon: <Baby size={13} strokeWidth={1.8} /> },
          { id: 'camp',    label: 'Camp Meals',    icon: <Tent size={13} strokeWidth={1.8} /> },
        ]}>
        {activeTab => (
          <div className="px-5 py-6 flex flex-col gap-8">

            {activeTab === 'school' && (
              ACTIVE_MODULES.schoolMeals
                ? <ModuleSection Icon={BookOpen} title="School Meals Module" accentColor="#4ade80">
                    <SchoolsSection />
                    <CSSDistrictsSection />
                    <ContactsSection contacts={SCHOOL_CONTACTS} title="School Contacts" addLabel="Add Contact" />
                    <CalendarsSection calendars={SCHOOL_CALENDARS} title="School Closure Calendars" addLabel="Add Calendar" />
                  </ModuleSection>
                : <InactiveModule Icon={BookOpen} title="School Meals Module"
                    description="Activate School Meals in Modules & Required Setup to configure schools here." />
            )}

            {activeTab === 'daycare' && (
              ACTIVE_MODULES.daycare
                ? <ModuleSection Icon={Baby} title="Daycare / CPE Meals Module" accentColor="#60a5fa">
                    <DaycaresSection />
                    <ContactsSection contacts={DAYCARE_CONTACTS} title="Daycare Contacts" addLabel="Add Contact" />
                    <CalendarsSection calendars={DAYCARE_CALENDARS} title="Closure Calendars" addLabel="Add Calendar" />
                  </ModuleSection>
                : <InactiveModule Icon={Baby} title="Daycare / CPE Meals Module"
                    description="Activate the Daycare module in Modules & Required Setup to configure daycares here." />
            )}

            {activeTab === 'camp' && (
              <InactiveModule
                Icon={Tent}
                title="Camp Meals Module"
                description="Camps, Camp Contacts, and Camp Dates / Weeks sections will appear here once the Camp Meals module is activated in Modules & Required Setup."
              />
            )}

            <div className="h-4" />
          </div>
        )}
      </PageTabs>
    </div>
  )
}
