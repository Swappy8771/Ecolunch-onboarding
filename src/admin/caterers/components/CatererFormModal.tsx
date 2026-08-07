import { useState } from 'react'
import { Check, X, ChevronDown, Search, User as UserIcon } from 'lucide-react'
import { InlineLoader } from '@shared/ui/InlineLoader'
import { isValidationError, type ApiError } from '@/api/client/errors'
import { useUsersList } from '@/features/adminUsers/hooks/useUsersList'
import { EMPTY_CATERER_FORM_INPUT } from '@/features/adminCaterers/types/caterer.types'
import type { CatererFormInput, CatererOrganizationType, CatererRegion, CatererVertical } from '@/features/adminCaterers/types/caterer.types'

const ALL_VERTICALS: CatererVertical[] = ['Schools', 'Daycares', 'Camps', 'CSS']

const ORGANIZATION_TYPES: { value: CatererOrganizationType; label: string }[] = [
  { value: 'sole_proprietor', label: 'Sole Proprietor' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'corporation', label: 'Corporation' },
  { value: 'cooperative', label: 'Cooperative' },
  { value: 'non_profit', label: 'Non-Profit' },
  { value: 'other', label: 'Other' },
]

/**
 * Zod's `.flatten()` (what the backend sends as `error.details` on a 400)
 * only separates errors by top-level schema key — nested objects
 * (`primaryContact`, `address`, etc.) come back as one message for the
 * whole object, not per-nested-field. Surfacing per-section rather than
 * per-nested-input is the honest granularity available, not an invented
 * approximation of finer detail the backend doesn't actually provide.
 */
interface ZodFlattenedError {
  formErrors?: string[]
  fieldErrors?: Record<string, string[] | undefined>
}

function extractValidationMessages(error: ApiError): string[] {
  if (!isValidationError(error)) return []
  const details = error.details as ZodFlattenedError | undefined
  if (!details) return [error.message]
  const fieldMessages = Object.entries(details.fieldErrors ?? {}).flatMap(
    ([field, messages]) => (messages ?? []).map(m => `${field}: ${m}`),
  )
  return [...(details.formErrors ?? []), ...fieldMessages]
}

function Field({ label, required, placeholder, value, onChange, disabled, type = 'text' }: {
  label: string
  required?: boolean
  placeholder?: string
  value: string
  onChange: (v: string) => void
  disabled?: boolean
  type?: string
}) {
  return (
    <div>
      <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>
        {label}{required && ' *'}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
        className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none disabled:opacity-50"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
      />
    </div>
  )
}

function SectionLabel({ children }: { children: string }) {
  return (
    <p className="text-[10.5px] uppercase tracking-[0.14em] font-bold mt-2" style={{ color: '#a3e635' }}>{children}</p>
  )
}

function AssignedAdminPicker({ value, onChange, disabled }: {
  value: string | null
  onChange: (id: string | null) => void
  disabled?: boolean
}) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const { data: options, isLoading } = useUsersList(search)
  const selected = options?.find(o => o.id === value) ?? null

  return (
    <div className="relative">
      <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>Assigned Admin</label>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        disabled={disabled}
        className="w-full flex items-center justify-between gap-2 px-4 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer disabled:opacity-50"
        style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: selected ? 'var(--text-1)' : 'var(--text-4)' }}
      >
        <span className="flex items-center gap-2 truncate">
          <UserIcon size={13} strokeWidth={1.8} style={{ flexShrink: 0 }} />
          {selected ? `${selected.fullName} · ${selected.email}` : 'Unassigned'}
        </span>
        <ChevronDown size={12} strokeWidth={2} style={{ flexShrink: 0 }} />
      </button>

      {open && (
        <div className="absolute z-20 mt-1.5 w-full rounded-xl overflow-hidden"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', boxShadow: '0 16px 48px rgba(0,0,0,0.4)' }}>
          <div className="p-2 relative">
            <Search size={12} strokeWidth={1.8} className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
            <input
              autoFocus
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search admins…"
              className="w-full pl-7 pr-2 py-2 rounded-lg text-[12.5px] outline-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-2)' }}
            />
          </div>
          <div className="max-h-[180px] overflow-y-auto">
            <button type="button" onClick={() => { onChange(null); setOpen(false) }}
              className="w-full text-left px-4 py-2 text-[12.5px] cursor-pointer" style={{ color: 'var(--text-4)' }}>
              Unassigned
            </button>
            {isLoading && (
              <div className="flex items-center gap-2 px-4 py-2.5"><InlineLoader size={12} /><span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Loading…</span></div>
            )}
            {!isLoading && (options ?? []).length === 0 && (
              <div className="px-4 py-2.5 text-[12px]" style={{ color: 'var(--text-4)' }}>No admins found.</div>
            )}
            {(options ?? []).map(o => (
              <button key={o.id} type="button" onClick={() => { onChange(o.id); setOpen(false) }}
                className="w-full text-left px-4 py-2 text-[12.5px] cursor-pointer"
                style={{ color: o.id === value ? '#a3e635' : 'var(--text-2)' }}>
                {o.fullName} <span style={{ color: 'var(--text-4)' }}>· {o.email}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export interface CatererFormModalProps {
  mode: 'create' | 'edit'
  initialValue?: CatererFormInput
  onClose: () => void
  onSubmit: (input: CatererFormInput) => void
  submitting: boolean
  error?: ApiError | null
}

export function CatererFormModal({ mode, initialValue, onClose, onSubmit, submitting, error }: CatererFormModalProps) {
  const [form, setForm] = useState<CatererFormInput>(initialValue ?? EMPTY_CATERER_FORM_INPUT)

  function set<K extends keyof CatererFormInput>(key: K, value: CatererFormInput[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  function toggleVertical(v: CatererVertical) {
    setForm(prev => {
      const has = prev.verticals.includes(v)
      return { ...prev, verticals: has ? prev.verticals.filter(x => x !== v) : [...prev.verticals, v] }
    })
  }

  const canSubmit = form.companyName.trim().length > 0 && form.legalName.trim().length > 0 && !submitting
  const isValidation = error ? isValidationError(error) : false
  const validationMessages = error ? extractValidationMessages(error) : []
  const genericErrorMessage = error && !isValidation ? error.message : null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.72)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl p-7 flex flex-col gap-4"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>

        <div className="flex items-start justify-between">
          <div>
            <p className="text-[10px] uppercase tracking-[0.14em] font-semibold mb-1" style={{ color: '#a3e635' }}>Onboarding Queue</p>
            <h2 className="text-[18px] font-bold mb-1" style={{ color: 'var(--text-1)' }}>{mode === 'create' ? 'New Caterer' : 'Edit Caterer'}</h2>
            <p className="text-[12.5px]" style={{ color: 'var(--text-3)' }}>
              {mode === 'create' ? "Launch a new onboarding. All fields can be completed later via the workspace." : 'Update this caterer\'s profile.'}
            </p>
          </div>
          <button onClick={onClose} className="mt-0.5 cursor-pointer p-1 rounded-lg transition-colors" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2} />
          </button>
        </div>

        {(validationMessages.length > 0 || genericErrorMessage) && (
          <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
            {genericErrorMessage && <p className="text-[12.5px]" style={{ color: '#f87171' }}>{genericErrorMessage}</p>}
            {validationMessages.map(m => (
              <p key={m} className="text-[12.5px]" style={{ color: '#f87171' }}>{m}</p>
            ))}
          </div>
        )}

        <SectionLabel>Business Information</SectionLabel>
        <Field label="Business name" required placeholder="e.g. Concept Gourmet" value={form.companyName} onChange={v => set('companyName', v)} disabled={submitting} />
        <div className="grid grid-cols-2 gap-3">
          <Field label="Legal name" required placeholder="e.g. Concept Gourmet Inc." value={form.legalName} onChange={v => set('legalName', v)} disabled={submitting} />
          <Field label="Trading name" placeholder="e.g. Concept Gourmet" value={form.tradingName} onChange={v => set('tradingName', v)} disabled={submitting} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>Organization type</label>
            <select value={form.organizationType} onChange={e => set('organizationType', e.target.value as CatererOrganizationType | '')} disabled={submitting}
              className="w-full px-4 py-2.5 rounded-xl text-[13px] outline-none cursor-pointer disabled:opacity-50"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}>
              <option value="">—</option>
              {ORGANIZATION_TYPES.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
          <Field label="Founded year" placeholder="e.g. 2015" type="number" value={form.foundedYear} onChange={v => set('foundedYear', v)} disabled={submitting} />
        </div>
        <Field label="Website" placeholder="https://example.com" value={form.website} onChange={v => set('website', v)} disabled={submitting} />

        <SectionLabel>Location</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          <Field label="City" placeholder="e.g. Montréal" value={form.city} onChange={v => set('city', v)} disabled={submitting} />
          <Field label="Province / State" placeholder="e.g. QC" value={form.address.region} onChange={v => set('address', { ...form.address, region: v })} disabled={submitting} />
          <Field label="Country" placeholder="e.g. Canada" value={form.address.country} onChange={v => set('address', { ...form.address, country: v })} disabled={submitting} />
        </div>
        <div>
          <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>Jurisdiction</label>
          <div className="flex items-center gap-2">
            {(['qc', 'fr'] as CatererRegion[]).map(r => (
              <button key={r} type="button" onClick={() => set('region', r)} disabled={submitting}
                className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-all disabled:opacity-50"
                style={form.region === r ? { background: '#a3e635', color: '#07070a' } : { background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                {r === 'qc' ? 'Quebec' : 'France'}
              </button>
            ))}
          </div>
        </div>

        <SectionLabel>Served Verticals</SectionLabel>
        <div className="flex items-center gap-2 flex-wrap">
          {ALL_VERTICALS.map(v => {
            const on = form.verticals.includes(v)
            return (
              <button key={v} type="button" onClick={() => toggleVertical(v)} disabled={submitting}
                className="px-3.5 py-1.5 rounded-full text-[12px] font-semibold cursor-pointer transition-all disabled:opacity-50"
                style={on ? { background: '#a3e635', color: '#07070a' } : { background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                {v}
              </button>
            )
          })}
        </div>

        <SectionLabel>Assigned Admin</SectionLabel>
        <AssignedAdminPicker value={form.assignedAdminId} onChange={id => set('assignedAdminId', id)} disabled={submitting} />

        <SectionLabel>Primary Contact</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" value={form.primaryContact.name} onChange={v => set('primaryContact', { ...form.primaryContact, name: v })} disabled={submitting} />
          <Field label="Title / Role" value={form.primaryContact.title} onChange={v => set('primaryContact', { ...form.primaryContact, title: v })} disabled={submitting} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Email" type="email" value={form.primaryContact.email} onChange={v => set('primaryContact', { ...form.primaryContact, email: v })} disabled={submitting} />
          <Field label="Phone" value={form.primaryContact.phone} onChange={v => set('primaryContact', { ...form.primaryContact, phone: v })} disabled={submitting} />
        </div>

        <SectionLabel>Secondary Contact</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" value={form.secondaryContact.name} onChange={v => set('secondaryContact', { ...form.secondaryContact, name: v })} disabled={submitting} />
          <Field label="Email" type="email" value={form.secondaryContact.email} onChange={v => set('secondaryContact', { ...form.secondaryContact, email: v })} disabled={submitting} />
        </div>

        <SectionLabel>Address</SectionLabel>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Street address" value={form.address.line1} onChange={v => set('address', { ...form.address, line1: v })} disabled={submitting} />
          <Field label="Postal code" value={form.address.postalCode} onChange={v => set('address', { ...form.address, postalCode: v })} disabled={submitting} />
        </div>

        <SectionLabel>Tax Information</SectionLabel>
        <div className="grid grid-cols-3 gap-3">
          <Field label="NEQ Number" value={form.tax.neqNumber} onChange={v => set('tax', { ...form.tax, neqNumber: v })} disabled={submitting} />
          <Field label="SIREN Number" value={form.tax.sirenNumber} onChange={v => set('tax', { ...form.tax, sirenNumber: v })} disabled={submitting} />
          <Field label="VAT Number" value={form.tax.vatNumber} onChange={v => set('tax', { ...form.tax, vatNumber: v })} disabled={submitting} />
        </div>

        <div className="flex items-center justify-end gap-2.5 pt-3 border-t mt-1" style={{ borderColor: 'var(--border-subtle)' }}>
          <button onClick={onClose} disabled={submitting}
            className="px-5 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-80 disabled:opacity-50"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
            Cancel
          </button>
          <button onClick={() => canSubmit && onSubmit(form)} disabled={!canSubmit}
            className="flex items-center gap-1.5 px-5 py-2.5 rounded-full text-[13px] font-semibold cursor-pointer transition-opacity hover:opacity-85 disabled:opacity-50"
            style={{ background: '#a3e635', color: '#07070a' }}>
            {submitting ? <InlineLoader size={13} /> : <Check size={13} strokeWidth={2.5} />}
            {submitting ? (mode === 'create' ? 'Creating…' : 'Saving…') : (mode === 'create' ? 'Create caterer' : 'Save changes')}
          </button>
        </div>
      </div>
    </div>
  )
}
