import { Shield, Archive, Database, Rocket, CheckCircle2, Check } from 'lucide-react'
import type { Contract } from '../types/contract.types'

export function ArchiveFlow({ contract }: { contract: Contract }) {
  const steps = [
    { icon: <Shield  size={13} strokeWidth={1.8} />, label: 'Dropbox Sign webhook received',  done: true,                          color: '#a78bfa' },
    { icon: <Archive size={13} strokeWidth={1.8} />, label: 'Archived to Dropbox Storage',    done: !!contract.dropboxStoragePath, color: '#22d3ee' },
    { icon: <Database size={13} strokeWidth={1.8} />,label: 'Linked in Document Vault',       done: contract.documentVaultLinked,  color: '#60a5fa' },
    { icon: <Rocket  size={13} strokeWidth={1.8} />, label: 'Go-live Monitor re-evaluated',   done: contract.goLiveReEvaluated,    color: '#a3e635' },
  ]

  return (
    <div className="rounded-2xl p-4" style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.20)' }}>
      <div className="flex items-center gap-2 mb-3">
        <CheckCircle2 size={13} strokeWidth={2} style={{ color: '#4ade80' }} />
        <span className="text-[11px] font-bold uppercase tracking-[0.12em]" style={{ color: '#4ade80' }}>
          Post-Signature Archiving Flow
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

      {contract.dropboxStoragePath && (
        <div className="mt-3 pt-3" style={{ borderTop: '1px solid rgba(74,222,128,0.15)' }}>
          <p className="text-[10px] uppercase tracking-[0.1em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
            Storage path
          </p>
          <p className="text-[11px] font-mono break-all" style={{ color: '#22d3ee' }}>
            {contract.dropboxStoragePath}
          </p>
        </div>
      )}
    </div>
  )
}
