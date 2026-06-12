import { Eye, FileText, CheckCircle2, XCircle, MessageSquare, Send, History, Tag, ChevronRight } from 'lucide-react'
import { DropdownMenu } from '@shared/components/DropdownMenu'
import { DocStatusPill } from './DocStatusPill'
import { INSURANCE_DOCS } from '../services/mock/documentVaultMock'
import type { CatererVault, CategoryInfo } from '../services/mock/documentVaultMock'

const DOC_MENU_ACTIONS = [
  { label: 'Smart Import',           icon: <Tag          size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'Classify',               icon: <Tag          size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'Reclassify',             icon: <History      size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'View Extracted Fields',  icon: <FileText     size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'View Linked Section',    icon: <ChevronRight size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'View Validation Status', icon: <CheckCircle2 size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'Approve',                icon: <CheckCircle2 size={13} strokeWidth={1.8} />, color: '#4ade80'        },
  { label: 'Reject',                 icon: <XCircle      size={13} strokeWidth={1.8} />, color: '#f87171'        },
  { label: 'Request Correction',     icon: <MessageSquare size={13} strokeWidth={1.8} />, color: '#fbbf24'       },
  { label: 'Send via EcoLoop',       icon: <Send         size={13} strokeWidth={1.8} />, color: '#60a5fa'        },
  { label: 'View Version History',   icon: <History      size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
  { label: 'View Audit Trail',       icon: <FileText     size={13} strokeWidth={1.8} />, color: 'var(--text-2)' },
]

const TABLE_COLS = [
  { label: 'Document Name', width: 'auto'  },
  { label: 'Category',      width: '160px' },
  { label: 'Status',        width: '168px' },
  { label: 'Version',       width: '80px'  },
  { label: 'Uploaded By',   width: '150px' },
  { label: 'Upload Date',   width: '110px' },
  { label: 'Actions',       width: '110px' },
]

interface DocumentTableProps {
  caterer: CatererVault
  category: CategoryInfo
  openMenuId: string | null
  onMenuToggle: (id: string) => void
  onMenuClose: () => void
}

export function DocumentTable({ caterer, category, openMenuId, onMenuToggle, onMenuClose }: DocumentTableProps) {
  const docs = INSURANCE_DOCS.map(d => ({ ...d, category: category.label }))

  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse" style={{ minWidth: '860px' }}>
          <thead style={{ position: 'sticky', top: 0, zIndex: 10 }}>
            <tr style={{ background: 'var(--bg-inner)', borderBottom: '2px solid var(--border-default)' }}>
              {TABLE_COLS.map(col => (
                <th key={col.label} className="text-left px-4 py-3"
                  style={{ width: col.width, minWidth: col.width !== 'auto' ? col.width : undefined }}>
                  <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                    {col.label}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {docs.map((doc, idx) => (
              <tr
                key={doc.id}
                className="transition-colors"
                style={{ borderBottom: idx < docs.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--bg-inner)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent' }}
              >
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-2">
                    <FileText size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
                    <span className="text-[13px] font-medium" style={{ color: 'var(--text-1)' }}>{doc.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[12px] font-medium" style={{ color: 'var(--text-3)' }}>{doc.category}</span>
                </td>
                <td className="px-4 py-3.5"><DocStatusPill status={doc.status} /></td>
                <td className="px-4 py-3.5">
                  <span className="text-[12px] font-semibold tabular-nums px-2 py-0.5 rounded-md"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-3)' }}>
                    {doc.version}
                  </span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[12px]" style={{ color: 'var(--text-3)' }}>{doc.uploadedBy}</span>
                </td>
                <td className="px-4 py-3.5">
                  <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>{doc.uploadDate}</span>
                </td>
                <td className="px-4 py-3.5">
                  <div className="flex items-center gap-1.5">
                    <button
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold cursor-pointer"
                      style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
                      onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = '#60a5fa50'; el.style.color = '#60a5fa' }}
                      onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.borderColor = 'var(--border-strong)'; el.style.color = 'var(--text-2)' }}
                    >
                      <Eye size={12} strokeWidth={2} />View
                    </button>
                    <DropdownMenu
                      open={openMenuId === doc.id}
                      onToggle={() => onMenuToggle(doc.id)}
                      onClose={onMenuClose}
                      actions={DOC_MENU_ACTIONS}
                      minWidth="210px"
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex items-center justify-between px-5 py-3" style={{ borderTop: '1px solid var(--border-subtle)' }}>
        <span className="text-[12px] tabular-nums" style={{ color: 'var(--text-4)' }}>
          {docs.length} document{docs.length !== 1 ? 's' : ''} in {category.label}
        </span>
        <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>{caterer.name}</span>
      </div>
    </div>
  )
}
