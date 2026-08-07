import { useEffect, useRef, useState } from 'react'
import {
  X, Send, RefreshCw, FileDown, CheckSquare,
  Layers, User, Mail, Hash, DollarSign,
  Eye, CheckCircle2, Puzzle, History, AlertTriangle, ChevronDown, ChevronUp,
  Users, XCircle,
} from 'lucide-react'
import { InlineLoader } from '@shared/ui/InlineLoader'
import { FullPageLoader } from '@shared/ui/FullPageLoader'
import {
  useContract, useContractHistory,
  useReadyContract, useSendContract, useRetryContract, useResendContract, useCancelContract, useDownloadContract,
  CONTRACT_WEBHOOK_EVENT_META,
} from '@/features/adminContracts'
import { StatusBadge } from './StatusBadge'
import { DetailRow } from './DetailRow'
import { ActivationNotice } from './ActivationNotice'
import { ArchiveFlow } from './ArchiveFlow'

interface ContractSlideOverProps {
  contractId: string
  onClose: () => void
}

/** `Contract.signatureRequests[]` is fully modeled end-to-end (backend → DTO → mapper) but was never rendered anywhere in the UI — this is its first consumer. */
const SIGNER_STATUS_META: Record<'sent' | 'viewed' | 'signed' | 'declined', { label: string; color: string; icon: typeof Send }> = {
  sent:     { label: 'Sent',     color: '#60a5fa', icon: Send },
  viewed:   { label: 'Viewed',   color: '#fbbf24', icon: Eye },
  signed:   { label: 'Signed',   color: '#4ade80', icon: CheckCircle2 },
  declined: { label: 'Declined', color: '#f87171', icon: XCircle },
}

export function ContractSlideOver({ contractId, onClose }: ContractSlideOverProps) {
  const ref = useRef<HTMLDivElement>(null)
  const [historyOpen, setHistoryOpen] = useState(false)

  /**
   * Polls every 15s while the contract is in a transient, webhook-driven
   * state — the drawer's "Status will update automatically via webhook"
   * copy (`SendWizard.tsx`) previously wasn't backed by anything: nothing
   * refetched this query after the initial load, so a signature event
   * arriving while the drawer was open would go unnoticed until it was
   * closed/reopened. Stops polling once the contract reaches a terminal
   * state (signed/declined/expired/canceled/error).
   */
  const contractQuery = useContract(contractId, {
    refetchInterval: query => {
      const status = query.state.data?.status
      return status && ['sent', 'viewed', 'partially_signed'].includes(status) ? 15_000 : false
    },
  })
  const historyQuery = useContractHistory(contractId, { enabled: historyOpen })

  const readyMutation = useReadyContract()
  const sendMutation = useSendContract()
  const retryMutation = useRetryContract()
  const resendMutation = useResendContract()
  const cancelMutation = useCancelContract()
  const downloadMutation = useDownloadContract()

  useEffect(() => {
    function handle(e: KeyboardEvent) { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handle)
    return () => document.removeEventListener('keydown', handle)
  }, [onClose])

  const contract = contractQuery.data
  const activeMutation = [readyMutation, sendMutation, retryMutation, resendMutation, cancelMutation].find(m => m.isPending)
  const activeError = [readyMutation, sendMutation, retryMutation, resendMutation, cancelMutation].find(m => m.isError)?.error

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
              {contract ? (contract.signatoryName ?? 'Untitled contract') : 'Loading…'}
            </h2>
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
          {contractQuery.isLoading ? (
            <FullPageLoader label="Loading contract…" />
          ) : contractQuery.isError || !contract ? (
            <div className="flex flex-col items-center gap-3 py-10">
              <AlertTriangle size={28} strokeWidth={1.2} style={{ color: '#f87171' }} />
              <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>
                {contractQuery.error?.message ?? 'Contract not found.'}
              </span>
            </div>
          ) : (
            <>
              {/* Status */}
              <div className="flex items-center gap-3">
                <StatusBadge status={contract.status} />
              </div>

              {contract.status === 'error' && contract.lastError && (
                <div className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                  style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)' }}>
                  <AlertTriangle size={13} strokeWidth={1.8} className="shrink-0 mt-0.5" style={{ color: '#f43f5e' }} />
                  <div>
                    <p className="text-[12px] font-bold mb-0.5" style={{ color: '#f43f5e' }}>Last send attempt failed</p>
                    <p className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>{contract.lastError}</p>
                  </div>
                </div>
              )}

              <ActivationNotice />

              {contract.status === 'signed' && <ArchiveFlow contract={contract} />}

              {/* Core details */}
              <div className="rounded-2xl px-4 pt-1 pb-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                <DetailRow icon={<Layers size={13} strokeWidth={1.8} />}      label="Contract Type"           value={contract.type} />
                <DetailRow icon={<User size={13} strokeWidth={1.8} />}       label="Signatory Name"          value={contract.signatoryName ?? '—'} />
                <DetailRow icon={<Mail size={13} strokeWidth={1.8} />}       label="Signatory Email"         value={
                  contract.signatoryEmail ? (
                    <a href={`mailto:${contract.signatoryEmail}`} className="hover:underline" style={{ color: '#60a5fa' }}>
                      {contract.signatoryEmail}
                    </a>
                  ) : '—'
                } />
                <DetailRow icon={<Hash size={13} strokeWidth={1.8} />}       label="Dropbox Sign Request ID" value={
                  contract.dropboxSignRequestId
                    ? <span className="font-mono text-[12px]">{contract.dropboxSignRequestId}</span>
                    : '—'
                } />
                <DetailRow icon={<DollarSign size={13} strokeWidth={1.8} />} label="Monthly Rate (from Modules/Pricing)" value={
                  <span className="font-semibold">{contract.mergeFields.monthlyRateFormatted}</span>
                } />
                {contract.createdByName && (
                  <DetailRow icon={<User size={13} strokeWidth={1.8} />} label="Created By" value={contract.createdByName} />
                )}
              </div>

              {/* Dates */}
              <div className="rounded-2xl px-4 pt-1 pb-1" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                <DetailRow icon={<Send size={13} strokeWidth={1.8} />}         label="Sent Date"     value={contract.sentAt     ?? '—'} />
                <DetailRow icon={<Eye size={13} strokeWidth={1.8} />}          label="Signed Date"   value={contract.signedAt   ?? '—'} />
                <DetailRow icon={<CheckCircle2 size={13} strokeWidth={1.8} />} label="Declined Date" value={contract.declinedAt ?? '—'} />
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

              {/* Per-signer signature status */}
              {contract.signatureRequests.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <Users size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
                    <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                      Signers
                    </span>
                  </div>
                  <div className="flex flex-col rounded-2xl overflow-hidden"
                    style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                    {contract.signatureRequests.map((signer, idx, arr) => {
                      const meta = SIGNER_STATUS_META[signer.status]
                      const Icon = meta.icon
                      return (
                        <div key={idx} className="flex items-center justify-between gap-3 px-4 py-3"
                          style={{ borderBottom: idx < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                          <div className="min-w-0">
                            <p className="text-[12.5px] font-medium truncate" style={{ color: 'var(--text-2)' }}>
                              {signer.signerName ?? signer.signerEmail ?? `Signer ${signer.order}`}
                            </p>
                            <p className="text-[11px] truncate" style={{ color: 'var(--text-4)' }}>
                              {signer.signerEmail}
                              {signer.status === 'signed' && signer.signedAt ? ` · signed ${signer.signedAt}` : null}
                              {signer.status === 'viewed' && signer.viewedAt ? ` · viewed ${signer.viewedAt}` : null}
                            </p>
                          </div>
                          <span className="flex items-center gap-1.5 text-[11px] font-semibold px-2.5 py-1 rounded-full shrink-0"
                            style={{ background: meta.color + '18', color: meta.color, border: `1px solid ${meta.color}40` }}>
                            <Icon size={11} strokeWidth={2} />{meta.label}
                          </span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Audit history — lazy loaded */}
              <div>
                <button
                  onClick={() => setHistoryOpen(o => !o)}
                  className="flex items-center gap-2 mb-3 cursor-pointer"
                >
                  <History size={13} strokeWidth={1.8} style={{ color: 'var(--text-4)' }} />
                  <span className="text-[10.5px] uppercase tracking-[0.13em] font-bold" style={{ color: 'var(--text-4)' }}>
                    Audit History & Webhook Events
                  </span>
                  {historyOpen ? <ChevronUp size={12} style={{ color: 'var(--text-4)' }} /> : <ChevronDown size={12} style={{ color: 'var(--text-4)' }} />}
                </button>
                {historyOpen && (
                  historyQuery.isLoading ? (
                    <div className="flex items-center gap-2 py-3"><InlineLoader size={14} /><span className="text-[12px]" style={{ color: 'var(--text-4)' }}>Loading history…</span></div>
                  ) : historyQuery.isError ? (
                    <span className="text-[12px]" style={{ color: '#f87171' }}>{historyQuery.error?.message ?? 'Failed to load history.'}</span>
                  ) : (
                    <div className="flex flex-col rounded-2xl overflow-hidden"
                      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
                      {(historyQuery.data?.history ?? []).map((entry, idx, arr) => {
                        const wh = entry.webhookEvent ? CONTRACT_WEBHOOK_EVENT_META[entry.webhookEvent] : null
                        return (
                          <div key={idx} className="flex items-start gap-3 px-4 py-3"
                            style={{ borderBottom: idx < arr.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
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
                  )
                )}
              </div>

              {activeError && (
                <div className="rounded-xl px-4 py-3" style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)' }}>
                  <p className="text-[12px]" style={{ color: '#f43f5e' }}>{activeError.message}</p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        {contract && (
          <div
            className="px-6 py-4 shrink-0 flex flex-wrap gap-2"
            style={{ borderTop: '1px solid var(--border-default)', background: 'var(--bg-surface)' }}
          >
            {contract.status === 'draft' && (
              <button
                onClick={() => readyMutation.mutate({ cid: contract.id, catererId: contract.catererId })}
                disabled={activeMutation !== undefined}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-50"
                style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
              >
                {readyMutation.isPending ? <InlineLoader size={13} /> : <CheckSquare size={13} strokeWidth={2} />}Mark Ready
              </button>
            )}
            {(contract.status === 'ready_to_send' || contract.status === 'draft') && (
              <button
                onClick={() => sendMutation.mutate({ cid: contract.id, catererId: contract.catererId })}
                disabled={activeMutation !== undefined}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-50"
                style={{ background: '#a3e635', color: '#07070a' }}
              >
                {sendMutation.isPending ? <InlineLoader size={13} /> : <Send size={13} strokeWidth={2} />}Send for Signature
              </button>
            )}
            {contract.status === 'error' && (
              <button
                onClick={() => retryMutation.mutate({ cid: contract.id, catererId: contract.catererId })}
                disabled={activeMutation !== undefined}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-50"
                style={{ background: '#a3e635', color: '#07070a' }}
              >
                {retryMutation.isPending ? <InlineLoader size={13} /> : <RefreshCw size={13} strokeWidth={2} />}Retry Send
              </button>
            )}
            {(contract.status === 'sent' || contract.status === 'viewed' || contract.status === 'partially_signed') && (
              <button
                onClick={() => resendMutation.mutate(contract.id)}
                disabled={activeMutation !== undefined}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-50"
                style={{ background: 'rgba(96,165,250,0.15)', color: '#60a5fa', border: '1px solid rgba(96,165,250,0.30)' }}>
                {resendMutation.isPending ? <InlineLoader size={13} /> : <RefreshCw size={13} strokeWidth={2} />}Resend / Remind
              </button>
            )}
            {contract.status === 'signed' && (
              <button
                onClick={() => downloadMutation.mutate(contract.id)}
                disabled={downloadMutation.isPending}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-50"
                style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.28)' }}>
                {downloadMutation.isPending ? <InlineLoader size={13} /> : <FileDown size={13} strokeWidth={2} />}Download Signed
              </button>
            )}
            {!['draft', 'canceled', 'expired', 'signed'].includes(contract.status) && (
              <button
                onClick={() => { if (window.confirm('Cancel this contract? This cannot be undone.')) cancelMutation.mutate({ cid: contract.id, catererId: contract.catererId }) }}
                disabled={activeMutation !== undefined}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-50"
                style={{ background: 'var(--bg-inner)', color: '#f87171', border: '1px solid var(--border-strong)' }}>
                Cancel Contract
              </button>
            )}
          </div>
        )}
      </div>
    </>
  )
}
