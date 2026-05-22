import { Code2 } from 'lucide-react'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function OnboardingCSS() {
  return (
    <PlaceholderPage
      badgeIcon={<Code2 size={13} strokeWidth={2.5} />}
      breadcrumb="Onboarding · CSS"
      title="Onboarding CSS"
      description="L'embarquement des CSS (centres de services scolaires) sera défini lors d'une phase ultérieure."
      cardIcon={<Code2 size={28} strokeWidth={1.5} />}
    />
  )
}
