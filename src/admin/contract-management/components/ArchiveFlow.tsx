import { Shield, Database, CheckCircle2, Check } from 'lucide-react'
import type { ContractDetailViewModel } from '@/features/adminContracts'

/**
 * Redesigned around the real backend DTOs (Phase 4B §7) — no more
 * `dropboxStoragePath`/`documentVaultLinked`/`goLiveReEvaluated` (none of
 * these have a backend equivalent). Only three real facts exist:
 * `status === 'signed'`, and whether `signedDocumentId`/
 * `auditTrailDocumentId` are populated. The old mock's 4th step ("webhook
 * received") carried no information — it was always `done: true`
 * whenever this component rendered at all — so it's dropped, not migrated.
 */
export function ArchiveFlow({ contract }: { contract: ContractDetailViewModel }) {
  const archived = contract.signedDocumentId !== null && contract.auditTrailDocumentId !== null

  const steps = [
    { icon: <Shield size={13} strokeWidth={1.8} />, label: 'Contract signed', done: contract.status === 'signed', color: '#a78bfa' },
    { icon: <Database size={13} strokeWidth={1.8} />, label: 'Archived to Document Vault (signed doc + audit trail)', done: archived, color: '#60a5fa' },
  ]

  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.20)' }}>
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: '#4ade80' }}>
          Post-Signature Archiving
        </span>
      </div>

      <div className="flex flex-col gap-2">
        {steps.map((step, i) => (
          <div key={i} className="flex items-center gap-2.5">
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: step.done ? step.color + '20' : 'var(--bg-inner)',
                border: `1px solid ${step.done ? step.color + '50' : 'var(--border-strong)'}`,
                color: step.done ? step.color : 'var(--text-4)',
              }}
            >
              {step.done ? <Check size={10} strokeWidth={2.5} /> : step.icon}
            </div>
            <span className="text-[12px]" style={{ color: step.done ? 'var(--text-2)' : 'var(--text-4)' }}>
              {step.label}
            </span>
            {!step.done && (
              <span
                className="text-[10px] px-1.5 py-0.5 rounded font-medium ml-auto"
                style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-strong)' }}
              >
                pending
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
