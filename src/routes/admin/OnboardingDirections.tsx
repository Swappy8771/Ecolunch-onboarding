import { Compass } from 'lucide-react'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function OnboardingDirections() {
  return (
    <PlaceholderPage
      badgeIcon={<Compass size={13} strokeWidth={2.5} />}
      breadcrumb="Onboarding · Directions"
      title="Onboarding Directions"
      description="L'embarquement des directions sera défini lors d'une phase ultérieure."
      cardIcon={<Compass size={28} strokeWidth={1.5} />}
    />
  )
}
