import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  Building2, Briefcase, User, MapPin, Receipt,
  CheckCircle2, AlertTriangle, Clock, Eye, Edit3, RefreshCw, WifiOff,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { CompletionChart } from '../../../shared/components/CompletionChart'
import type { ChartRow } from '../../../shared/components/CompletionChart'
import type { RootState, AppDispatch } from '@/redux/store'
import { startEditingSection, stopEditingSection } from '../../../features/catererProfile/redux/catererProfileSlice'
import { useCatererProfile, useCatererProfileOverview } from '@/features/catererProfile/hooks/useCatererProfileQueries'
import {
  useUpdateCatererCompany, useUpdateCatererBusiness, useUpdateCatererContact,
  useUpdateCatererAddress, useUpdateCatererTax,
} from '@/features/catererProfile/hooks/useCatererProfileActions'
import type { ProfileSectionKey } from '@/features/catererProfile/types/catererProfile.types'
import { SECTION_META, FIELD_CONFIG, getByPath, formatFieldValue } from '../profileFieldConfig'
import { CompanyEditModal } from '../components/CompanyEditModal'
import { BusinessEditModal } from '../components/BusinessEditModal'
import { ContactEditModal } from '../components/ContactEditModal'
import { AddressEditModal } from '../components/AddressEditModal'
import { TaxEditModal } from '../components/TaxEditModal'

const SECTION_ICON: Record<ProfileSectionKey, LucideIcon> = {
  company: Building2,
  business: Briefcase,
  contact: User,
  address: MapPin,
  tax: Receipt,
}

const VALIDATION_META: Record<string, { label: string; color: string; bg: string; border: string; Icon: LucideIcon }> = {
  validated:         { label: 'Validated',      color: '#4ade80',       bg: 'rgba(74,222,128,0.12)', border: 'rgba(74,222,128,0.25)', Icon: CheckCircle2  },
  under_review:      { label: 'Under Review',   color: '#60a5fa',       bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)', Icon: Eye           },
  submitted:         { label: 'Submitted',      color: '#60a5fa',       bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.25)', Icon: Eye           },
  in_progress:       { label: 'In Progress',    color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)', border: 'rgba(251,191,36,0.25)', Icon: Clock         },
  action_required:   { label: 'Action Required', color: '#f87171',      bg: 'rgba(248,113,113,0.12)', border: 'rgba(248,113,113,0.25)', Icon: AlertTriangle },
  not_started:       { label: 'Not Submitted',  color: 'var(--text-4)', bg: 'var(--bg-inner)',       border: 'var(--border-default)', Icon: AlertTriangle },
}

function ValidationBadge({ status }: { status: string }) {
  const vm = VALIDATION_META[status] ?? VALIDATION_META.not_started!
  return (
    <span className="flex items-center gap-1.5 text-[10.5px] font-bold px-2.5 py-1 rounded-full shrink-0"
      style={{ background: vm.bg, color: vm.color, border: `1px solid ${vm.border}` }}>
      <vm.Icon size={10} strokeWidth={2.5} />
      {vm.label}
    </span>
  )
}

/** Static breadcrumb + title only — shown even before `profile`/`overview` have loaded, so the page heading is never missing during loading/error states. */
function PageHeading() {
  return (
    <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
        Caterer Portal / Profile
      </p>
      <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
        Company Profile
      </h1>
    </div>
  )
}

function PageLoading() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 animate-pulse">
      <div className="h-20 rounded-2xl" style={{ background: 'var(--bg-card)' }} />
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-64 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
        ))}
      </div>
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
        <p className="text-[14px] font-bold mb-1" style={{ color: '#f87171' }}>Failed to load your profile</p>
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

export function CatererProfilePage() {
  const dispatch = useDispatch<AppDispatch>()
  const editingSection = useSelector((state: RootState) => state.catererProfile.editingSection)

  const profileQuery = useCatererProfile(undefined)
  const overviewQuery = useCatererProfileOverview(undefined)

  const updateCompany = useUpdateCatererCompany()
  const updateBusiness = useUpdateCatererBusiness()
  const updateContact = useUpdateCatererContact()
  const updateAddress = useUpdateCatererAddress()
  const updateTax = useUpdateCatererTax()

  const [lastSaveError, setLastSaveError] = useState<string | null>(null)

  const isLoading = profileQuery.isLoading || overviewQuery.isLoading
  const isError = profileQuery.isError || overviewQuery.isError

  function retry() {
    profileQuery.refetch()
    overviewQuery.refetch()
  }

  if (isLoading) {
    return <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}><PageHeading /><PageLoading /></div>
  }
  if (isError || !profileQuery.data || !overviewQuery.data) {
    return <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}><PageHeading /><PageError onRetry={retry} /></div>
  }

  const profile = profileQuery.data
  const overview = overviewQuery.data

  const overviewSectionByKey = new Map(overview.sections.map(s => [s.key, s]))

  const missingFieldsForAlert = SECTION_META.flatMap(section =>
    FIELD_CONFIG[section.key]
      .filter(f => overview.missingFields.includes(f.overviewPath))
      .map(f => ({ field: f.label, section: section.title })),
  )

  const chartRows: ChartRow[] = SECTION_META.map(section => {
    const s = overviewSectionByKey.get(section.key)
    const pct = s?.percentage ?? 100
    const barColor = pct === 100 ? '#4ade80' : pct >= 60 ? 'var(--accent)' : '#fbbf24'
    const vm = VALIDATION_META[s?.validationStatus ?? 'not_started'] ?? VALIDATION_META.not_started!
    return { id: section.key, label: section.title, pct, barColor, badge: vm }
  })

  function closeEditor() {
    dispatch(stopEditingSection())
    setLastSaveError(null)
  }

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
      {/* Page header */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
              Caterer Portal / Profile
            </p>
            <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
              Company Profile
            </h1>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
              {profile.companyName ?? profile.company.legalName ?? 'Your company'}
            </p>
          </div>

          <div className="flex items-center gap-3 rounded-xl px-4 py-3 shrink-0"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div>
              <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
                Profile Completion
              </p>
              <div className="flex items-center gap-2.5">
                <span className="text-[20px] font-black leading-none" style={{ color: 'var(--accent)' }}>
                  {overview.completionPercentage}%
                </span>
                <div>
                  <div className="w-28 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--bg-inner)' }}>
                    <div className="h-full rounded-full" style={{ width: `${overview.completionPercentage}%`, background: 'var(--accent)' }} />
                  </div>
                  <p className="text-[10.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                    {overview.completedFields.length}/{overview.totalFields} required fields
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-5 py-6 flex flex-col gap-6">
        <CompletionChart
          title="Profile Completion & Validation Status"
          overallPct={overview.completionPercentage}
          filled={overview.completedFields.length}
          total={overview.totalFields}
          subtitle="overall complete"
          rows={chartRows}
        />

        {missingFieldsForAlert.length > 0 && (
          <div className="rounded-2xl p-4" style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.22)' }}>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
                style={{ background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.25)' }}>
                <AlertTriangle size={14} strokeWidth={2} style={{ color: '#f87171' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-bold" style={{ color: '#f87171' }}>
                  {missingFieldsForAlert.length} Required Field{missingFieldsForAlert.length !== 1 ? 's' : ''} Missing
                </p>
                <p className="text-[12px] mt-0.5 mb-3" style={{ color: 'var(--text-4)' }}>
                  Complete the following fields to advance your onboarding status.
                </p>
                <div className="flex flex-wrap gap-2">
                  {missingFieldsForAlert.map(({ field, section }) => (
                    <span key={`${section}-${field}`}
                      className="flex items-center gap-1.5 text-[11.5px] font-semibold px-3 py-1.5 rounded-xl"
                      style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                      {field}
                      <span className="text-[10px] font-normal" style={{ opacity: 0.7 }}>
                        · {section.replace(' Information', '').replace(' Details', '')}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Profile sections grid */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-5 items-start">
          <div className="flex flex-col gap-5">
            {(['company', 'business', 'tax'] as ProfileSectionKey[]).map(key => (
              <SectionCard key={key} sectionKey={key} profile={profile} overviewSection={overviewSectionByKey.get(key)}
                missingOverviewPaths={overview.missingFields} completedOverviewPaths={overview.completedFields}
                onEdit={() => dispatch(startEditingSection(key))} />
            ))}
          </div>
          <div className="flex flex-col gap-5">
            {(['contact', 'address'] as ProfileSectionKey[]).map(key => (
              <SectionCard key={key} sectionKey={key} profile={profile} overviewSection={overviewSectionByKey.get(key)}
                missingOverviewPaths={overview.missingFields} completedOverviewPaths={overview.completedFields}
                onEdit={() => dispatch(startEditingSection(key))} />
            ))}
          </div>
        </div>

        <div className="h-4" />
      </div>

      {editingSection === 'company' && (
        <CompanyEditModal
          initial={profile.company}
          isSubmitting={updateCompany.isPending}
          error={lastSaveError}
          onCancel={closeEditor}
          onSave={body => {
            setLastSaveError(null)
            updateCompany.mutate(body, { onSuccess: closeEditor, onError: e => setLastSaveError(e.message) })
          }}
        />
      )}
      {editingSection === 'business' && (
        <BusinessEditModal
          initial={profile.business}
          isSubmitting={updateBusiness.isPending}
          error={lastSaveError}
          onCancel={closeEditor}
          onSave={body => {
            setLastSaveError(null)
            updateBusiness.mutate(body, { onSuccess: closeEditor, onError: e => setLastSaveError(e.message) })
          }}
        />
      )}
      {editingSection === 'contact' && (
        <ContactEditModal
          initial={profile.contact}
          isSubmitting={updateContact.isPending}
          error={lastSaveError}
          onCancel={closeEditor}
          onSave={body => {
            setLastSaveError(null)
            updateContact.mutate(body, { onSuccess: closeEditor, onError: e => setLastSaveError(e.message) })
          }}
        />
      )}
      {editingSection === 'address' && (
        <AddressEditModal
          initial={profile.address}
          isSubmitting={updateAddress.isPending}
          error={lastSaveError}
          onCancel={closeEditor}
          onSave={body => {
            setLastSaveError(null)
            updateAddress.mutate(body, { onSuccess: closeEditor, onError: e => setLastSaveError(e.message) })
          }}
        />
      )}
      {editingSection === 'tax' && (
        <TaxEditModal
          initial={profile.tax}
          isSubmitting={updateTax.isPending}
          error={lastSaveError}
          onCancel={closeEditor}
          onSave={body => {
            setLastSaveError(null)
            updateTax.mutate(body, { onSuccess: closeEditor, onError: e => setLastSaveError(e.message) })
          }}
        />
      )}
    </div>
  )
}

interface SectionCardProps {
  sectionKey: ProfileSectionKey
  profile: import('@/features/catererProfile/types/catererProfile.types').CatererProfileViewModel
  overviewSection: import('@/features/catererProfile/types/catererProfile.types').ProfileSectionCompletionViewModel | undefined
  missingOverviewPaths: string[]
  completedOverviewPaths: string[]
  onEdit: () => void
}

function SectionCard({ sectionKey, profile, overviewSection, missingOverviewPaths, completedOverviewPaths, onEdit }: SectionCardProps) {
  const meta = SECTION_META.find(s => s.key === sectionKey)!
  const Icon = SECTION_ICON[sectionKey]
  const fields = FIELD_CONFIG[sectionKey]
  const validationStatus = overviewSection?.validationStatus ?? 'not_started'
  const pct = overviewSection?.percentage ?? 100
  const dotColor = pct === 100 ? '#4ade80' : pct >= 60 ? '#fbbf24' : '#f87171'

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="flex items-start justify-between gap-3 px-5 py-4"
        style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: 'var(--accent-dim)', border: '1px solid var(--accent-border)' }}>
            <Icon size={15} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
          </div>
          <div className="min-w-0">
            <h2 className="text-[13.5px] font-bold truncate" style={{ color: 'var(--text-1)' }}>{meta.title}</h2>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: dotColor }} />
              <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{pct}% complete</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0 flex-wrap justify-end">
          <ValidationBadge status={validationStatus} />
          <button onClick={onEdit}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80 shrink-0"
            style={{ background: 'var(--bg-card)', color: 'var(--text-3)', border: '1px solid var(--border-default)' }}>
            <Edit3 size={12} strokeWidth={2} />Edit
          </button>
        </div>
      </div>

      {fields.map((field, idx) => {
        const rawValue = getByPath(profile, field.profilePath)
        const value = formatFieldValue(rawValue)
        const isMissing = missingOverviewPaths.includes(field.overviewPath)
        const isRequired = isMissing || completedOverviewPaths.includes(field.overviewPath)

        return (
          <div key={field.key} className="flex items-start justify-between gap-4 px-5 py-3.5"
            style={{ borderBottom: idx < fields.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
            <span className="text-[12px] font-medium shrink-0" style={{ color: 'var(--text-3)', minWidth: 140 }}>
              {field.label}
              {isRequired && <span style={{ color: '#f87171' }}> *</span>}
            </span>

            <div className="flex items-center gap-2 flex-wrap justify-end min-w-0">
              {value === null && isMissing ? (
                <>
                  <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>—</span>
                  <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
                    style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.20)' }}>
                    Required
                  </span>
                </>
              ) : value === null ? (
                <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Not provided</span>
              ) : (
                <span className="text-[12px] font-semibold text-right" style={{ color: 'var(--text-2)' }}>{value}</span>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
