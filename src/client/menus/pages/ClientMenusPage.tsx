import { useState } from 'react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import {
  BookOpen, Baby, Tent,
  UtensilsCrossed, RotateCcw, Package,
  Upload, Sparkles, CheckCircle2, XCircle, Lock,
  AlertTriangle, FileText, Eye, RefreshCcw, Send,
  ChevronDown, ChevronUp, Check, X,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

// ─── Types ───────────────────────────────────────────────────

type SectionState    = 'empty' | 'review' | 'approved' | 'submitted' | 'rejected'
type ItemState       = 'pending' | 'approved' | 'rejected'
type ConfidenceLevel = 'high' | 'medium' | 'low'

interface ExtractedItem {
  id: string; name: string; description: string
  allergens: string[]; confidence: ConfidenceLevel
}

interface SectionConfig {
  id: string; title: string; description: string
  Icon: LucideIcon; initialState: SectionState
  fileName: string | null; fileSize: string | null; uploadDate: string | null
  extractedItems: ExtractedItem[]
}

// ─── Module config ────────────────────────────────────────────

const ACTIVE_MODULES = { schoolMeals: true, daycare: true, campMeals: false } as const

// ─── Mock extracted items per section ────────────────────────

const SCHOOL_MENU_ITEMS: ExtractedItem[] = [
  { id: 'sm1', name: 'Poulet Rôti & Légumes', description: 'Cuisse de poulet rôtie avec carottes et haricots verts', allergens: ['Gluten'], confidence: 'high' },
  { id: 'sm2', name: 'Poisson Pané', description: 'Filet de merlu pané, purée de pommes de terre', allergens: ['Gluten', 'Poisson', 'Lait'], confidence: 'high' },
  { id: 'sm3', name: 'Quiche Lorraine', description: 'Quiche maison aux lardons et fromage', allergens: ['Gluten', 'Œufs', 'Lait'], confidence: 'medium' },
  { id: 'sm4', name: 'Sauté de Bœuf', description: 'Sauté de bœuf à la tomate, pâtes complètes', allergens: ['Gluten'], confidence: 'high' },
  { id: 'sm5', name: 'Gratin de Courgettes', description: 'Gratin de courgettes au chèvre frais', allergens: ['Lait'], confidence: 'low' },
]

const COMMON_MEAL_ITEMS: ExtractedItem[] = [
  { id: 'cm1', name: 'Soupe de Légumes', description: 'Potage maison de légumes de saison', allergens: [], confidence: 'high' },
  { id: 'cm2', name: 'Pain complet artisanal', description: 'Tranche de pain complet au levain', allergens: ['Gluten'], confidence: 'high' },
  { id: 'cm3', name: 'Yaourt nature', description: 'Yaourt nature local, sans additifs', allergens: ['Lait'], confidence: 'high' },
]

const DAYCARE_MENU_ITEMS: ExtractedItem[] = [
  { id: 'dm1', name: 'Purée Carottes-Patate Douce', description: 'Purée lisse carottes et patate douce, huile d\'olive', allergens: [], confidence: 'high' },
  { id: 'dm2', name: 'Compote Pomme-Poire', description: 'Compote sans sucre ajouté, pommes et poires', allergens: [], confidence: 'high' },
  { id: 'dm3', name: 'Semoule au Lait', description: 'Semoule fine de blé cuite au lait entier', allergens: ['Gluten', 'Lait'], confidence: 'medium' },
]

const DAYCARE_PKG_ITEMS: ExtractedItem[] = [
  { id: 'dp1', name: 'Forfait Nourrisson (4-6 mois)', description: 'Déjeuner + goûter — textures lisses', allergens: [], confidence: 'high' },
  { id: 'dp2', name: 'Forfait Diversification (6-12 mois)', description: 'Déjeuner + goûter — textures épaissies', allergens: [], confidence: 'high' },
  { id: 'dp3', name: 'Forfait Éveil (12-24 mois)', description: 'Déjeuner + goûter — morceaux mous', allergens: ['Gluten', 'Lait'], confidence: 'medium' },
]

// ─── Section definitions ──────────────────────────────────────

const SCHOOL_SECTIONS: SectionConfig[] = [
  {
    id: 'school-menus', title: 'School Menus', Icon: UtensilsCrossed,
    description: 'Upload the main school meal menu listing all dishes offered per day.',
    initialState: 'review', fileName: 'School_Menu_Sept2025.pdf', fileSize: '1.2 MB', uploadDate: '2025-09-02',
    extractedItems: SCHOOL_MENU_ITEMS,
  },
  {
    id: 'common-meals', title: 'Common Meals', Icon: UtensilsCrossed,
    description: 'Upload items served across multiple schools — soups, breads, yogurts.',
    initialState: 'approved', fileName: 'Common_Meals_2025.xlsx', fileSize: '320 KB', uploadDate: '2025-09-01',
    extractedItems: COMMON_MEAL_ITEMS,
  },
  {
    id: 'rotating-cycle', title: 'Rotating Cycle', Icon: RotateCcw,
    description: 'Upload the multi-week rotating meal cycle document for planning.',
    initialState: 'empty', fileName: null, fileSize: null, uploadDate: null,
    extractedItems: [],
  },
]

const DAYCARE_SECTIONS: SectionConfig[] = [
  {
    id: 'daycare-menus', title: 'Daycare Menus', Icon: UtensilsCrossed,
    description: 'Upload the daycare / CPE menu document with age-appropriate dishes.',
    initialState: 'review', fileName: 'CPE_Menu_Automne2025.pdf', fileSize: '850 KB', uploadDate: '2025-09-03',
    extractedItems: DAYCARE_MENU_ITEMS,
  },
  {
    id: 'daycare-packages', title: 'Daycare Packages', Icon: Package,
    description: 'Upload meal package definitions grouped by age range or dietary needs.',
    initialState: 'review', fileName: 'CPE_Forfaits_2025.pdf', fileSize: '640 KB', uploadDate: '2025-09-03',
    extractedItems: DAYCARE_PKG_ITEMS,
  },
]

// ─── Confidence meta ──────────────────────────────────────────

const CONFIDENCE_META: Record<ConfidenceLevel, { label: string; color: string; bg: string; border: string }> = {
  high:   { label: 'High',   color: '#4ade80', bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)'  },
  medium: { label: 'Medium', color: '#fbbf24', bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)'  },
  low:    { label: 'Low',    color: '#f87171', bg: 'rgba(248,113,113,0.10)', border: 'rgba(248,113,113,0.25)' },
}

const STATE_META: Record<SectionState, { label: string; color: string; bg: string; border: string }> = {
  empty:     { label: 'Not Uploaded',      color: 'var(--text-4)', bg: 'var(--bg-inner)',          border: 'var(--border-default)'      },
  review:    { label: 'Awaiting Review',   color: '#fbbf24',        bg: 'rgba(251,191,36,0.12)',    border: 'rgba(251,191,36,0.25)'      },
  approved:  { label: 'Approved',          color: '#4ade80',        bg: 'rgba(74,222,128,0.12)',    border: 'rgba(74,222,128,0.25)'      },
  submitted: { label: 'Submitted',         color: '#60a5fa',        bg: 'rgba(96,165,250,0.12)',    border: 'rgba(96,165,250,0.25)'      },
  rejected:  { label: 'Rejected',          color: '#f87171',        bg: 'rgba(248,113,113,0.10)',   border: 'rgba(248,113,113,0.25)'     },
}

// ─── Shared primitives ────────────────────────────────────────

function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  )
}

function ActionBtn({
  icon, label, onClick, color = 'var(--text-3)', bg = 'var(--bg-inner)', border = 'var(--border-default)', full = false,
}: {
  icon: React.ReactNode; label: string; onClick: () => void
  color?: string; bg?: string; border?: string; full?: boolean
}) {
  return (
    <button onClick={onClick}
      className={`flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-[12px] font-semibold cursor-pointer transition-opacity hover:opacity-80 shrink-0${full ? ' flex-1' : ''}`}
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {icon}
      {label}
    </button>
  )
}

// ─── Upload Zone ──────────────────────────────────────────────

function UploadZone({ onUpload, small = false }: { onUpload: () => void; small?: boolean }) {
  return (
    <button onClick={onUpload}
      className={`w-full flex flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed cursor-pointer transition-colors hover:border-[color:var(--accent)] group ${small ? 'py-6' : 'py-10'}`}
      style={{ borderColor: 'var(--border-strong)', background: 'var(--bg-inner)' }}>
      <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors group-hover:bg-[color:var(--accent-dim)]"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
        <Upload size={17} strokeWidth={1.8} style={{ color: 'var(--accent)' }} />
      </div>
      <div className="text-center">
        <p className="text-[13px] font-bold" style={{ color: 'var(--text-2)' }}>
          Upload file or drag &amp; drop
        </p>
        <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
          PDF, Excel, CSV &nbsp;·&nbsp; Max 10 MB
        </p>
      </div>
      <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold"
        style={{ background: 'var(--accent)', color: '#07070a' }}>
        <Upload size={12} strokeWidth={2.5} />
        Choose File
      </span>
    </button>
  )
}

// ─── File strip (shown after upload) ─────────────────────────

function FileStrip({
  fileName, fileSize, uploadDate, onReplace,
}: {
  fileName: string; fileSize: string; uploadDate: string; onReplace: () => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 rounded-xl flex-wrap"
      style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
        style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)' }}>
        <FileText size={14} strokeWidth={1.8} style={{ color: '#60a5fa' }} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{fileName}</p>
        <p className="text-[11px]" style={{ color: 'var(--text-4)' }}>
          {fileSize} &nbsp;·&nbsp; Uploaded {uploadDate}
        </p>
      </div>
      <button onClick={onReplace}
        className="flex items-center gap-1 text-[11.5px] font-semibold cursor-pointer transition-opacity hover:opacity-70"
        style={{ color: 'var(--text-4)' }}>
        <RefreshCcw size={11} strokeWidth={2} />Replace
      </button>
    </div>
  )
}

// ─── Smart Import Notice ──────────────────────────────────────

function ImportNotice({ count }: { count: number }) {
  return (
    <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
      style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.22)' }}>
      <AlertTriangle size={14} strokeWidth={2} style={{ color: '#fbbf24', marginTop: 1, flexShrink: 0 }} />
      <div>
        <p className="text-[12.5px] font-bold" style={{ color: '#fbbf24' }}>
          Smart Import — Human Review Required
        </p>
        <p className="text-[11.5px] mt-0.5 leading-snug" style={{ color: 'var(--text-4)' }}>
          {count} item{count !== 1 ? 's' : ''} extracted. <strong>No data will be applied until you approve it.</strong>{' '}
          Review each item below and approve or reject before submitting for EcoLunch validation.
        </p>
      </div>
    </div>
  )
}

// ─── Review Table ─────────────────────────────────────────────

const ALLERGEN_COLORS: Record<string, string> = {
  Gluten: '#f87171', Lait: '#fbbf24', Œufs: '#a3e635',
  Poisson: '#60a5fa', default: 'var(--text-4)',
}

function ReviewTable({
  items, itemStates, onApproveItem, onRejectItem, onApproveAll, onRejectAll,
}: {
  items: ExtractedItem[]
  itemStates: Record<string, ItemState>
  onApproveItem: (id: string) => void
  onRejectItem: (id: string) => void
  onApproveAll: () => void
  onRejectAll: () => void
}) {
  const approvedCount = Object.values(itemStates).filter(s => s === 'approved').length
  const rejectedCount = Object.values(itemStates).filter(s => s === 'rejected').length
  const pendingCount  = Object.values(itemStates).filter(s => s === 'pending').length

  return (
    <div className="flex flex-col gap-0 rounded-xl overflow-hidden"
      style={{ border: '1px solid var(--border-default)' }}>

      {/* Table top bar */}
      <div className="flex items-center justify-between px-4 py-2.5 flex-wrap gap-2"
        style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-2.5 flex-wrap">
          <span className="flex items-center gap-1.5">
            <Sparkles size={12} strokeWidth={2} style={{ color: 'var(--accent)' }} />
            <span className="text-[12px] font-bold" style={{ color: 'var(--text-2)' }}>
              Smart Import Results
            </span>
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full"
            style={{ background: 'var(--bg-card)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
            {approvedCount} approved &nbsp;·&nbsp; {rejectedCount} rejected &nbsp;·&nbsp; {pendingCount} pending
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={onApproveAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11.5px] font-bold cursor-pointer hover:opacity-80"
            style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
            <Check size={10} strokeWidth={3} />Approve All
          </button>
          <button onClick={onRejectAll}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[11.5px] font-bold cursor-pointer hover:opacity-80"
            style={{ background: 'rgba(248,113,113,0.10)', color: '#f87171', border: '1px solid rgba(248,113,113,0.22)' }}>
            <X size={10} strokeWidth={3} />Reject All
          </button>
        </div>
      </div>

      {/* Desktop header */}
      <div className="hidden md:grid px-4 py-2 gap-3"
        style={{ gridTemplateColumns: '1fr 1fr 130px 70px 96px', background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        {['Dish / Item', 'Description', 'Allergens', 'Confidence', 'Decision'].map(h => (
          <span key={h} className="text-[10.5px] uppercase tracking-[0.11em] font-bold" style={{ color: 'var(--text-4)' }}>{h}</span>
        ))}
      </div>

      {/* Rows */}
      {items.map((item, idx) => {
        const state = itemStates[item.id] ?? 'pending'
        const cm = CONFIDENCE_META[item.confidence]
        const isApproved = state === 'approved'
        const isRejected = state === 'rejected'
        const rowBorder = idx < items.length - 1 ? '1px solid var(--border-subtle)' : 'none'

        return (
          <div key={item.id} style={{ borderBottom: rowBorder, opacity: isRejected ? 0.55 : 1 }}>
            {/* Desktop row */}
            <div className="hidden md:grid items-center px-4 py-3 gap-3"
              style={{
                gridTemplateColumns: '1fr 1fr 130px 70px 96px',
                background: isApproved ? 'rgba(74,222,128,0.04)' : isRejected ? 'rgba(248,113,113,0.04)' : 'transparent',
              }}>
              <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{item.name}</p>
              <p className="text-[12px] truncate leading-snug" style={{ color: 'var(--text-4)' }}>{item.description}</p>
              <div className="flex flex-wrap gap-1">
                {item.allergens.length > 0
                  ? item.allergens.map(a => (
                    <span key={a} className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: `${ALLERGEN_COLORS[a] ?? ALLERGEN_COLORS.default}18`,
                        color: ALLERGEN_COLORS[a] ?? ALLERGEN_COLORS.default,
                        border: `1px solid ${ALLERGEN_COLORS[a] ?? ALLERGEN_COLORS.default}30`,
                      }}>{a}</span>
                  ))
                  : <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>None</span>
                }
              </div>
              <Badge {...cm} label={cm.label} />
              {/* Approve / Reject toggle */}
              <div className="flex items-center gap-1">
                <button onClick={() => onApproveItem(item.id)}
                  title="Approve"
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:opacity-90"
                  style={{
                    background: isApproved ? 'rgba(74,222,128,0.25)' : 'var(--bg-inner)',
                    border: `1px solid ${isApproved ? 'rgba(74,222,128,0.5)' : 'var(--border-default)'}`,
                  }}>
                  <Check size={13} strokeWidth={2.5} style={{ color: isApproved ? '#4ade80' : 'var(--text-4)' }} />
                </button>
                <button onClick={() => onRejectItem(item.id)}
                  title="Reject"
                  className="w-8 h-8 rounded-lg flex items-center justify-center cursor-pointer transition-all hover:opacity-90"
                  style={{
                    background: isRejected ? 'rgba(248,113,113,0.20)' : 'var(--bg-inner)',
                    border: `1px solid ${isRejected ? 'rgba(248,113,113,0.45)' : 'var(--border-default)'}`,
                  }}>
                  <X size={13} strokeWidth={2.5} style={{ color: isRejected ? '#f87171' : 'var(--text-4)' }} />
                </button>
              </div>
            </div>

            {/* Mobile card */}
            <div className="md:hidden px-4 py-4 flex flex-col gap-2.5"
              style={{
                background: isApproved ? 'rgba(74,222,128,0.04)' : isRejected ? 'rgba(248,113,113,0.04)' : 'transparent',
              }}>
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="text-[13px] font-bold" style={{ color: 'var(--text-1)' }}>{item.name}</p>
                  <p className="text-[11.5px] mt-0.5 leading-snug" style={{ color: 'var(--text-4)' }}>{item.description}</p>
                </div>
                <Badge {...cm} label={cm.label} />
              </div>
              <div className="flex items-center gap-1.5 flex-wrap">
                {item.allergens.length > 0
                  ? item.allergens.map(a => (
                    <span key={a} className="text-[10px] font-bold px-1.5 py-0.5 rounded"
                      style={{
                        background: `${ALLERGEN_COLORS[a] ?? ALLERGEN_COLORS.default}18`,
                        color: ALLERGEN_COLORS[a] ?? ALLERGEN_COLORS.default,
                        border: `1px solid ${ALLERGEN_COLORS[a] ?? ALLERGEN_COLORS.default}30`,
                      }}>{a}</span>
                  ))
                  : <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>No allergens</span>
                }
              </div>
              <div className="flex items-center gap-2 pt-0.5">
                <button onClick={() => onApproveItem(item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold cursor-pointer"
                  style={{
                    background: isApproved ? 'rgba(74,222,128,0.20)' : 'var(--bg-inner)',
                    color: isApproved ? '#4ade80' : 'var(--text-3)',
                    border: `1px solid ${isApproved ? 'rgba(74,222,128,0.4)' : 'var(--border-default)'}`,
                  }}>
                  <Check size={13} strokeWidth={2.5} />Approve
                </button>
                <button onClick={() => onRejectItem(item.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-[12px] font-bold cursor-pointer"
                  style={{
                    background: isRejected ? 'rgba(248,113,113,0.15)' : 'var(--bg-inner)',
                    color: isRejected ? '#f87171' : 'var(--text-3)',
                    border: `1px solid ${isRejected ? 'rgba(248,113,113,0.4)' : 'var(--border-default)'}`,
                  }}>
                  <X size={13} strokeWidth={2.5} />Reject
                </button>
              </div>
            </div>
          </div>
        )
      })}

      {/* Review footer */}
      <div className="px-4 py-3 flex items-center justify-between gap-3 flex-wrap"
        style={{ background: 'var(--bg-inner)', borderTop: '1px solid var(--border-default)' }}>
        <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
          Review all items above before submitting for validation.
        </p>
        <span className="flex items-center gap-1.5 text-[11px]" style={{ color: 'var(--text-4)' }}>
          <AlertTriangle size={11} strokeWidth={2} style={{ color: '#fbbf24' }} />
          No data is applied until submitted
        </span>
      </div>
    </div>
  )
}

// ─── Approved State View ──────────────────────────────────────

function ApprovedView({ config, approvedCount, onReplace, onSubmit }: {
  config: SectionConfig; approvedCount: number; onReplace: () => void; onSubmit: () => void
}) {
  return (
    <div className="flex flex-col gap-3">
      {config.fileName && (
        <FileStrip
          fileName={config.fileName} fileSize={config.fileSize!}
          uploadDate={config.uploadDate!} onReplace={onReplace}
        />
      )}
      <div className="flex items-start gap-3 px-4 py-4 rounded-xl"
        style={{ background: 'rgba(74,222,128,0.07)', border: '1px solid rgba(74,222,128,0.22)' }}>
        <CheckCircle2 size={15} strokeWidth={2} style={{ color: '#4ade80', marginTop: 1, flexShrink: 0 }} />
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-bold" style={{ color: '#4ade80' }}>Review Approved</p>
          <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
            {approvedCount} item{approvedCount !== 1 ? 's' : ''} approved and ready for EcoLunch validation.
          </p>
        </div>
        <ActionBtn
          icon={<Send size={12} strokeWidth={2} />} label="Submit for Validation"
          onClick={onSubmit}
          bg="var(--accent)" color="#07070a" border="transparent"
        />
      </div>
    </div>
  )
}

// ─── Submitted State View ─────────────────────────────────────

function SubmittedView({ config }: { config: SectionConfig }) {
  return (
    <div className="flex flex-col gap-3">
      {config.fileName && (
        <FileStrip
          fileName={config.fileName} fileSize={config.fileSize!}
          uploadDate={config.uploadDate!} onReplace={() => {}}
        />
      )}
      <div className="flex items-center gap-3 px-4 py-3.5 rounded-xl"
        style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.25)' }}>
        <Send size={14} strokeWidth={1.8} style={{ color: '#60a5fa', flexShrink: 0 }} />
        <div>
          <p className="text-[12.5px] font-bold" style={{ color: '#60a5fa' }}>Submitted for EcoLunch Validation</p>
          <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
            Data has been sent to EcoLunch. Awaiting review and approval by the EcoLunch team.
          </p>
        </div>
      </div>
    </div>
  )
}

// ─── MenuSection ──────────────────────────────────────────────

function MenuSection({ config }: { config: SectionConfig }) {
  const [state, setState]         = useState<SectionState>(config.initialState)
  const [expanded, setExpanded]   = useState(config.initialState === 'review')
  const [itemStates, setItemStates] = useState<Record<string, ItemState>>(
    () => Object.fromEntries(config.extractedItems.map(i => [i.id, 'pending']))
  )

  const stateMeta     = STATE_META[state]
  const approvedCount = Object.values(itemStates).filter(s => s === 'approved').length

  function approveItem(id: string) {
    setItemStates(prev => ({ ...prev, [id]: prev[id] === 'approved' ? 'pending' : 'approved' }))
  }

  function rejectItem(id: string) {
    setItemStates(prev => ({ ...prev, [id]: prev[id] === 'rejected' ? 'pending' : 'rejected' }))
  }

  function approveAll() {
    setItemStates(Object.fromEntries(config.extractedItems.map(i => [i.id, 'approved'])))
  }

  function rejectAll() {
    setItemStates(Object.fromEntries(config.extractedItems.map(i => [i.id, 'rejected'])))
  }

  function handleUpload() {
    setState('review')
    setExpanded(true)
    setItemStates(Object.fromEntries(config.extractedItems.map(i => [i.id, 'pending'])))
  }

  function handleApprove() {
    setState('approved')
  }

  function handleSubmit() {
    setState('submitted')
  }

  function handleReplace() {
    setState('empty')
    setItemStates(Object.fromEntries(config.extractedItems.map(i => [i.id, 'pending'])))
  }

  return (
    <div className="rounded-2xl overflow-hidden"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>

      {/* Section header — collapsible */}
      <button
        onClick={() => setExpanded(e => !e)}
        className="w-full flex items-center justify-between px-5 py-4 text-left cursor-pointer"
        style={{ background: 'var(--bg-inner)', borderBottom: expanded ? '1px solid var(--border-default)' : 'none' }}>
        <div className="flex items-center gap-3 min-w-0">
          <config.Icon size={14} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          <span className="text-[13.5px] font-bold truncate" style={{ color: 'var(--text-1)' }}>{config.title}</span>
          <span className="text-[11px] font-normal hidden sm:block" style={{ color: 'var(--text-4)' }}>
            — {config.description}
          </span>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Badge {...stateMeta} label={stateMeta.label} />
          {expanded
            ? <ChevronUp size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
            : <ChevronDown size={14} strokeWidth={2} style={{ color: 'var(--text-4)' }} />}
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 py-5 flex flex-col gap-4">

          {/* Description on mobile (hidden in header above) */}
          <p className="text-[12px] sm:hidden" style={{ color: 'var(--text-4)' }}>{config.description}</p>

          {state === 'empty' && (
            <UploadZone onUpload={handleUpload} />
          )}

          {state === 'review' && (
            <>
              {config.fileName && (
                <FileStrip
                  fileName={config.fileName} fileSize={config.fileSize!}
                  uploadDate={config.uploadDate!} onReplace={handleReplace}
                />
              )}
              <ImportNotice count={config.extractedItems.length} />
              <ReviewTable
                items={config.extractedItems}
                itemStates={itemStates}
                onApproveItem={approveItem}
                onRejectItem={rejectItem}
                onApproveAll={approveAll}
                onRejectAll={rejectAll}
              />
              {/* Review action bar */}
              <div className="flex items-center gap-3 pt-1 flex-wrap">
                <ActionBtn
                  icon={<CheckCircle2 size={13} strokeWidth={2} />}
                  label={`Approve & Proceed (${approvedCount} item${approvedCount !== 1 ? 's' : ''})`}
                  onClick={handleApprove}
                  bg="rgba(74,222,128,0.12)" color="#4ade80" border="rgba(74,222,128,0.30)"
                />
                <ActionBtn
                  icon={<XCircle size={13} strokeWidth={2} />}
                  label="Reject All & Re-upload"
                  onClick={handleReplace}
                  bg="rgba(248,113,113,0.10)" color="#f87171" border="rgba(248,113,113,0.25)"
                />
              </div>
            </>
          )}

          {state === 'approved' && (
            <ApprovedView
              config={config} approvedCount={approvedCount}
              onReplace={handleReplace} onSubmit={handleSubmit}
            />
          )}

          {state === 'submitted' && (
            <SubmittedView config={config} />
          )}

          {state === 'rejected' && (
            <>
              <div className="flex items-start gap-3 px-4 py-3.5 rounded-xl"
                style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)' }}>
                <XCircle size={14} strokeWidth={2} style={{ color: '#f87171', flexShrink: 0, marginTop: 1 }} />
                <div className="flex-1">
                  <p className="text-[12.5px] font-bold" style={{ color: '#f87171' }}>Import Rejected</p>
                  <p className="text-[11.5px] mt-0.5" style={{ color: 'var(--text-4)' }}>
                    Extracted data was rejected. Please upload a corrected file.
                  </p>
                </div>
              </div>
              <UploadZone onUpload={handleUpload} small />
            </>
          )}
        </div>
      )}
    </div>
  )
}

// ─── ModuleSection wrapper ────────────────────────────────────

function ModuleSection({ Icon, title, accentColor, children }: {
  Icon: LucideIcon; title: string; accentColor: string; children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
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
      <div className="flex flex-col gap-3 pl-4 border-l-2" style={{ borderColor: `${accentColor}30` }}>
        {children}
      </div>
    </section>
  )
}

// ─── Inactive module ──────────────────────────────────────────

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
        <button className="text-[12px] font-semibold cursor-pointer shrink-0 transition-opacity hover:opacity-80"
          style={{ color: 'var(--accent)' }}>
          Activate →
        </button>
      </div>
    </section>
  )
}

// ─── Upload flow legend ───────────────────────────────────────

function WorkflowLegend() {
  const steps = [
    { icon: <Upload size={11} strokeWidth={2} />, label: 'Upload File' },
    { icon: <Sparkles size={11} strokeWidth={2} />, label: 'Smart Import' },
    { icon: <Eye size={11} strokeWidth={2} />, label: 'Human Review' },
    { icon: <Check size={11} strokeWidth={2.5} />, label: 'Approve / Reject' },
    { icon: <Send size={11} strokeWidth={2} />, label: 'Submit for Validation' },
  ]
  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {steps.map((s, i) => (
        <div key={s.label} className="flex items-center gap-1.5">
          <span className="flex items-center gap-1 px-2 py-1 rounded-lg text-[11px] font-semibold"
            style={{ background: 'var(--bg-card)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
            {s.icon}{s.label}
          </span>
          {i < steps.length - 1 && (
            <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>→</span>
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Page ─────────────────────────────────────────────────────

export function ClientMenusPage() {
  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>

      {/* ── Page header ───────────────────────────────── */}
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Client Portal / Menus &amp; Packages
        </p>
        <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>
          Menus &amp; Packages
        </h1>
        <p className="text-[12px] mt-1 mb-3" style={{ color: 'var(--text-4)' }}>
          Upload your menu documents per module. Smart Import extracts data for your review — no changes are applied until you approve.
        </p>
        <WorkflowLegend />

        {/* Critical notice */}
        <div className="flex items-start gap-2.5 mt-4 px-4 py-3 rounded-xl"
          style={{ background: 'rgba(251,191,36,0.07)', border: '1px solid rgba(251,191,36,0.20)' }}>
          <AlertTriangle size={13} strokeWidth={2} style={{ color: '#fbbf24', flexShrink: 0, marginTop: 1 }} />
          <p className="text-[12px] leading-relaxed" style={{ color: 'var(--text-3)' }}>
            <strong style={{ color: '#fbbf24' }}>Human review is mandatory.</strong>{' '}
            Smart Import extracted data is never applied automatically. You must review, approve or reject each item, then submit for EcoLunch validation.
          </p>
        </div>
      </div>

      <PageTabs
        tabs={[
          { id: 'school',  label: 'School Meals',    icon: <BookOpen size={13} strokeWidth={1.8} /> },
          { id: 'daycare', label: 'Daycare / CPE',   icon: <Baby size={13} strokeWidth={1.8} /> },
          { id: 'camp',    label: 'Camp Meals',      icon: <Tent size={13} strokeWidth={1.8} /> },
        ]}>
        {activeTab => (
          <div className="px-5 py-6 flex flex-col gap-8">

            {activeTab === 'school' && (
              ACTIVE_MODULES.schoolMeals
                ? <ModuleSection Icon={BookOpen} title="School Meals Module" accentColor="#4ade80">
                    {SCHOOL_SECTIONS.map(cfg => <MenuSection key={cfg.id} config={cfg} />)}
                  </ModuleSection>
                : <InactiveModule Icon={BookOpen} title="School Meals Module"
                    description="Activate the School Meals module in Modules & Required Setup to manage school menus here." />
            )}

            {activeTab === 'daycare' && (
              ACTIVE_MODULES.daycare
                ? <ModuleSection Icon={Baby} title="Daycare / CPE Meals Module" accentColor="#60a5fa">
                    {DAYCARE_SECTIONS.map(cfg => <MenuSection key={cfg.id} config={cfg} />)}
                  </ModuleSection>
                : <InactiveModule Icon={Baby} title="Daycare / CPE Meals Module"
                    description="Activate the Daycare module in Modules & Required Setup to manage daycare menus here." />
            )}

            {activeTab === 'camp' && (
              <InactiveModule
                Icon={Tent}
                title="Camp Meals Module"
                description="Camp Menus and Camp Packages will appear here once the Camp Meals module is activated in Modules & Required Setup."
              />
            )}

            <div className="h-4" />
          </div>
        )}
      </PageTabs>
    </div>
  )
}
