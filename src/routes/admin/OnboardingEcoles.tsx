import { BookOpen } from 'lucide-react'
import { PlaceholderPage } from '../../shared/ui/PlaceholderPage'

export function OnboardingEcoles() {
  return (
    <PlaceholderPage
      badgeIcon={<BookOpen size={13} strokeWidth={2.5} />}
      breadcrumb="Onboarding · Écoles"
      title="Onboarding Écoles"
      description="L'embarquement des écoles sera défini lors d'une phase ultérieure."
      cardIcon={<BookOpen size={28} strokeWidth={1.5} />}
    />
  )
}
