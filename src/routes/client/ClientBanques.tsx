import { OctagonX } from 'lucide-react'
import { SectionHeader } from '../../shared/ui/SectionHeader'
import { useLang } from '../../shared/context/LangContext'

interface BankFieldProps {
  label: string
  value: string
  placeholder?: boolean
}

function BankField({ label, value, placeholder }: BankFieldProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 card-float"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
    >
      <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold" style={{ color: 'var(--text-4)' }}>
        {label}
      </p>
      <p
        className="text-[13.5px] font-semibold leading-snug"
        style={{ color: placeholder ? 'var(--text-4)' : 'var(--text-1)' }}
      >
        {value}
      </p>
    </div>
  )
}

export function ClientBanques() {
  const { t } = useLang()

  const DOCUMENTS = [
    t.banques.documents.bankStatement,
    t.banques.documents.confirmationLetter,
    t.banques.documents.checkSpecimen,
  ]

  return (
    <div className="p-4 sm:p-7">
      <SectionHeader
        title={t.banques.title}
        description={t.banques.description}
        progress={20}
        status="a-faire"
      />

      {/* Bank fields */}
      <div className="grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-2 gap-3.5 mb-5">
        <BankField label={t.banques.fields.bank} value={t.banques.fields.toProvide} placeholder />
        <BankField label={t.banques.fields.iban} value={t.banques.fields.toProvide} placeholder />
        <BankField label={t.banques.fields.holder} value={t.banques.fields.toProvide} placeholder />
        <BankField label={t.banques.fields.type} value={t.banques.fields.accountType} />
        <div className="col-span-2">
          <BankField label={t.banques.fields.frequency} value={t.banques.fields.frequencyValue} />
        </div>
      </div>

      {/* Documents section */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold mb-4" style={{ color: 'var(--text-4)' }}>
          {t.banques.documents.title}
        </p>
        <div className="flex flex-col gap-3">
          {DOCUMENTS.map(doc => (
            <div key={doc} className="flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <OctagonX size={15} strokeWidth={1.8} style={{ color: '#fb923c', flexShrink: 0 }} />
                <span className="text-[13px]" style={{ color: 'var(--text-2)' }}>{doc}</span>
              </div>
              <span
                className="px-2.5 py-0.5 rounded-full text-[10.5px] font-semibold shrink-0"
                style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.22)' }}
              >
                {t.banques.documents.required}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
