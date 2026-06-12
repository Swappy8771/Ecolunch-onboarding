import { useState } from 'react'
import type { ReactNode } from 'react'
import {
  SlidersHorizontal, Users, DollarSign, Zap,
  Check, X, Settings, Star,
  FileText, BookOpen, Truck, BarChart2, CreditCard,
  MessageCircle, Wallet, Info, Save, ChevronRight,
} from 'lucide-react'
import { PageHeader } from '../../../shared/components/PageHeader'

/* ── Types ──────────────────────────────────────────────────────── */
type ModStatus = 'active' | 'inactive' | 'configured' | 'todo'

interface ModuleConfig {
  id: string
  name: string
  icon: ReactNode
  color: string
  status: ModStatus
  monthlyRate: string
  setupFee: string
  foundingPartner: boolean
  effectiveDate: string
  endDate: string
  commercialNotes: string
}

interface CatererConfig {
  id: string
  name: string
  city: string
  modules: ModuleConfig[]
}

/* ── Initial module templates ───────────────────────────────────── */
function makeModules(overrides: Partial<ModuleConfig>[]): ModuleConfig[] {
  const base: Omit<ModuleConfig, 'id'>[] = [
    { name: 'School Meals',          icon: <Truck       size={16} strokeWidth={1.8} />, color: '#60a5fa', status: 'inactive', monthlyRate: '',    setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
    { name: 'Daycare / CPE Meals',   icon: <Users       size={16} strokeWidth={1.8} />, color: '#a78bfa', status: 'inactive', monthlyRate: '',    setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
    { name: 'Camp Meals',            icon: <Truck       size={16} strokeWidth={1.8} />, color: '#fb923c', status: 'inactive', monthlyRate: '',    setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
    { name: 'ReportIQ',              icon: <BarChart2   size={16} strokeWidth={1.8} />, color: '#34d399', status: 'inactive', monthlyRate: '',    setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
    { name: 'Accounting',            icon: <BookOpen    size={16} strokeWidth={1.8} />, color: '#fbbf24', status: 'inactive', monthlyRate: '',    setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
    { name: 'Parent Subscriptions',  icon: <CreditCard  size={16} strokeWidth={1.8} />, color: '#f472b6', status: 'inactive', monthlyRate: '',    setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
    { name: 'CSS Reporting',         icon: <FileText    size={16} strokeWidth={1.8} />, color: '#22d3ee', status: 'inactive', monthlyRate: '',    setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
  ]
  return base.map((b, i) => ({ ...b, id: `m${i}`, ...overrides[i] }))
}

/* ── Mock caterer data ──────────────────────────────────────────── */
const INITIAL_CATERERS: CatererConfig[] = [
  {
    id: '1', name: 'Concept Gourmet', city: 'Montréal, QC',
    modules: makeModules([
      { status: 'active',     monthlyRate: '$150', setupFee: '$0',   foundingPartner: true,  effectiveDate: '2026-09-01', endDate: '', commercialNotes: 'Founding Partner — School Meals free for life' },
      { status: 'active',     monthlyRate: '$120', setupFee: '$0',   foundingPartner: true,  effectiveDate: '2026-09-01', endDate: '', commercialNotes: 'Founding Partner — Daycare free for life' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'configured', monthlyRate: '$80',  setupFee: '$200', foundingPartner: false, effectiveDate: '2026-09-01', endDate: '', commercialNotes: 'Included in Growth plan' },
      { status: 'todo',       monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'active',     monthlyRate: '$60',  setupFee: '$0',   foundingPartner: false, effectiveDate: '2026-09-01', endDate: '', commercialNotes: '' },
    ]),
  },
  {
    id: '2', name: 'FL', city: 'Lévis, QC',
    modules: makeModules([
      { status: 'active',     monthlyRate: '$150', setupFee: '$500', foundingPartner: false, effectiveDate: '2026-10-01', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'todo',       monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
    ]),
  },
  {
    id: '3', name: 'MSN', city: 'Saguenay, QC',
    modules: makeModules([
      { status: 'todo',     monthlyRate: '', setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive', monthlyRate: '', setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'active',   monthlyRate: '$90', setupFee: '$0', foundingPartner: true, effectiveDate: '2026-09-01', endDate: '', commercialNotes: 'Founding Partner — Camp Meals free for life' },
      { status: 'inactive', monthlyRate: '', setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive', monthlyRate: '', setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive', monthlyRate: '', setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive', monthlyRate: '', setupFee: '', foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
    ]),
  },
  {
    id: '4', name: 'ABC Catering', city: 'Québec, QC',
    modules: makeModules([
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'configured', monthlyRate: '$120', setupFee: '$300', foundingPartner: false, effectiveDate: '2026-11-01', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'configured', monthlyRate: '$60',  setupFee: '$0',   foundingPartner: false, effectiveDate: '2026-11-01', endDate: '', commercialNotes: 'CSS included in base contract' },
    ]),
  },
  {
    id: '5', name: 'Brasserie Nord', city: 'Laval, QC',
    modules: makeModules([
      { status: 'active',     monthlyRate: '$150', setupFee: '$500', foundingPartner: false, effectiveDate: '2026-07-01', endDate: '', commercialNotes: '' },
      { status: 'active',     monthlyRate: '$120', setupFee: '$0',   foundingPartner: false, effectiveDate: '2026-07-01', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'active',     monthlyRate: '$80',  setupFee: '$200', foundingPartner: false, effectiveDate: '2026-07-01', endDate: '', commercialNotes: '' },
      { status: 'active',     monthlyRate: '$100', setupFee: '$400', foundingPartner: false, effectiveDate: '2026-07-01', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
      { status: 'inactive',   monthlyRate: '',     setupFee: '',     foundingPartner: false, effectiveDate: '', endDate: '', commercialNotes: '' },
    ]),
  },
]

const INFRASTRUCTURE = [
  { name: 'EcoLoop',       icon: <MessageCircle size={15} strokeWidth={1.8} />, color: '#f87171',  desc: 'Communication & follow-up layer' },
  { name: 'Ledger',        icon: <BookOpen      size={15} strokeWidth={1.8} />, color: '#fbbf24',  desc: 'Internal financial ledger' },
  { name: 'EcoWallet',     icon: <Wallet        size={15} strokeWidth={1.8} />, color: '#34d399',  desc: 'Digital wallet & credit system' },
  { name: 'Credit Card',   icon: <CreditCard    size={15} strokeWidth={1.8} />, color: '#60a5fa',  desc: 'Payment rail' },
  { name: 'Apple Pay',     icon: <CreditCard    size={15} strokeWidth={1.8} />, color: '#a78bfa',  desc: 'Payment rail' },
  { name: 'Google Pay',    icon: <CreditCard    size={15} strokeWidth={1.8} />, color: '#4ade80',  desc: 'Payment rail' },
  { name: 'Interac Direct',icon: <CreditCard    size={15} strokeWidth={1.8} />, color: '#fb923c',  desc: 'Payment rail' },
  { name: 'Sezzle',        icon: <DollarSign    size={15} strokeWidth={1.8} />, color: '#f472b6',  desc: 'BNPL payment rail' },
]

/* ── Status helpers ─────────────────────────────────────────────── */
const STATUS_META: Record<ModStatus, { label: string; color: string; bg: string; border: string }> = {
  active:     { label: 'Active',      color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.28)'  },
  inactive:   { label: 'Inactive',    color: 'var(--text-4)', bg: 'var(--bg-inner)',   border: 'var(--border-strong)'   },
  configured: { label: 'Configured',  color: '#60a5fa', bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.28)'  },
  todo:       { label: 'To Do',       color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.28)'  },
}

function StatusPill({ status }: { status: ModStatus }) {
  const m = STATUS_META[status]
  return (
    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold whitespace-nowrap"
      style={{ background: m.bg, color: m.color, border: `1px solid ${m.border}` }}>
      <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: m.color }} />
      {m.label}
    </span>
  )
}

/* ── Global stat card ───────────────────────────────────────────── */
function GlobalStat({ value, label, color, icon }: { value: number; label: string; color: string; icon: ReactNode }) {
  return (
    <div className="relative rounded-2xl px-5 pt-5 pb-4 overflow-hidden"
      style={{ background: 'var(--bg-card)', border: `1px solid ${color}28` }}>
      <div className="absolute top-0 left-0 right-0 h-[2px]"
        style={{ background: `linear-gradient(90deg,${color}90,transparent)` }} />
      <div className="flex items-start justify-between mb-3">
        <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: color + '18', color }}>{icon}</div>
      </div>
      <div className="text-[36px] font-black tabular-nums leading-none tracking-tighter" style={{ color }}>{value}</div>
      <div className="text-[12px] font-medium mt-1.5" style={{ color: 'var(--text-3)' }}>{label}</div>
    </div>
  )
}

/* ── Module card ────────────────────────────────────────────────── */
function ModuleCard({
  mod, onConfigure,
}: {
  mod: ModuleConfig
  onConfigure: (mod: ModuleConfig) => void
}) {
  const isActive = mod.status === 'active'
  const hasPrice = mod.monthlyRate !== ''

  return (
    <div
      className="rounded-xl p-4 flex flex-col gap-3 cursor-pointer transition-all"
      style={{
        background: 'var(--bg-surface)',
        border: `1px solid ${isActive ? 'var(--accent-border)' : 'var(--border-default)'}`,
      }}
      onClick={() => onConfigure(mod)}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: mod.color + '18', color: mod.color }}>
            {mod.icon}
          </div>
          <span className="text-[13px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
            {mod.name}
          </span>
        </div>
        <StatusPill status={mod.status} />
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        {hasPrice && (
          <span className="text-[12px] font-bold px-2 py-0.5 rounded-lg"
            style={{ background: 'var(--bg-inner)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
            {mod.monthlyRate}/mo
          </span>
        )}
        {mod.foundingPartner && (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold"
            style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)' }}>
            <Star size={9} strokeWidth={2.5} fill="#fbbf24" /> Founding Partner
          </span>
        )}
        {mod.effectiveDate && (
          <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>
            From {mod.effectiveDate}
          </span>
        )}
      </div>

      <button
        className="flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[12px] font-medium w-full"
        style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}
        onClick={e => { e.stopPropagation(); onConfigure(mod) }}
      >
        <Settings size={12} strokeWidth={2} /> Configure
        <ChevronRight size={11} strokeWidth={2} className="ml-auto" />
      </button>
    </div>
  )
}

/* ── Config slide-over ──────────────────────────────────────────── */
function ConfigPanel({
  mod, catererName, onClose, onSave,
}: {
  mod: ModuleConfig
  catererName: string
  onClose: () => void
  onSave: (updated: ModuleConfig) => void
}) {
  const [form, setForm] = useState<ModuleConfig>({ ...mod })

  function field(label: string, key: keyof ModuleConfig, type = 'text', placeholder = '') {
    return (
      <div>
        <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>{label}</label>
        <input
          type={type}
          placeholder={placeholder}
          value={form[key] as string}
          onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
          className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none"
          style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
        />
      </div>
    )
  }

  const statusOptions: ModStatus[] = ['active', 'inactive', 'configured', 'todo']

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/40" onClick={onClose} />
      <div className="w-full max-w-md flex flex-col overflow-hidden"
        style={{ background: 'var(--bg-surface)', borderLeft: '1px solid var(--border-default)' }}>

        <div className="flex items-center justify-between px-6 py-4 shrink-0"
          style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: mod.color + '18', color: mod.color }}>{mod.icon}</div>
            <div>
              <div className="text-[14px] font-bold" style={{ color: 'var(--text-1)' }}>{mod.name}</div>
              <div className="text-[11px]" style={{ color: 'var(--text-4)' }}>{catererName}</div>
            </div>
          </div>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-lg cursor-pointer"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-3)' }}>
            <X size={13} strokeWidth={2} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>Status</label>
            <div className="flex gap-2 flex-wrap">
              {statusOptions.map(s => {
                const m = STATUS_META[s]
                return (
                  <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))}
                    className="px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer transition-all"
                    style={{
                      background: form.status === s ? m.bg : 'var(--bg-inner)',
                      color: form.status === s ? m.color : 'var(--text-4)',
                      border: `1px solid ${form.status === s ? m.border : 'var(--border-strong)'}`,
                    }}>
                    {m.label}
                  </button>
                )
              })}
            </div>
          </div>

          {field('Monthly Rate (SaaS)', 'monthlyRate', 'text', '$150')}
          {field('Setup Fee', 'setupFee', 'text', '$0')}
          {field('Effective Date', 'effectiveDate', 'date')}
          {field('End Date (if applicable)', 'endDate', 'date')}

          <div className="flex items-center gap-3 p-3 rounded-xl"
            style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
            <button onClick={() => setForm(f => ({ ...f, foundingPartner: !f.foundingPartner }))}
              className="w-9 h-5 rounded-full transition-all relative cursor-pointer shrink-0"
              style={{ background: form.foundingPartner ? '#fbbf24' : 'var(--border-strong)' }}>
              <span className="absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all"
                style={{ left: form.foundingPartner ? '19px' : '2px' }} />
            </button>
            <div>
              <div className="text-[13px] font-semibold flex items-center gap-1.5" style={{ color: 'var(--text-1)' }}>
                <Star size={12} strokeWidth={2} style={{ color: '#fbbf24' }} /> Founding Partner — Free for life
              </div>
              <div className="text-[11px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                Overrides monthly rate — no charge applied
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[9.5px] uppercase tracking-[0.13em] font-semibold mb-1.5" style={{ color: 'var(--text-4)' }}>Commercial Notes</label>
            <textarea
              rows={3}
              placeholder="Notes for contract merge fields, exceptions, discounts…"
              value={form.commercialNotes}
              onChange={e => setForm(f => ({ ...f, commercialNotes: e.target.value }))}
              className="w-full px-3 py-2.5 rounded-xl text-[13px] outline-none resize-none"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)', color: 'var(--text-1)' }}
            />
          </div>

          <div className="rounded-xl p-4" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
            <div className="text-[11px] uppercase tracking-[0.12em] font-bold mb-3" style={{ color: 'var(--text-4)' }}>
              Configurable Rules
            </div>
            {['Payout rules', 'Cutoff rules', 'Credit rules', 'Labels', 'Notifications', 'Reports'].map(rule => (
              <div key={rule} className="flex items-center justify-between py-2"
                style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <span className="text-[12.5px]" style={{ color: 'var(--text-2)' }}>{rule}</span>
                <span className="text-[11px] px-2 py-0.5 rounded-lg" style={{ background: 'var(--bg-card)', color: 'var(--text-4)', border: '1px solid var(--border-strong)' }}>
                  Configure →
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="px-6 py-4 flex gap-3 shrink-0" style={{ borderTop: '1px solid var(--border-default)' }}>
          <button onClick={onClose}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
            Cancel
          </button>
          <button onClick={() => onSave(form)}
            className="flex-1 py-2.5 rounded-xl text-[13px] font-semibold cursor-pointer flex items-center justify-center gap-2"
            style={{ background: 'var(--accent)', color: '#07070a' }}>
            <Save size={13} strokeWidth={2} /> Save Configuration
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Page ───────────────────────────────────────────────────────── */
export function ModulesPricing() {
  const [caterers, setCaterers] = useState<CatererConfig[]>(INITIAL_CATERERS)
  const [selectedCatererId, setSelectedCatererId] = useState('1')
  const [configuring, setConfiguring] = useState<ModuleConfig | null>(null)

  const caterer = caterers.find(c => c.id === selectedCatererId)!

  const totalActivated = caterers.reduce((acc, c) =>
    acc + c.modules.filter(m => m.status === 'active').length, 0)
  const totalPending = caterers.reduce((acc, c) =>
    acc + c.modules.filter(m => m.status === 'todo').length, 0)
  const foundingPartners = caterers.reduce((acc, c) =>
    acc + c.modules.filter(m => m.foundingPartner).length, 0)
  const totalConfigured = caterers.reduce((acc, c) =>
    acc + c.modules.filter(m => m.status === 'active' || m.status === 'configured').length, 0)

  function handleSave(updated: ModuleConfig) {
    setCaterers(prev => prev.map(c =>
      c.id === selectedCatererId
        ? { ...c, modules: c.modules.map(m => m.id === updated.id ? updated : m) }
        : c
    ))
    setConfiguring(null)
  }

  return (
    <div className="p-4 lg:p-7 max-w-[1400px]">
      <PageHeader
        badge={{ icon: <SlidersHorizontal size={13} strokeWidth={2.5} />, label: 'Modules, Pricing & Configurations' }}
        title="Modules, Pricing & Configurations"
        subtitle="Configure activable modules and SaaS pricing per caterer. Values feed directly into Contract Management merge fields."
        size="hero"
        glowColor="rgba(163,230,53,0.06)"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-7">
        <GlobalStat value={totalActivated}  label="Modules activated"     color="#4ade80" icon={<Zap     size={16} strokeWidth={2} />} />
        <GlobalStat value={totalConfigured} label="Configured / Active"   color="#60a5fa" icon={<Check   size={16} strokeWidth={2} />} />
        <GlobalStat value={totalPending}    label="Pending configuration"  color="#fbbf24" icon={<Info    size={16} strokeWidth={2} />} />
        <GlobalStat value={foundingPartners}label="Founding Partner slots" color="#fbbf24" icon={<Star    size={16} strokeWidth={2} />} />
      </div>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-[12px] font-medium shrink-0" style={{ color: 'var(--text-4)' }}>Caterer</span>
        <div className="flex gap-2 flex-wrap">
          {caterers.map(c => {
            const active = c.id === selectedCatererId
            const hasIssues = c.modules.some(m => m.status === 'todo')
            return (
              <button key={c.id}
                onClick={() => setSelectedCatererId(c.id)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-[13px] font-medium cursor-pointer transition-all"
                style={{
                  background: active ? 'var(--accent-dim)' : 'var(--bg-card)',
                  color: active ? 'var(--accent)' : 'var(--text-2)',
                  border: `1px solid ${active ? 'var(--accent-border)' : 'var(--border-default)'}`,
                }}>
                {c.name}
                {hasIssues && (
                  <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: '#fbbf24' }} />
                )}
              </button>
            )
          })}
        </div>
      </div>

      <div className="rounded-2xl p-5 mb-6"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-center justify-between mb-5">
          <div>
            <div className="text-[18px] font-bold" style={{ color: 'var(--text-1)' }}>{caterer.name}</div>
            <div className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>{caterer.city}</div>
          </div>
          <div className="flex gap-2">
            <span className="text-[12px] px-3 py-1.5 rounded-lg font-medium"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
              {caterer.modules.filter(m => m.status === 'active').length} / {caterer.modules.length} active
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {caterer.modules.map(mod => (
            <ModuleCard key={mod.id} mod={mod} onConfigure={setConfiguring} />
          ))}
        </div>
      </div>

      <div className="rounded-2xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Info size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
          <span className="text-[12px] font-semibold uppercase tracking-[0.12em]" style={{ color: 'var(--text-4)' }}>
            Infrastructure — Not configurable modules
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
          {INFRASTRUCTURE.map(infra => (
            <div key={infra.name}
              className="rounded-xl px-3 py-3 flex flex-col items-center gap-1.5 text-center"
              style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-strong)' }}>
              <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                style={{ background: infra.color + '18', color: infra.color }}>
                {infra.icon}
              </div>
              <span className="text-[11px] font-semibold leading-tight" style={{ color: 'var(--text-3)' }}>{infra.name}</span>
              <span className="text-[9.5px]" style={{ color: 'var(--text-4)' }}>{infra.desc}</span>
            </div>
          ))}
        </div>
      </div>

      {configuring && (
        <ConfigPanel
          mod={configuring}
          catererName={caterer.name}
          onClose={() => setConfiguring(null)}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
