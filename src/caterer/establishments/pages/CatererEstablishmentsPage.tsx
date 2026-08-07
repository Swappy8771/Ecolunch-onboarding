import { useState, type ReactNode } from 'react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import { RowMenu } from '../../../shared/components/DropdownMenu'
import {
  BookOpen, Baby, Tent,
  GraduationCap, Building2, Users, CalendarDays,
  Plus, Edit3, Trash2, Upload,
  Phone, Mail, MapPin, Lock, RefreshCw, WifiOff,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  useCatererEstablishmentsDashboard,
} from '@/features/catererEstablishments/hooks/useCatererEstablishmentsQueries'
import {
  useCreateCatererEstablishment, useUpdateCatererEstablishment, useDeleteCatererEstablishment,
  useAddCatererContact, useRemoveCatererContact, useAddCatererClosure, useRemoveCatererClosure,
} from '@/features/catererEstablishments/hooks/useCatererEstablishmentsActions'
import type {
  EstablishmentDetailViewModel, EstablishmentType, SchoolViewModel, CssDistrictViewModel,
  DaycareViewModel, ContactViewModel, ClosureCalendarViewModel,
} from '@/features/catererEstablishments/types/catererEstablishments.types'
import { EstablishmentFormModal, type EstablishmentFormValues } from '../components/EstablishmentFormModal'
import { ContactFormModal } from '../components/ContactFormModal'
import { ClosureFormModal } from '../components/ClosureFormModal'
import type { CreateEstablishmentBody, UpdateEstablishmentBody } from '@/api/modules/caterer-establishments.api'

// ─── Meta maps ───────────────────────────────────────────────

const ENTITY_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  active:     { label: 'Active',     color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)'  },
  pending:    { label: 'Pending',    color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  },
  incomplete: { label: 'Incomplete', color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
}

const CALENDAR_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  approved: { label: 'Approved', color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)'  },
  pending:  { label: 'Pending',  color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  },
  missing:  { label: 'Missing',  color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
}

const SCHOOL_TYPE_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  public:  { label: 'Public',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)'  },
  private: { label: 'Private', color: '#a78bfa', bg: 'rgba(167,139,250,0.12)', border: 'rgba(167,139,250,0.25)' },
}

const DAYCARE_TYPE_META: Record<string, { label: string; color: string; bg: string; border: string }> = {
  CPE:      { label: 'CPE',      color: 'var(--accent)', bg: 'var(--accent-dim)',        border: 'var(--accent-border)'   },
  Daycare:  { label: 'Daycare',  color: '#60a5fa',        bg: 'rgba(96,165,250,0.12)',    border: 'rgba(96,165,250,0.25)'  },
  Garderie: { label: 'Garderie', color: '#fbbf24',        bg: 'rgba(251,191,36,0.12)',    border: 'rgba(251,191,36,0.25)'  },
}

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

function PageLoading() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 animate-pulse">
      <div className="h-24 rounded-2xl" style={{ background: 'var(--bg-card)' }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-40 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
      ))}
    </div>
  )
}

function PageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
        <WifiOff size={22} strokeWidth={1.5} style={{ color: '#f87171' }} />
      </div>
      <div>
        <p className="text-[14px] font-bold mb-1" style={{ color: '#f87171' }}>Failed to load your establishments</p>
        <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>Check your connection and retry.</p>
      </div>
      <button onClick={onRetry}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
        style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
        <RefreshCw size={13} strokeWidth={2} />Retry
      </button>
    </div>
  )
}

// ─── SubSectionCard ──────────────────────────────────────────

interface SubSectionCardProps {
  Icon: LucideIcon; title: string; count: number; addLabel: string; onAdd: () => void; children: ReactNode
}

function SubSectionCard({ Icon, title, count, addLabel, onAdd, children }: SubSectionCardProps) {
  return (
    <div className="rounded-2xl"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
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
        <button onClick={onAdd}
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
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: `3px solid ${accentColor}` }}>
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
      <div className="flex flex-col gap-4 pl-4 border-l-2" style={{ borderColor: `${accentColor}30` }}>
        {children}
      </div>
    </section>
  )
}

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
      </div>
    </section>
  )
}

// ─── Schools section ─────────────────────────────────────────

const SCHOOLS_COLS    = '2fr 72px 100px 140px 85px 40px'
const SCHOOLS_HEADERS = ['School Name', 'Type', 'City', 'CSS / District', 'Status', 'Actions']

function SchoolsSection({ schools, onAdd, onEdit, onDelete }: {
  schools: SchoolViewModel[]
  onAdd: () => void
  onEdit: (s: SchoolViewModel) => void
  onDelete: (s: SchoolViewModel) => void
}) {
  return (
    <SubSectionCard Icon={GraduationCap} title="Schools" count={schools.length} addLabel="Add School" onAdd={onAdd}>
      {schools.length === 0 ? <EmptyState label="schools" /> : (
        <>
          <div className="hidden md:grid px-5 py-2.5 gap-3"
            style={{ gridTemplateColumns: SCHOOLS_COLS, background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
            {SCHOOLS_HEADERS.map(h => <ColHeader key={h} label={h} />)}
          </div>
          {schools.map((school, idx) => {
            const tm = SCHOOL_TYPE_META[school.schoolType ?? '']
            const em = ENTITY_META[school.status]!
            const border = idx < schools.length - 1 ? '1px solid var(--border-subtle)' : 'none'
            return (
              <div key={school.id} style={{ borderBottom: border }}>
                <div className="hidden md:grid items-center px-5 py-3.5 gap-3" style={{ gridTemplateColumns: SCHOOLS_COLS }}>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{school.name}</p>
                    <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-4)' }}>{school.address}</p>
                  </div>
                  {tm ? <Badge {...tm} /> : <span />}
                  <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{school.city}</span>
                  {school.cssDistrictName
                    ? <span className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{school.cssDistrictName}</span>
                    : <span className="text-[11.5px] italic" style={{ color: 'var(--text-4)' }}>Not linked</span>}
                  <Badge {...em} />
                  <RowMenu actions={[
                    { label: 'Edit', icon: <Edit3 size={12} strokeWidth={2} />, onClick: () => onEdit(school) },
                    { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(school) },
                  ]} minWidth="140px" />
                </div>

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
                    {tm && <Badge {...tm} />}
                    {school.cssDistrictName && (
                      <span className="text-[11px] font-medium px-2 py-0.5 rounded"
                        style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                        {school.cssDistrictName}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <RowMenu actions={[
                      { label: 'Edit', icon: <Edit3 size={12} strokeWidth={2} />, onClick: () => onEdit(school) },
                      { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(school) },
                    ]} minWidth="140px" />
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </SubSectionCard>
  )
}

// ─── CSS / School Districts section ──────────────────────────

const CSS_COLS    = '1fr 130px 70px 85px 40px'
const CSS_HEADERS = ['District Name', 'Municipality', 'Schools', 'Status', 'Actions']

function CSSDistrictsSection({ cssDistricts, onAdd, onEdit, onDelete }: {
  cssDistricts: CssDistrictViewModel[]
  onAdd: () => void
  onEdit: (c: CssDistrictViewModel) => void
  onDelete: (c: CssDistrictViewModel) => void
}) {
  return (
    <SubSectionCard Icon={Building2} title="CSS / School Districts" count={cssDistricts.length} addLabel="Add District" onAdd={onAdd}>
      {cssDistricts.length === 0 ? <EmptyState label="CSS districts" /> : (
        <>
          <div className="hidden md:grid px-5 py-2.5 gap-3"
            style={{ gridTemplateColumns: CSS_COLS, background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
            {CSS_HEADERS.map(h => <ColHeader key={h} label={h} />)}
          </div>
          {cssDistricts.map((css, idx) => {
            const em = ENTITY_META[css.status]!
            const border = idx < cssDistricts.length - 1 ? '1px solid var(--border-subtle)' : 'none'
            return (
              <div key={css.id} style={{ borderBottom: border }}>
                <div className="hidden md:grid items-center px-5 py-3.5 gap-3" style={{ gridTemplateColumns: CSS_COLS }}>
                  <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{css.name}</p>
                  <span className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{css.municipality}</span>
                  <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>
                    {css.schoolCount} school{css.schoolCount !== 1 ? 's' : ''}
                  </span>
                  <Badge {...em} />
                  <RowMenu actions={[
                    { label: 'Edit', icon: <Edit3 size={12} strokeWidth={2} />, onClick: () => onEdit(css) },
                    { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(css) },
                  ]} minWidth="130px" />
                </div>
                <div className="md:hidden px-4 py-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <p className="text-[13px] font-bold" style={{ color: 'var(--text-1)' }}>{css.name}</p>
                    <Badge {...em} />
                  </div>
                  <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
                    {css.municipality} · {css.schoolCount} schools
                  </p>
                  <div className="pt-0.5">
                    <RowMenu actions={[
                      { label: 'Edit', icon: <Edit3 size={12} strokeWidth={2} />, onClick: () => onEdit(css) },
                      { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(css) },
                    ]} minWidth="130px" />
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </SubSectionCard>
  )
}

// ─── Contacts section (shared for school + daycare) ──────────

const CONTACTS_COLS    = '130px 1fr 100px 1fr 40px'
const CONTACTS_HEADERS = ['Name', 'Establishment', 'Role', 'Email', '']

function ContactsSection({ contacts, title, addLabel, onAdd, onDelete }: {
  contacts: ContactViewModel[]; title: string; addLabel: string
  onAdd: () => void
  onDelete: (c: ContactViewModel) => void
}) {
  return (
    <SubSectionCard Icon={Users} title={title} count={contacts.length} addLabel={addLabel} onAdd={onAdd}>
      {contacts.length === 0 ? <EmptyState label="contacts" /> : (
        <>
          <div className="hidden lg:grid px-5 py-2.5 gap-3"
            style={{ gridTemplateColumns: CONTACTS_COLS, background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
            {CONTACTS_HEADERS.map(h => <ColHeader key={h} label={h} />)}
          </div>
          {contacts.map((c, idx) => {
            const border = idx < contacts.length - 1 ? '1px solid var(--border-subtle)' : 'none'
            return (
              <div key={`${c.establishmentId}-${c.id}`} style={{ borderBottom: border }}>
                <div className="hidden lg:grid items-center px-5 py-3.5 gap-3" style={{ gridTemplateColumns: CONTACTS_COLS }}>
                  <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{c.name}</p>
                  <p className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{c.establishmentName}</p>
                  <span className="text-[11.5px] font-medium px-2 py-0.5 rounded-lg"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                    {c.role ?? '—'}
                  </span>
                  <p className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{c.email}</p>
                  <RowMenu actions={[
                    { label: 'Call', icon: <Phone size={12} strokeWidth={2} />, onClick: () => c.phone && window.open(`tel:${c.phone}`) },
                    { label: 'Email', icon: <Mail size={12} strokeWidth={2} />, onClick: () => c.email && window.open(`mailto:${c.email}`) },
                    { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(c) },
                  ]} minWidth="150px" />
                </div>

                <div className="lg:hidden px-4 py-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2 flex-wrap">
                    <div>
                      <p className="text-[13px] font-bold" style={{ color: 'var(--text-1)' }}>{c.name}</p>
                      <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>{c.establishmentName}</p>
                    </div>
                    <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-lg"
                      style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                      {c.role ?? '—'}
                    </span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <p className="text-[11.5px] flex items-center gap-1.5" style={{ color: 'var(--text-4)' }}>
                      <Mail size={11} strokeWidth={2} />{c.email ?? '—'}
                    </p>
                    <p className="text-[11.5px] flex items-center gap-1.5" style={{ color: 'var(--text-4)' }}>
                      <Phone size={11} strokeWidth={2} />{c.phone ?? '—'}
                    </p>
                  </div>
                  <div className="pt-0.5">
                    <RowMenu actions={[
                      { label: 'Call', icon: <Phone size={12} strokeWidth={2} />, onClick: () => c.phone && window.open(`tel:${c.phone}`) },
                      { label: 'Email', icon: <Mail size={12} strokeWidth={2} />, onClick: () => c.email && window.open(`mailto:${c.email}`) },
                      { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(c) },
                    ]} minWidth="150px" />
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </SubSectionCard>
  )
}

// ─── Calendars section (shared for school + daycare) ─────────

const CAL_COLS    = '1fr 145px 70px 90px 85px 40px'
const CAL_HEADERS = ['Calendar Name', 'Linked To', 'Year', 'Uploaded', 'Status', 'Actions']

function CalendarsSection({ calendars, title, addLabel, onAdd, onDelete }: {
  calendars: ClosureCalendarViewModel[]; title: string; addLabel: string
  onAdd: () => void
  onDelete: (c: ClosureCalendarViewModel) => void
}) {
  return (
    <SubSectionCard Icon={CalendarDays} title={title} count={calendars.length} addLabel={addLabel} onAdd={onAdd}>
      {calendars.length === 0 ? <EmptyState label="calendars" /> : (
        <>
          <div className="hidden md:grid px-5 py-2.5 gap-3"
            style={{ gridTemplateColumns: CAL_COLS, background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
            {CAL_HEADERS.map(h => <ColHeader key={h} label={h} />)}
          </div>
          {calendars.map((cal, idx) => {
            const cm = CALENDAR_META[cal.status]!
            const border = idx < calendars.length - 1 ? '1px solid var(--border-subtle)' : 'none'
            return (
              <div key={cal.id} style={{ borderBottom: border }}>
                <div className="hidden md:grid items-center px-5 py-3.5 gap-3" style={{ gridTemplateColumns: CAL_COLS }}>
                  <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{cal.label}</p>
                  <p className="text-[12px] truncate" style={{ color: 'var(--text-3)' }}>{cal.establishmentName}</p>
                  <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{cal.year ?? '—'}</span>
                  <span className="text-[12px]" style={{ color: cal.uploadedAt ? 'var(--text-3)' : 'var(--text-4)' }}>
                    {cal.uploadedAt ? new Date(cal.uploadedAt).toLocaleDateString() : (cal.closureDate ?? '—')}
                  </span>
                  <Badge {...cm} />
                  <RowMenu actions={[
                    { label: 'Upload', icon: <Upload size={12} strokeWidth={2} />, disabled: true, title: 'Document upload not wired up yet' },
                    { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(cal) },
                  ]} minWidth="140px" />
                </div>

                <div className="md:hidden px-4 py-4 flex flex-col gap-2">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[13px] font-bold truncate" style={{ color: 'var(--text-1)' }}>{cal.label}</p>
                      <p className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                        {cal.establishmentName} · {cal.year ?? '—'}
                      </p>
                    </div>
                    <Badge {...cm} />
                  </div>
                  <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
                    {cal.uploadedAt ? `Uploaded: ${new Date(cal.uploadedAt).toLocaleDateString()}` : (cal.closureDate ? `Date: ${cal.closureDate}` : 'Not yet set')}
                  </p>
                  <div className="pt-0.5">
                    <RowMenu actions={[
                      { label: 'Upload', icon: <Upload size={12} strokeWidth={2} />, disabled: true, title: 'Document upload not wired up yet' },
                      { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(cal) },
                    ]} minWidth="140px" />
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </SubSectionCard>
  )
}

// ─── Daycares / CPEs section ─────────────────────────────────

const DAYCARE_COLS    = '1fr 80px 100px 70px 85px 40px'
const DAYCARE_HEADERS = ['Name', 'Type', 'City', 'Capacity', 'Status', 'Actions']

function DaycaresSection({ daycares, onAdd, onEdit, onDelete }: {
  daycares: DaycareViewModel[]
  onAdd: () => void
  onEdit: (d: DaycareViewModel) => void
  onDelete: (d: DaycareViewModel) => void
}) {
  return (
    <SubSectionCard Icon={Baby} title="Daycares / CPEs" count={daycares.length} addLabel="Add Daycare / CPE" onAdd={onAdd}>
      {daycares.length === 0 ? <EmptyState label="daycares" /> : (
        <>
          <div className="hidden md:grid px-5 py-2.5 gap-3"
            style={{ gridTemplateColumns: DAYCARE_COLS, background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
            {DAYCARE_HEADERS.map(h => <ColHeader key={h} label={h} />)}
          </div>
          {daycares.map((d, idx) => {
            const tm = DAYCARE_TYPE_META[d.daycareType ?? '']
            const em = ENTITY_META[d.status]!
            const border = idx < daycares.length - 1 ? '1px solid var(--border-subtle)' : 'none'
            return (
              <div key={d.id} style={{ borderBottom: border }}>
                <div className="hidden md:grid items-center px-5 py-3.5 gap-3" style={{ gridTemplateColumns: DAYCARE_COLS }}>
                  <div className="min-w-0">
                    <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{d.name}</p>
                    <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-4)' }}>{d.address}</p>
                  </div>
                  {tm ? <Badge {...tm} /> : <span />}
                  <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{d.city}</span>
                  <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{d.childCapacity ?? '—'} children</span>
                  <Badge {...em} />
                  <RowMenu actions={[
                    { label: 'Edit', icon: <Edit3 size={12} strokeWidth={2} />, onClick: () => onEdit(d) },
                    { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(d) },
                  ]} minWidth="140px" />
                </div>

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
                        { label: 'Edit', icon: <Edit3 size={12} strokeWidth={2} />, onClick: () => onEdit(d) },
                        { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(d) },
                      ]} minWidth="140px" />
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-wrap">
                    {tm && <Badge {...tm} />}
                    <span className="text-[11.5px] font-medium" style={{ color: 'var(--text-4)' }}>
                      Capacity: {d.childCapacity ?? '—'}
                    </span>
                  </div>
                </div>
              </div>
            )
          })}
        </>
      )}
    </SubSectionCard>
  )
}

// ─── Camps section ───────────────────────────────────────────

function CampsSection({ camps, onAdd, onEdit, onDelete }: {
  camps: EstablishmentDetailViewModel[]
  onAdd: () => void
  onEdit: (c: EstablishmentDetailViewModel) => void
  onDelete: (c: EstablishmentDetailViewModel) => void
}) {
  return (
    <SubSectionCard Icon={Tent} title="Camps" count={camps.length} addLabel="Add Camp" onAdd={onAdd}>
      {camps.length === 0 ? <EmptyState label="camps" /> : (
        <div className="divide-y" style={{ borderColor: 'var(--border-subtle)' }}>
          {camps.map(camp => (
            <div key={camp.id} className="flex items-center justify-between gap-3 px-5 py-3.5">
              <div className="min-w-0">
                <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{camp.name}</p>
                <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-4)' }}>
                  {camp.city}
                  {camp.type === 'camp' && camp.sessionDates[0] && (
                    <> · {camp.sessionDates[0].start} → {camp.sessionDates[0].end}</>
                  )}
                  {camp.type === 'camp' && camp.sessionDates.length === 0 && (
                    <span style={{ color: '#f87171' }}> · Dates not set</span>
                  )}
                </p>
              </div>
              <Badge {...ENTITY_META[camp.status]!} />
              <RowMenu actions={[
                { label: 'Edit', icon: <Edit3 size={12} strokeWidth={2} />, onClick: () => onEdit(camp) },
                { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(camp) },
              ]} minWidth="140px" />
            </div>
          ))}
        </div>
      )}
    </SubSectionCard>
  )
}

// ─── Modal state ──────────────────────────────────────────────

type ModalState =
  | { kind: 'establishment'; type: EstablishmentType; editing: EstablishmentDetailViewModel | null }
  | { kind: 'contact'; sectionTitle: string; options: { id: string; name: string }[] }
  | { kind: 'closure'; sectionTitle: string; options: { id: string; name: string }[] }
  | null

function sessionDatesFromForm(values: EstablishmentFormValues): { start: string; end: string }[] | undefined {
  return values.sessionStart && values.sessionEnd ? [{ start: values.sessionStart, end: values.sessionEnd }] : undefined
}

function establishmentFormToCreateBody(type: EstablishmentType, values: EstablishmentFormValues): CreateEstablishmentBody {
  const base = { name: values.name.trim(), city: values.city.trim() || undefined }
  switch (type) {
    case 'school':
      return {
        type: 'school',
        ...base,
        address: values.address.trim() || undefined,
        schoolType: values.schoolType || undefined,
        cssDistrictId: values.cssDistrictId || undefined,
        studentCount: values.studentCount ? Number(values.studentCount) : undefined,
      }
    case 'daycare':
      return {
        type: 'daycare',
        ...base,
        address: values.address.trim() || undefined,
        daycareType: values.daycareType || undefined,
        childCapacity: values.childCapacity ? Number(values.childCapacity) : undefined,
      }
    case 'camp':
      return {
        type: 'camp',
        ...base,
        address: values.address.trim() || undefined,
        participantCount: values.participantCount ? Number(values.participantCount) : undefined,
        sessionDates: sessionDatesFromForm(values),
      }
    case 'css':
      return { type: 'css', ...base, municipality: values.municipality.trim() || undefined }
  }
}

function establishmentFormToUpdateBody(type: EstablishmentType, values: EstablishmentFormValues): UpdateEstablishmentBody {
  const base = { name: values.name.trim(), city: values.city.trim() || undefined }
  switch (type) {
    case 'school':
      return {
        ...base,
        address: values.address.trim() || undefined,
        schoolType: values.schoolType || undefined,
        cssDistrictId: values.cssDistrictId || undefined,
        studentCount: values.studentCount ? Number(values.studentCount) : undefined,
      }
    case 'daycare':
      return {
        ...base,
        address: values.address.trim() || undefined,
        daycareType: values.daycareType || undefined,
        childCapacity: values.childCapacity ? Number(values.childCapacity) : undefined,
      }
    case 'camp':
      return {
        ...base,
        address: values.address.trim() || undefined,
        participantCount: values.participantCount ? Number(values.participantCount) : undefined,
        sessionDates: sessionDatesFromForm(values),
      }
    case 'css':
      return { ...base, municipality: values.municipality.trim() || undefined }
  }
}

// ─── Page ────────────────────────────────────────────────────

/** Static breadcrumb + title only — shown even before data has loaded, so the page heading is never missing during loading/error states. */
function PageHeading() {
  return (
    <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
        Caterer Portal / My Clients &amp; Establishments
      </p>
      <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
        My Clients / Establishments
      </h1>
    </div>
  )
}

export function CatererEstablishmentsPage() {
  const dashboardQuery = useCatererEstablishmentsDashboard(undefined)
  const createMutation = useCreateCatererEstablishment()
  const updateMutation = useUpdateCatererEstablishment()
  const deleteMutation = useDeleteCatererEstablishment()
  const addContactMutation = useAddCatererContact()
  const removeContactMutation = useRemoveCatererContact()
  const addClosureMutation = useAddCatererClosure()
  const removeClosureMutation = useRemoveCatererClosure()

  const [modal, setModal] = useState<ModalState>(null)
  const [modalError, setModalError] = useState<string | null>(null)

  if (dashboardQuery.isLoading) {
    return <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}><PageHeading /><PageLoading /></div>
  }
  if (dashboardQuery.isError || !dashboardQuery.data) {
    return <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}><PageHeading /><PageError onRetry={() => dashboardQuery.refetch()} /></div>
  }

  const dashboard = dashboardQuery.data
  const schoolContacts = dashboard.schools.flatMap(s => s.contacts)
  const daycareContacts = dashboard.daycares.flatMap(d => d.contacts)
  const campContacts = dashboard.camps.flatMap(c => c.contacts)
  const schoolCalendars = dashboard.schools.flatMap(s => s.closureCalendars)
  const daycareCalendars = dashboard.daycares.flatMap(d => d.closureCalendars)

  function closeModal() {
    setModal(null)
    setModalError(null)
  }

  function handleSaveEstablishment(type: EstablishmentType, editing: EstablishmentDetailViewModel | null, values: EstablishmentFormValues) {
    setModalError(null)
    if (editing) {
      updateMutation.mutate(
        { id: editing.id, body: establishmentFormToUpdateBody(type, values) },
        { onSuccess: closeModal, onError: e => setModalError(e.message) },
      )
    } else {
      createMutation.mutate(establishmentFormToCreateBody(type, values), {
        onSuccess: closeModal, onError: e => setModalError(e.message),
      })
    }
  }

  function handleDeleteEstablishment(e: EstablishmentDetailViewModel) {
    if (!window.confirm(`Delete "${e.name}"? This cannot be undone.`)) return
    deleteMutation.mutate(e.id)
  }

  function handleAddContact(input: { establishmentId: string; name: string; role: string; email: string; phone: string }) {
    setModalError(null)
    addContactMutation.mutate(
      { id: input.establishmentId, body: { name: input.name, role: input.role || undefined, email: input.email || undefined, phone: input.phone || undefined } },
      { onSuccess: closeModal, onError: e => setModalError(e.message) },
    )
  }

  function handleRemoveContact(c: ContactViewModel) {
    if (!c.id) return
    if (!window.confirm(`Remove contact "${c.name}"?`)) return
    removeContactMutation.mutate({ id: c.establishmentId, contactId: c.id })
  }

  function handleAddClosure(input: { establishmentId: string; label: string; year: string; closureDate: string }) {
    setModalError(null)
    addClosureMutation.mutate(
      { id: input.establishmentId, body: { label: input.label, year: input.year || undefined, closureDate: input.closureDate || undefined } },
      { onSuccess: closeModal, onError: e => setModalError(e.message) },
    )
  }

  function handleRemoveClosure(c: ClosureCalendarViewModel) {
    if (!window.confirm(`Remove calendar "${c.label}"?`)) return
    removeClosureMutation.mutate({ id: c.establishmentId, closureId: c.id })
  }

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
              Caterer Portal / My Clients &amp; Establishments
            </p>
            <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              My Clients / Establishments
            </h1>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
              Module-driven configuration — showing sections for active modules only
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {[
              { label: 'Schools', value: dashboard.counts.schools },
              { label: 'Daycares', value: dashboard.counts.daycares },
              { label: 'Contacts', value: dashboard.counts.contacts },
              { label: 'Calendars', value: dashboard.counts.calendars },
            ].map(({ label, value }) => (
              <div key={label} className="flex flex-col items-center px-4 py-2.5 rounded-xl"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', minWidth: 64 }}>
                <span className="text-[18px] font-black leading-none" style={{ color: 'var(--accent)' }}>{value}</span>
                <span className="text-[10px] mt-0.5 font-semibold uppercase tracking-wide" style={{ color: 'var(--text-4)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-3 flex-wrap">
          <span className="text-[11px] font-semibold" style={{ color: 'var(--text-4)' }}>Active modules:</span>
          {dashboard.activeModules.schoolMeals && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
              <BookOpen size={10} strokeWidth={2} /> School Meals
            </span>
          )}
          {dashboard.activeModules.daycareMeals && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(96,165,250,0.12)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.25)' }}>
              <Baby size={10} strokeWidth={2} /> Daycare / CPE
            </span>
          )}
          {dashboard.activeModules.campMeals && (
            <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full"
              style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.25)' }}>
              <Tent size={10} strokeWidth={2} /> Camp Meals
            </span>
          )}
          {!dashboard.activeModules.schoolMeals && !dashboard.activeModules.daycareMeals && !dashboard.activeModules.campMeals && (
            <span className="flex items-center gap-1.5 text-[11px] font-medium px-2.5 py-1 rounded-full"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
              <Lock size={10} strokeWidth={2} /> No modules active yet
            </span>
          )}
        </div>
      </div>

      <PageTabs
        tabs={[
          { id: 'school', label: 'School Meals', icon: <BookOpen size={13} strokeWidth={1.8} /> },
          { id: 'daycare', label: 'Daycare / CPE', icon: <Baby size={13} strokeWidth={1.8} /> },
          { id: 'camp', label: 'Camp Meals', icon: <Tent size={13} strokeWidth={1.8} /> },
        ]}>
        {activeTab => (
          <div className="px-5 py-6 flex flex-col gap-8">

            {activeTab === 'school' && (
              dashboard.activeModules.schoolMeals
                ? <ModuleSection Icon={BookOpen} title="School Meals Module" accentColor="#4ade80">
                    <SchoolsSection
                      schools={dashboard.schools}
                      onAdd={() => setModal({ kind: 'establishment', type: 'school', editing: null })}
                      onEdit={s => setModal({ kind: 'establishment', type: 'school', editing: s })}
                      onDelete={handleDeleteEstablishment}
                    />
                    <CSSDistrictsSection
                      cssDistricts={dashboard.cssDistricts}
                      onAdd={() => setModal({ kind: 'establishment', type: 'css', editing: null })}
                      onEdit={c => setModal({ kind: 'establishment', type: 'css', editing: c })}
                      onDelete={handleDeleteEstablishment}
                    />
                    <ContactsSection
                      contacts={schoolContacts} title="School Contacts" addLabel="Add Contact"
                      onAdd={() => setModal({ kind: 'contact', sectionTitle: 'Add School Contact', options: dashboard.schools.map(s => ({ id: s.id, name: s.name })) })}
                      onDelete={handleRemoveContact}
                    />
                    <CalendarsSection
                      calendars={schoolCalendars} title="School Closure Calendars" addLabel="Add Calendar"
                      onAdd={() => setModal({ kind: 'closure', sectionTitle: 'Add School Closure Calendar', options: dashboard.schools.map(s => ({ id: s.id, name: s.name })) })}
                      onDelete={handleRemoveClosure}
                    />
                  </ModuleSection>
                : <InactiveModule Icon={BookOpen} title="School Meals Module"
                    description="Activate School Meals in Modules & Required Setup to configure schools here." />
            )}

            {activeTab === 'daycare' && (
              dashboard.activeModules.daycareMeals
                ? <ModuleSection Icon={Baby} title="Daycare / CPE Meals Module" accentColor="#60a5fa">
                    <DaycaresSection
                      daycares={dashboard.daycares}
                      onAdd={() => setModal({ kind: 'establishment', type: 'daycare', editing: null })}
                      onEdit={d => setModal({ kind: 'establishment', type: 'daycare', editing: d })}
                      onDelete={handleDeleteEstablishment}
                    />
                    <ContactsSection
                      contacts={daycareContacts} title="Daycare Contacts" addLabel="Add Contact"
                      onAdd={() => setModal({ kind: 'contact', sectionTitle: 'Add Daycare Contact', options: dashboard.daycares.map(d => ({ id: d.id, name: d.name })) })}
                      onDelete={handleRemoveContact}
                    />
                    <CalendarsSection
                      calendars={daycareCalendars} title="Closure Calendars" addLabel="Add Calendar"
                      onAdd={() => setModal({ kind: 'closure', sectionTitle: 'Add Daycare Closure Calendar', options: dashboard.daycares.map(d => ({ id: d.id, name: d.name })) })}
                      onDelete={handleRemoveClosure}
                    />
                  </ModuleSection>
                : <InactiveModule Icon={Baby} title="Daycare / CPE Meals Module"
                    description="Activate the Daycare module in Modules & Required Setup to configure daycares here." />
            )}

            {activeTab === 'camp' && (
              dashboard.activeModules.campMeals
                ? <ModuleSection Icon={Tent} title="Camp Meals Module" accentColor="#a78bfa">
                    <CampsSection
                      camps={dashboard.camps}
                      onAdd={() => setModal({ kind: 'establishment', type: 'camp', editing: null })}
                      onEdit={c => setModal({ kind: 'establishment', type: 'camp', editing: c })}
                      onDelete={handleDeleteEstablishment}
                    />
                    <ContactsSection
                      contacts={campContacts} title="Camp Contacts" addLabel="Add Contact"
                      onAdd={() => setModal({ kind: 'contact', sectionTitle: 'Add Camp Contact', options: dashboard.camps.map(c => ({ id: c.id, name: c.name })) })}
                      onDelete={handleRemoveContact}
                    />
                  </ModuleSection>
                : <InactiveModule
                    Icon={Tent}
                    title="Camp Meals Module"
                    description="Camps will appear here once the Camp Meals module is activated in Modules & Required Setup."
                  />
            )}

            <div className="h-4" />
          </div>
        )}
      </PageTabs>

      {modal?.kind === 'establishment' && (
        <EstablishmentFormModal
          type={modal.type}
          editing={modal.editing}
          cssDistricts={dashboard.cssDistricts}
          isSubmitting={createMutation.isPending || updateMutation.isPending}
          error={modalError}
          onCancel={closeModal}
          onSave={values => handleSaveEstablishment(modal.type, modal.editing, values)}
        />
      )}

      {modal?.kind === 'contact' && (
        <ContactFormModal
          title={modal.sectionTitle}
          establishmentOptions={modal.options}
          isSubmitting={addContactMutation.isPending}
          error={modalError}
          onCancel={closeModal}
          onSave={handleAddContact}
        />
      )}

      {modal?.kind === 'closure' && (
        <ClosureFormModal
          title={modal.sectionTitle}
          establishmentOptions={modal.options}
          isSubmitting={addClosureMutation.isPending}
          error={modalError}
          onCancel={closeModal}
          onSave={handleAddClosure}
        />
      )}
    </div>
  )
}
