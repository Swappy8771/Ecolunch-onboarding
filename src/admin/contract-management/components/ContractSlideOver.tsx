import { useEffect, useRef } from 'react'
import {
  X, Send, RefreshCw, FileDown, ExternalLink,
  FilePen, Layers, FileText, User, Mail, Hash, DollarSign,
  Eye, CheckCircle2, Puzzle, History,
} from 'lucide-react'
import type { Contract } from '../types/contract.types'
import { WEBHOOK_EVENT_META } from '../services/mock/contractsMock'
import { StatusBadge } from './StatusBadge'
import { DetailRow } from './DetailRow'
import { ActivationNotice } from './ActivationNotice'
import { ArchiveFlow } from './ArchiveFlow'

interface ContractSlideOverProps {
  contract: Contract
  onClose: () => void
  onSend: (contract: Contract) => void
}

export function ContractSlideOver({ contract, onClose, onSend }: ContractSlideOverProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handle(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  const isSigned = contract.status === 'signed'

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          zIndex: 9998,
          background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(4px)',
        }}
      />
      <div
        ref={ref}
        className="flex flex-col overflow-hidden"
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          width: 'min(600px, calc(100vw - 32px))',
          maxHeight: 'calc(100vh - 48px)',
          background: 'var(--bg-surface)',
          border: '1px solid var(--border-default)',
          borderRadius: '16px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-default)' }}
        >
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-[0.14em] font-bold mb-1.5" style={{ color: 'var(--accent)' }}>
              Contract Detail
            </div>
            <h2 className="text-[17px] font-black leading-snug" style={{ color: 'var(--text-1)' }}>
              {contract.name}
            </h2>
            <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>{contract.caterer}</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}
          >
            <X size={13} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Status + version */}
          <div className="flex items-center gap-3">
            <StatusBadge status={contract.status} />
            <span
              className="text-[12px] font-semibold px-2.5 py-1 rounded-full"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-3)', border: '1px solid var(--border-strong)' }}
            >
              {contract.version}
            </span>
          </div>

          <ActivationNotice />

          {isSigned && <ArchiveFlow contract={contract} />}

          {/* Core details */}
          <div className="rounded-2xl px-4 pt-1 pb-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <DetailRow icon={<FilePen size={13} strokeWidth={1.8} />}     label="Contract Name"           value={contract.name} />
            <DetailRow icon={<Layers size={13} strokeWidth={1.8} />}      label="Contract Type"           value={contract.type} />
            <DetailRow icon={<FileText size={13} strokeWidth={1.8} />}    label="Template Used"           value={contract.template} />
            <DetailRow icon={<User size={13} strokeWidth={1.8} />}        label="Signatory Name"          value={contract.signatoryName} />
            <DetailRow icon={<Mail size={13} strokeWidth={1.8} />}        label="Signatory Email"         value={
              <a href={`mailto:${contract.signatoryEmail}`} className="hover:underline" style={{ color: '#60a5fa' }}>
                {contract.signatoryEmail}
              </a>
            } />
            <DetailRow icon={<Hash size={13} strokeWidth={1.8} />}        label="Dropbox Sign Request ID" value={
              <span className="font-mono text-[12px]">{contract.dropboxRequestId}</span>
            } />
            {contract.monthlyRate !== null && (
              <DetailRow icon={<DollarSign size={13} strokeWidth={1.8} />} label="Monthly Rate (from Modules/Pricing)" value={
                <span className="font-semibold">${contract.monthlyRate.toLocaleString()}/mo</span>
              } />
            )}
          </div>

          {/* Dates */}
          <div className="rounded-2xl px-4 pt-1 pb-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <DetailRow icon={<Send size={13} strokeWidth={1.8} />}         label="Sent Date"   value={contract.sentDate   ?? '—'} />
            <DetailRow icon={<Eye size={13} strokeWidth={1.8} />}          label="Viewed Date" value={contract.viewedDate ?? '—'} />
            <DetailRow icon={<CheckCircle2 size={13} strokeWidth={1.8} />} label="Signed Date" value={contract.signedDate ?? '—'} />
          </div>

          {/* Linked modules */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Puzzle size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
              <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                Linked Modules
              </span>
            </div>
            {contract.linkedModules.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {contract.linkedModules.map(mod => (
                  <span key={mod} className="text-[12px] font-semibold px-3 py-1 rounded-full"
                    style={{ background: 'rgba(163,230,53,0.12)', color: '#a3e635', border: '1px solid rgba(163,230,53,0.28)' }}>
                    {mod}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-[12px]" style={{ color: 'var(--text-4)' }}>No linked modules</span>
            )}
          </div>

          {/* Audit log */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <History size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
              <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                Audit History & Webhook Events
              </span>
            </div>
            <div className="flex flex-col rounded-2xl overflow-hidden"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
              {contract.auditLog.map((entry, idx) => {
                const wh = entry.webhook ? WEBHOOK_EVENT_META[entry.webhook] : null
                return (
                  <div key={idx} className="flex items-start gap-3 px-4 py-3"
                    style={{ borderBottom: idx < contract.auditLog.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                    <div className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                      style={{ background: wh ? wh.color : 'var(--text-4)' }} />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-[12.5px] font-medium" style={{ color: 'var(--text-2)' }}>{entry.action}</p>
                        {wh && (
                          <span className="text-[9.5px] px-1.5 py-0.5 rounded font-mono font-bold"
                            style={{ background: wh.color + '18', color: wh.color, border: `1px solid ${wh.color}30` }}>
                            {wh.label}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px]" style={{ color: 'var(--text-4)' }}>{entry.actor}</span>
                        <span style={{ color: 'var(--text-4)' }}>·</span>
                        <span className="text-[11px] tabular-nums" style={{ color: 'var(--text-4)' }}>{entry.date}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div
          className="px-6 py-4 shrink-0 flex flex-wrap gap-2"
          style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}
        >
          {(contract.status === 'ready' || contract.status === 'draft') && (
            <button
              onClick={() => { onClose(); onSend(contract) }}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: '#a3e635', color: '#07070a' }}
            >
              <Send size={13} strokeWidth={2} />Send for Signature
            </button>
          )}
          {(contract.status === 'sent' || contract.status === 'viewed') && (
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.30)' }}>
              <RefreshCw size={13} strokeWidth={2} />Resend / Remind
            </button>
          )}
          {contract.status === 'signed' && (
            <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.28)' }}>
              <FileDown size={13} strokeWidth={2} />Download Signed
            </button>
          )}
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
            <FileDown size={13} strokeWidth={2} />Audit Trail
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
            style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
            <ExternalLink size={13} strokeWidth={2} />Open in Dropbox
          </button>
        </div>
      </div>
    </>
  )
}
