import { Clock, CheckCircle2 } from 'lucide-react'
import { SectionHeader } from '../../shared/ui/SectionHeader'

interface FieldCardProps {
  label: string
  value: string
  validated: boolean
}

function FieldCard({ label, value, validated }: FieldCardProps) {
  return (
    <div
      className="rounded-2xl p-5 flex flex-col gap-3 card-float"
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}
    >
      <p className="text-[9.5px] uppercase tracking-[0.14em] font-semibold" style={{ color: 'var(--text-4)' }}>
        {label}
      </p>
      <div className="flex items-center justify-between gap-3">
        <p className="text-[13.5px] font-semibold leading-snug" style={{ color: 'var(--text-1)' }}>
          {value}
        </p>
        {validated ? (
          <CheckCircle2 size={16} strokeWidth={2} color="#4ade80" className="shrink-0" />
        ) : (
          <Clock size={15} strokeWidth={1.8} className="shrink-0" style={{ color: 'var(--text-4)' }} />
        )}
      </div>
    </div>
  )
}

const FIELDS = [
  { label: 'Raison sociale',        value: 'Concept Gourmet inc.',           validated: false },
  { label: 'NEQ',                   value: '1170555432',                     validated: false },
  { label: 'Siège social',          value: '2245 boul. René-Lévesque O., Montréal, QC H3H 2J5', validated: false },
  { label: 'Contact principal',     value: 'Marc-André Tremblay',            validated: false },
  { label: 'Courriel',              value: 'marca@conceptgourmet.ca',        validated: true  },
  { label: 'Téléphone',             value: '+1 514 555-0142',                validated: true  },
  { label: 'Forme juridique',       value: 'Société par actions (Inc.)',     validated: true  },
  { label: 'Numéro TVQ',            value: '1018456789TQ0001',               validated: false },
]

export function ClientProfil() {
  return (
    <div className="p-7">
      <SectionHeader
        title="Profil"
        description="Informations légales et coordonnées de votre entreprise."
        progress={80}
        status="en-cours"
      />
      <div className="grid grid-cols-2 gap-3.5">
        {FIELDS.map(f => (
          <FieldCard key={f.label} label={f.label} value={f.value} validated={f.validated} />
        ))}
      </div>
    </div>
  )
}
