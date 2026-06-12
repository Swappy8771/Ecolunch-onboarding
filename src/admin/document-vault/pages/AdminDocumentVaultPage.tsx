import { useState } from 'react'
import {
  FolderLock, Search, Download,
  Users, FileText, AlertTriangle, XCircle,
  MapPin, ArrowLeft, ChevronRight,
} from 'lucide-react'
import { PageHeader } from '@shared/components/PageHeader'
import { FilterBar } from '@shared/components/FilterBar'
import { SelectFilter } from '@shared/components/SelectFilter'
import { StatCard } from '@/features/dashboard/components/StatCard'
import { CatererSidePanel } from '../components/CatererSidePanel'
import { CatererVaultGrid } from '../components/CatererVaultGrid'
import { CategoryGrid } from '../components/CategoryGrid'
import { DocumentTable } from '../components/DocumentTable'
import { CATERERS, CATEGORIES } from '../services/mock/documentVaultMock'
import type { CatererVault, CategoryInfo } from '../services/mock/documentVaultMock'

const CATEGORY_LABELS = CATEGORIES.map(c => c.label)

export function DocumentVault() {
  const [selectedCaterer,  setSelectedCaterer]  = useState<CatererVault | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<CategoryInfo | null>(null)
  const [headerSearch,     setHeaderSearch]     = useState('')
  const [filterSearch,     setFilterSearch]     = useState('')
  const [filterStatus,     setFilterStatus]     = useState('')
  const [filterCategory,   setFilterCategory]   = useState('')
  const [filterDate,       setFilterDate]       = useState('')
  const [applied, setApplied] = useState({ search: '', status: '', category: '', date: '' })
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)

  const totalCaterers    = CATERERS.length
  const totalDocuments   = CATERERS.reduce((s, c) => s + c.totalDocs, 0)
  const totalPending     = CATERERS.reduce((s, c) => s + c.pending, 0)
  const totalCorrections = CATERERS.reduce((s, c) => s + c.corrections, 0)

  const hasFilter = Object.values(applied).some(v => v !== '')

  function applyFilters() {
    setApplied({ search: filterSearch, status: filterStatus, category: filterCategory, date: filterDate })
  }
  function resetFilters() {
    setFilterSearch(''); setFilterStatus(''); setFilterCategory(''); setFilterDate('')
    setApplied({ search: '', status: '', category: '', date: '' })
  }

  function openCaterer(c: CatererVault) { setSelectedCaterer(c); setSelectedCategory(null) }
  function goBackToList()    { setSelectedCaterer(null); setSelectedCategory(null) }
  function goBackToCaterer() { setSelectedCategory(null) }

  const isLevel1 = selectedCaterer === null
  const isLevel2 = selectedCaterer !== null && selectedCategory === null
  const isLevel3 = selectedCaterer !== null && selectedCategory !== null

  return (
    <div className="p-4 lg:p-7 max-w-[1500px]">
      <PageHeader
        size="page"
        badge={{ icon: <FolderLock size={12} strokeWidth={2.5} />, label: 'Document Vault' }}
        title="Document Vault by Caterer"
        subtitle="Manage onboarding documents, classifications, approvals, versions, and storage references."
        right={
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search size={13} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
              <input value={headerSearch} onChange={e => setHeaderSearch(e.target.value)} placeholder="Search caterers…"
                className="pl-9 pr-3 py-2.5 rounded-xl text-[12.5px] outline-none w-[180px]"
                style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-2)' }} />
            </div>
            <button className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-[12.5px] font-medium cursor-pointer transition-opacity hover:opacity-80"
              style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
              <Download size={13} strokeWidth={2} />Export
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
        <StatCard label="Total Caterers"      value={totalCaterers}    valueColor="blue"  trend="registered"        icon={<Users         size={15} strokeWidth={1.8} />} />
        <StatCard label="Total Documents"     value={totalDocuments}   valueColor="lime"  trend="across all vaults" icon={<FileText      size={15} strokeWidth={1.8} />} />
        <StatCard label="Pending Review"      value={totalPending}     valueColor="amber" trend="awaiting action"   icon={<AlertTriangle size={14} strokeWidth={1.8} />} />
        <StatCard label="Correction Required" value={totalCorrections} valueColor="red"   trend="needs response"    icon={<XCircle       size={15} strokeWidth={1.8} />} />
      </div>

      {isLevel1 && (
        <FilterBar onApply={applyFilters} onReset={resetFilters} hasFilter={hasFilter}>
          <div className="relative">
            <Search size={12} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
            <input value={filterSearch} onChange={e => setFilterSearch(e.target.value)} placeholder="Search caterer…"
              className="pl-8 pr-3 py-2 rounded-xl text-[12.5px] outline-none w-[160px] sm:w-[180px]"
              style={{ background: 'var(--bg-inner)', border: `1px solid ${filterSearch ? '#a3e63550' : 'var(--border-strong)'}`, color: 'var(--text-2)' }} />
          </div>
          <SelectFilter label="Document Status" value={filterStatus} onChange={setFilterStatus}
            options={[
              { value: 'approved',   label: 'Approved'            },
              { value: 'pending',    label: 'Pending Review'      },
              { value: 'rejected',   label: 'Rejected'            },
              { value: 'correction', label: 'Correction Required' },
            ]} />
          <SelectFilter label="Category" value={filterCategory} onChange={setFilterCategory}
            options={CATEGORY_LABELS.map(l => ({ value: l, label: l }))} />
          <SelectFilter label="Activity Date" value={filterDate} onChange={setFilterDate}
            options={[
              { value: 'today',      label: 'Today'      },
              { value: 'this_week',  label: 'This Week'  },
              { value: 'this_month', label: 'This Month' },
            ]} />
        </FilterBar>
      )}

      {isLevel1 && (
        <CatererVaultGrid caterers={CATERERS} searchQuery={headerSearch || applied.search} onOpen={openCaterer} />
      )}

      {(isLevel2 || isLevel3) && selectedCaterer && (
        <div className="flex gap-5 min-h-0">
          <CatererSidePanel
            caterers={CATERERS}
            selected={selectedCaterer}
            onSelect={c => { setSelectedCaterer(c); setSelectedCategory(null) }}
          />
          <div className="flex-1 min-w-0 flex flex-col gap-5">
            <div className="rounded-2xl p-5" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              <div className="flex items-center gap-2 mb-3.5">
                <button onClick={goBackToList}
                  className="flex items-center gap-1.5 text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-75"
                  style={{ color: 'var(--text-3)' }}>
                  <ArrowLeft size={13} strokeWidth={2} />All Vaults
                </button>
                <ChevronRight size={11} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
                {isLevel3 ? (
                  <>
                    <button onClick={goBackToCaterer}
                      className="text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-75"
                      style={{ color: 'var(--text-3)' }}>
                      {selectedCaterer.name}
                    </button>
                    <ChevronRight size={11} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
                    <span className="text-[12px] font-semibold" style={{ color: 'var(--text-2)' }}>{selectedCategory?.label}</span>
                  </>
                ) : (
                  <span className="text-[12px] font-semibold" style={{ color: 'var(--text-2)' }}>{selectedCaterer.name}</span>
                )}
              </div>
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-[22px] font-black tracking-tight" style={{ color: 'var(--text-1)' }}>{selectedCaterer.name}</h2>
                  <div className="flex items-center gap-1.5 mt-1">
                    <MapPin size={12} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
                    <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>{selectedCaterer.location}</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap shrink-0">
                  <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}>
                    {selectedCaterer.totalDocs} docs
                  </span>
                  {selectedCaterer.pending > 0 && (
                    <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.30)' }}>
                      {selectedCaterer.pending} pending
                    </span>
                  )}
                  {selectedCaterer.corrections > 0 && (
                    <span className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
                      style={{ background: 'rgba(248,113,113,0.12)', color: '#f87171', border: '1px solid rgba(248,113,113,0.30)' }}>
                      {selectedCaterer.corrections} correction{selectedCaterer.corrections !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {isLevel2 && (
              <CategoryGrid onSelectCategory={setSelectedCategory} />
            )}

            {isLevel3 && selectedCategory && (
              <>
                <div className="flex items-center gap-2">
                  <button onClick={goBackToCaterer}
                    className="flex items-center gap-1.5 text-[12px] font-medium cursor-pointer transition-opacity hover:opacity-75"
                    style={{ color: 'var(--text-3)' }}>
                    <ArrowLeft size={12} strokeWidth={2} />Back to categories
                  </button>
                  <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>·</span>
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: selectedCategory.color + '18', color: selectedCategory.color }}>
                      {selectedCategory.icon}
                    </div>
                    <span className="text-[13px] font-semibold" style={{ color: 'var(--text-1)' }}>{selectedCategory.label}</span>
                  </div>
                </div>
                <DocumentTable
                  caterer={selectedCaterer}
                  category={selectedCategory}
                  openMenuId={openMenuId}
                  onMenuToggle={id => setOpenMenuId(openMenuId === id ? null : id)}
                  onMenuClose={() => setOpenMenuId(null)}
                />
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
