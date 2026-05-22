import { OctagonX } from 'lucide-react'
import { SectionHeader } from '../../shared/ui/SectionHeader'

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

const DOCUMENTS = [
  'Relevé bancaire (3 derniers mois)',
  'Lettre de confirmation bancaire',
  'Spécimen de chèque annulé',
]

export function ClientBanques() {
  return (
    <div className="p-7">
      <SectionHeader
        title="Banques & informations bancaires"
        description="Coordonnées bancaires pour les versements et les prélèvements."
        progress={20}
        status="a-faire"
      />

      {/* Bank fields */}
      <div className="grid grid-cols-2 gap-3.5 mb-5">
        <BankField label="Banque" value="à fournir" placeholder />
        <BankField label="IBAN / RIB" value="à fournir" placeholder />
        <BankField label="Titulaire du compte" value="à fournir" placeholder />
        <BankField label="Type de compte" value="Compte chèque entreprise" />
        <div className="col-span-2">
          <BankField label="Fréquence de versement" value="Hebdomadaire" />
        </div>
      </div>

      {/* Documents section */}
      <div
        className="rounded-2xl p-5"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
      >
        <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold mb-4" style={{ color: 'var(--text-4)' }}>
          Documents bancaires attendus
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
                Requis
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
