import { useState } from 'react'
import { X, ChevronRight, ChevronLeft, Check, Send, Info, Server } from 'lucide-react'
import type { Contract, ContractTemplate, MergeFields } from '../types/contract.types'
import {
  TEMPLATES, CATERER_OPTIONS, CATERER_MODULE_CONFIG,
  buildMergeFields, buildDropboxPayload,
} from '../services/mock/contractsMock'
import { WizardInput } from './WizardInput'
import { ActivationNotice } from './ActivationNotice'

type WizardStep = 'select' | 'merge-fields' | 'confirm'

const STEP_LABELS: Record<WizardStep, string> = {
  'select':       '1 · Select',
  'merge-fields': '2 · Merge Fields',
  'confirm':      '3 · Confirm & Send',
}
const STEPS: WizardStep[] = ['select', 'merge-fields', 'confirm']

interface SendWizardProps {
  initialContract: Contract | null
  contracts: Contract[]
  onClose: () => void
}

export function SendWizard({ initialContract, contracts, onClose }: SendWizardProps) {
  const [step, setStep]               = useState<WizardStep>('select')
  const [selectedCatId, setSelectedCatId] = useState(initialContract?.catererId ?? '')
  const [selectedTpl, setSelectedTpl] = useState<ContractTemplate | null>(null)
  const [fields, setFields]           = useState<MergeFields | null>(null)
  const [sent, setSent]               = useState(false)

  function goToMergeFields() {
    if (!selectedCatId || !selectedTpl) return
    setFields(buildMergeFields(selectedCatId, contracts))
    setStep('merge-fields')
  }

  function setField(key: keyof MergeFields, val: string) {
    setFields(prev => prev ? { ...prev, [key]: val } : prev)
  }

  const payload = selectedTpl && fields ? buildDropboxPayload(selectedCatId, selectedTpl, fields) : null
  const catName = CATERER_OPTIONS.find(c => c.id === selectedCatId)?.name ?? ''

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.65)', backdropFilter: 'blur(12px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full flex flex-col"
        style={{
          maxWidth: step === 'confirm' ? '660px' : '560px',
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
              {step === 'select'       && 'Send for Signature'}
              {step === 'merge-fields' && 'Review Merge Fields'}
              {step === 'confirm'      && 'Confirm & Send'}
            </h2>
            <p className="text-[12px] mt-0.5" style={{ color: 'var(--text-4)' }}>
              {step === 'select'       && 'Choose the caterer and contract template.'}
              {step === 'merge-fields' && 'These values will be injected into the contract via Dropbox Sign merge fields. Edit any field before sending.'}
              {step === 'confirm'      && 'Review the Dropbox Sign API payload. Click Send to dispatch via send_with_template.'}
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
                <div className="flex flex-col gap-2">
                  {CATERER_OPTIONS.map(opt => (
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
                      {CATERER_MODULE_CONFIG[opt.id] && (
                        <span className="ml-auto text-[11px]" style={{ color: 'var(--text-4)' }}>
                          {CATERER_MODULE_CONFIG[opt.id].modules.join(', ')}
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-[11px] uppercase tracking-[0.1em] font-bold" style={{ color: 'var(--text-4)' }}>
                  Contract Template
                </label>
                <div className="flex flex-col gap-2">
                  {TEMPLATES.map(tpl => (
                    <button key={tpl.id} onClick={() => setSelectedTpl(tpl)}
                      className="flex items-start gap-3 px-4 py-3.5 rounded-xl text-left cursor-pointer"
                      style={{
                        background: selectedTpl?.id === tpl.id ? 'var(--accent-dim)' : 'var(--bg-inner)',
                        border: `1px solid ${selectedTpl?.id === tpl.id ? 'var(--accent-border)' : 'var(--border-strong)'}`,
                      }}
                    >
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 mt-0.5"
                        style={{ borderColor: selectedTpl?.id === tpl.id ? 'var(--accent)' : 'var(--border-strong)' }}>
                        {selectedTpl?.id === tpl.id && (
                          <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--accent)' }} />
                        )}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <span className="text-[13px] font-bold"
                            style={{ color: selectedTpl?.id === tpl.id ? 'var(--accent)' : 'var(--text-1)' }}>
                            {tpl.type}
                          </span>
                          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded"
                            style={{ background: 'var(--bg-card)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
                            {tpl.version}
                          </span>
                        </div>
                        <p className="text-[11.5px] leading-relaxed" style={{ color: 'var(--text-3)' }}>{tpl.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2 — Merge Fields */}
          {step === 'merge-fields' && fields && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                style={{ background: 'rgba(163,230,53,0.06)', border: '1px solid rgba(163,230,53,0.20)' }}>
                <Info size={13} strokeWidth={1.8} className="shrink-0 mt-0.5" style={{ color: '#a3e635' }} />
                <p className="text-[12px]" style={{ color: 'var(--text-3)' }}>
                  Fields tagged <span className="font-semibold" style={{ color: '#a3e635' }}>auto</span> are
                  pre-filled from Modules/Pricing configuration. Review all values before sending.
                </p>
              </div>

              <div className="rounded-2xl px-4 py-4 flex flex-col gap-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>
                  Client Information
                </p>
                <WizardInput label="Client Name"          value={fields.client_name}     onChange={v => setField('client_name', v)} />
                <WizardInput label="Legal Entity Name"    value={fields.legal_name}      onChange={v => setField('legal_name', v)}      autoSource="Modules/Pricing" />
                <WizardInput label="Signatory Full Name"  value={fields.signatory_name}  onChange={v => setField('signatory_name', v)} />
                <WizardInput label="Signatory Email"      value={fields.signatory_email} onChange={v => setField('signatory_email', v)} type="email" />
              </div>

              <div className="rounded-2xl px-4 py-4 flex flex-col gap-4"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <p className="text-[10.5px] uppercase tracking-[0.12em] font-bold" style={{ color: 'var(--text-4)' }}>
                  Commercial Terms
                </p>
                <WizardInput label="Monthly Rate (CAD)"               value={fields.monthly_rate}   onChange={v => setField('monthly_rate', v)}   autoSource="Modules/Pricing" />
                <WizardInput label="Effective Start Date"             value={fields.start_date}     onChange={v => setField('start_date', v)}     type="date" />
                <WizardInput label="Activated Modules"                value={fields.modules_list}   onChange={v => setField('modules_list', v)}   autoSource="Modules/Pricing" />
                <WizardInput label="Transaction Fee (%)"              value={fields.fee_percentage} onChange={v => setField('fee_percentage', v)} autoSource="Modules/Pricing" />
                <WizardInput label="Fixed Fee per Transaction (CAD)"  value={fields.fixed_fee}      onChange={v => setField('fixed_fee', v)}      autoSource="Modules/Pricing" />
              </div>
            </div>
          )}

          {/* Step 3 — Confirm */}
          {step === 'confirm' && payload && !sent && (
            <div className="flex flex-col gap-4">
              <div className="rounded-xl px-4 py-3 flex items-start gap-2.5"
                style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.25)' }}>
                <Server size={13} strokeWidth={1.8} className="shrink-0 mt-0.5" style={{ color: '#60a5fa' }} />
                <div>
                  <p className="text-[12px] font-bold mb-0.5" style={{ color: '#60a5fa' }}>
                    Dropbox Sign — send_with_template
                  </p>
                  <p className="text-[11.5px]" style={{ color: 'var(--text-3)' }}>
                    This payload will be dispatched to the Dropbox Sign API. A webhook callback will trigger
                    the archiving flow upon completion.
                  </p>
                </div>
              </div>
              <div className="rounded-2xl p-4 overflow-x-auto"
                style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-default)' }}>
                <pre className="text-[11px] leading-relaxed whitespace-pre-wrap font-mono" style={{ color: '#22d3ee' }}>
                  {JSON.stringify(payload, null, 2)}
                </pre>
              </div>
              <ActivationNotice />
            </div>
          )}

          {/* Sent state */}
          {step === 'confirm' && sent && (
            <div className="flex flex-col items-center gap-4 py-8">
              <div className="w-14 h-14 rounded-full flex items-center justify-center"
                style={{ background: 'rgba(74,222,128,0.15)', border: '2px solid rgba(74,222,128,0.4)' }}>
                <Check size={26} strokeWidth={2.5} style={{ color: '#4ade80' }} />
              </div>
              <div className="text-center">
                <p className="text-[17px] font-black mb-1" style={{ color: 'var(--text-1)' }}>Contract Sent</p>
                <p className="text-[13px]" style={{ color: 'var(--text-3)' }}>
                  Dispatched to {catName} via Dropbox Sign.<br />
                  Status will update automatically via webhook.
                </p>
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
        {!sent ? (
          <div className="flex items-center justify-between gap-3 px-6 py-4 shrink-0"
            style={{ borderTop: '1px solid var(--border-default)' }}>
            <button
              onClick={() => {
                if (step === 'select') onClose()
                if (step === 'merge-fields') setStep('select')
                if (step === 'confirm') setStep('merge-fields')
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-2)', border: '1px solid var(--border-strong)' }}
            >
              {step === 'select' ? 'Cancel' : <><ChevronLeft size={13} strokeWidth={2.5} />Back</>}
            </button>

            {step === 'select' && (
              <button onClick={goToMergeFields} disabled={!selectedCatId || !selectedTpl}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: 'var(--accent)', color: '#07070a' }}>
                Review Merge Fields <ChevronRight size={13} strokeWidth={2.5} />
              </button>
            )}
            {step === 'merge-fields' && (
              <button onClick={() => setStep('confirm')}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer"
                style={{ background: 'var(--accent)', color: '#07070a' }}>
                Preview API Payload <ChevronRight size={13} strokeWidth={2.5} />
              </button>
            )}
            {step === 'confirm' && (
              <button onClick={() => setSent(true)}
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl text-[12.5px] font-semibold cursor-pointer"
                style={{ background: '#a3e635', color: '#07070a' }}>
                <Send size={13} strokeWidth={2.5} />Dispatch via Dropbox Sign
              </button>
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
