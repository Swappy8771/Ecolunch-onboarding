import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Check, Send, Info, CheckSquare, AlertTriangle } from 'lucide-react'
import { InlineLoader } from '@shared/ui/InlineLoader'
import { useCaterers } from '@/features/adminCaterers/hooks/useCaterers'
import {
  useContractTemplates, useCreateDraftContract, useReadyContract, useSendContract,
  type ContractDetailViewModel, type ContractType,
} from '@/features/adminContracts'
import { WizardInput } from './WizardInput'
import { ActivationNotice } from './ActivationNotice'

type WizardStep = 'select' | 'review' | 'sent'

const STEP_LABELS: Record<WizardStep, string> = {
  select: '1 · Select',
  review: '2 · Review & Send',
  sent:   '3 · Done',
}
const STEPS: WizardStep[] = ['select', 'review', 'sent']

interface SendWizardProps {
  onClose: () => void
}

/**
 * Production workflow (Phase 4B §6): Select → Create Draft (backend
 * builds merge fields) → Review (read-only, backend-sourced) → optional
 * Ready → Send. No client-side Dropbox Sign payload construction — that
 * entire concept was removed, not migrated (the real payload is built
 * inside `dropboxSignAdapter.sendWithTemplate()` server-side).
 */
export function SendWizard({ onClose }: SendWizardProps) {
  const [step, setStep] = useState<WizardStep>('select')
  const [selectedCatId, setSelectedCatId] = useState('')
  const [selectedType, setSelectedType] = useState<ContractType | null>(null)
  const [draft, setDraft] = useState<ContractDetailViewModel | null>(null)
  const [signatoryName, setSignatoryName] = useState('')
  const [signatoryEmail, setSignatoryEmail] = useState('')

  const caterersQuery = useCaterers({ limit: 100 })
  const templatesQuery = useContractTemplates()

  const createDraftMutation = useCreateDraftContract()
  const readyMutation = useReadyContract()
  const sendMutation = useSendContract()

  const caterers = caterersQuery.data?.items ?? []
  const templates = templatesQuery.data ?? []
  const catererName = caterers.find(c => c.id === selectedCatId)?.name ?? ''

  function goToReview() {
    if (!selectedCatId || !selectedType) return
    createDraftMutation.mutate(
      { catererId: selectedCatId, type: selectedType },
      {
        onSuccess: created => {
          setDraft(created)
          setSignatoryName(created.signatoryName ?? created.mergeFields.signatoryName ?? '')
          setSignatoryEmail(created.signatoryEmail ?? created.mergeFields.signatoryEmail ?? '')
          setStep('review')
        },
      },
    )
  }

  function handleReady() {
    if (!draft) return
    readyMutation.mutate(
      { cid: draft.id, catererId: draft.catererId },
      { onSuccess: updated => setDraft(updated) },
    )
  }

  function handleSend() {
    if (!draft) return
    sendMutation.mutate(
      { cid: draft.id, catererId: draft.catererId, signatoryName, signatoryEmail },
      { onSuccess: updated => { setDraft(updated); setStep('sent') } },
    )
  }

  const sending = createDraftMutation.isPending || readyMutation.isPending || sendMutation.isPending
  const stepError = createDraftMutation.error ?? readyMutation.error ?? sendMutation.error

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full flex flex-col"
        style={{
          maxWidth: '560px',
          maxHeight: '90vh',
          background: 'var(--bg-card)',
          border: '1px solid var(--border-default)',
          borderRadius: '20px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.5)',
        }}
      >
        {/* Header */}
        <div
          className="flex items-start justify-between gap-3 px-6 py-5 shrink-0"
          style={{ borderBottom: '1px solid var(--border-default)' }}
        >
          <div>
            <div className="flex items-center gap-1.5 mb-1">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center gap-1.5">
                  <span
                    className="text-[11px] font-semibold px-2.5 py-1 rounded-full transition-all"
                    style={{
                      background: s === step ? 'var(--accent-dim)' : 'var(--bg-inner)',
                      color: s === step ? 'var(--accent)' : 'var(--text-4)',
                      border: `1px solid ${s === step ? 'var(--accent-border)' : 'var(--border-strong)'}`,
                    }}
                  >
                    {STEP_LABELS[s]}
                  </span>
                  {i < STEPS.length - 1 && (
                    <ChevronRight size={11} strokeWidth={2} style={{ color: 'var(--text-4)' }} />
                  )}
                </div>
              ))}
            </div>
            <h2 className="text-[17px] font-black mt-2" style={{ color: 'var(--text-1)' }}>
              {step === 'select' && 'Send for Signature'}
              {step === 'review' && 'Review & Send'}
              {step === 'sent'   && 'Contract Sent'}
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              {step === 'select' && 'Choose the caterer and contract template.'}
              {step === 'review' && 'Merge fields are pulled from Modules & Pricing automatically — review before sending.'}
              {step === 'sent'   && 'The signature request has been dispatched via Dropbox Sign.'}
            </p>
          </div>
          <button onClick={onClose} className="cursor-pointer mt-0.5 shrink-0" style={{ color: 'var(--text-4)' }}>
            <X size={15} strokeWidth={2.5} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5">

          {/* Step 1 — Select */}
          {step === 'select' && (
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-[0.1em] font-bold" style={{ color: 'var(--text-4)' }}>
                  Caterer
                </label>
                {caterersQuery.isLoading ? (
                  <div className="flex items-center gap-2 py-2"><InlineLoader size={14} /></div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {caterers.map(opt => (
                      <button key={opt.id} onClick={() => setSelectedCatId(opt.id)}
                        className="flex items-center gap-3 px-4 py-3 rounded-xl text-left cursor-pointer"
                        style={{
                          background: selectedCatId === opt.id ? 'var(--accent-dim)' : 'var(--bg-inner)',
                          border: `1px solid ${selectedCatId === opt.id ? 'var(--accent-border)' : 'var(--border-strong)'}`,
                          color: selectedCatId === opt.id ? 'var(--accent)' : 'var(--text-2)',
                        }}
                      >
                        <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0"
                          style={{ borderColor: selectedCatId === opt.id ? 'var(--accent)' : 'var(--border-strong)' }}>
                          {selectedCatId === opt.id && (
                            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--accent)' }} />
                          )}
                        </div>
                        <span className="text-[13px] font-semibold">{opt.name}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-[0.1em] font-bold" style={{ color: 'var(--text-4)' }}>
                  Contract Template
                </label>
                {templatesQuery.isLoading ? (
                  <div className="flex items-center gap-2 py-2"><InlineLoader size={14} /></div>
                ) : (
                  <div className="flex flex-col gap-2">
                    {templates.map(tpl => (
                      <button key={tpl.type} onClick={() => setSelectedType(tpl.type)}
                        className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-left cursor-pointer"
                        style={{
                          background: selectedType === tpl.type ? 'var(--accent-dim)' : 'var(--bg-inner)',
                          border: `1px solid ${selectedType === tpl.type ? 'var(--accent-border)' : 'var(--border-strong)'}`,
                        }}
                      >
                        <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                          style={{ borderColor: selectedType === tpl.type ? 'var(--accent)' : 'var(--border-strong)' }}>
                          {selectedType === tpl.type && (
                            <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
                          )}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[13px] font-bold"
                            style={{ color: selectedType === tpl.type ? 'var(--accent)' : 'var(--text-1)' }}>
                            {tpl.name}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Step 2 — Review & Send */}
          {step === 'review' && draft && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                style={{ background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.20)' }}>
                <Info size={13} strokeWidth={1.8} className="shrink-0 mt-0.5" style={{ color: '#a3e635' }} />
                <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>
                  These values were computed by the backend from Modules & Pricing — they're read-only. Only the
                  signatory name/email below can be overridden before sending.
                </p>
              </div>

              <div className="rounded-2xl px-4 py-4 flex flex-col gap-3"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>
                  Merge Fields (from Modules & Pricing)
                </p>
                <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-[12.5px]">
                  <span style={{ color: 'var(--text-4)' }}>Client</span>
                  <span style={{ color: 'var(--text-1)' }}>{draft.mergeFields.clientName ?? '—'}</span>
                  <span style={{ color: 'var(--text-4)' }}>Legal Entity</span>
                  <span style={{ color: 'var(--text-1)' }}>{draft.mergeFields.legalName ?? '—'}</span>
                  <span style={{ color: 'var(--text-4)' }}>Monthly Rate</span>
                  <span style={{ color: 'var(--text-1)' }}>{draft.mergeFields.monthlyRateFormatted}</span>
                  <span style={{ color: 'var(--text-4)' }}>Setup Fees</span>
                  <span style={{ color: 'var(--text-1)' }}>{draft.mergeFields.setupFeesFormatted}</span>
                  <span style={{ color: 'var(--text-4)' }}>Start Date</span>
                  <span style={{ color: 'var(--text-1)' }}>{draft.mergeFields.startDate ?? '—'}</span>
                  <span style={{ color: 'var(--text-4)' }}>Modules</span>
                  <span style={{ color: 'var(--text-1)' }}>{draft.mergeFields.modulesList.join(', ') || '—'}</span>
                </div>
              </div>

              <div className="rounded-2xl px-4 py-4 flex flex-col gap-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>
                  Signatory
                </p>
                <WizardInput label="Signatory Full Name" value={signatoryName} onChange={setSignatoryName} />
                <WizardInput label="Signatory Email"     value={signatoryEmail} onChange={setSignatoryEmail} type="email" />
              </div>

              {draft.status === 'ready_to_send' && (
                <div className="rounded-xl px-4 py-3 flex items-center gap-2.5"
                  style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.25)' }}>
                  <CheckSquare size={13} strokeWidth={1.8} style={{ color: '#60a5fa' }} />
                  <p className="text-[12px]" style={{ color: '#60a5fa' }}>Marked ready to send.</p>
                </div>
              )}

              {stepError && (
                <div className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                  style={{ background: 'rgba(244,63,94,0.08)', border: '1px solid rgba(244,63,94,0.25)' }}>
                  <AlertTriangle size={13} strokeWidth={1.8} className="shrink-0 mt-0.5" style={{ color: '#f43f5e' }} />
                  <p className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>{stepError.message}</p>
                </div>
              )}

              <ActivationNotice />
            </div>
          )}

          {/* Sent state */}
          {step === 'sent' && draft && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.15)', border: '2px solid rgba(74,222,128,0.4)' }}>
                <Check size={26} strokeWidth={2.5} style={{ color: '#4ade80' }} />
              </div>
              <div className="text-center">
                <p className="text-[17px] font-black mb-1" style={{ color: 'var(--text-1)' }}>Contract Sent</p>
                <p className="text-[13px]" style={{ color: 'var(--text-3)' }}>
                  Dispatched to {catererName} via Dropbox Sign.<br />
                  Status will update automatically via webhook.
                </p>
                {draft.dropboxSignRequestId && (
                  <p className="text-[11px] font-mono mt-2" style={{ color: 'var(--text-4)' }}>{draft.dropboxSignRequestId}</p>
                )}
              </div>
              <div className="rounded-xl px-4 py-3 text-center"
                style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.25)' }}>
                <p className="text-[12px]" style={{ color: '#fbbf24' }}>
                  Remember — contract signing alone does not activate the caterer.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {step !== 'sent' ? (
          <div className="flex items-center justify-between gap-3 px-6 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--border-default)' }}>
            <button
              onClick={() => { if (step === 'select') onClose(); if (step === 'review') setStep('select') }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
            >
              {step === 'select' ? 'Cancel' : <><ChevronLeft size={13} strokeWidth={2.5} />Back</>}
            </button>

            {step === 'select' && (
              <button onClick={goToReview} disabled={!selectedCatId || !selectedType || sending}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--accent)', color: '#07070a' }}>
                {createDraftMutation.isPending ? <InlineLoader size={13} /> : <>Create Draft <ChevronRight size={13} strokeWidth={2.5} /></>}
              </button>
            )}
            {step === 'review' && (
              <div className="flex items-center gap-2">
                {draft?.status === 'draft' && (
                  <button onClick={handleReady} disabled={sending}
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-50"
                    style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}>
                    {readyMutation.isPending ? <InlineLoader size={13} /> : 'Mark Ready'}
                  </button>
                )}
                <button onClick={handleSend} disabled={sending || !signatoryEmail}
                  className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  style={{ background: '#a3e635', color: '#07070a' }}>
                  {sendMutation.isPending ? <InlineLoader size={13} /> : <><Send size={13} strokeWidth={2.5} />Send via Dropbox Sign</>}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex justify-center px-6 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--border-default)' }}>
            <button onClick={onClose}
              className="px-6 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'var(--accent)', color: '#07070a' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
