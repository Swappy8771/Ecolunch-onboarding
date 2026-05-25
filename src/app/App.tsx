import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '../layouts/admin/AdminLayout'
import { ClientLayout } from '../layouts/client/ClientLayout'
import { FullPageLoader } from '../shared/ui/FullPageLoader'
import { ErrorBoundary } from '../shared/ui/ErrorBoundary'
import { ThemeProvider } from '../shared/context/ThemeContext'
import { LangProvider } from '../shared/context/LangContext'

const Dashboard = lazy(() => import('../routes/admin/Dashboard').then(m => ({ default: m.Dashboard })))
const OnboardingTraiteurs = lazy(() => import('../routes/admin/OnboardingTraiteurs').then(m => ({ default: m.OnboardingTraiteurs })))
const CentreDeValidation = lazy(() => import('../routes/admin/CentreDeValidation').then(m => ({ default: m.CentreDeValidation })))
const CentreImport = lazy(() => import('../routes/admin/CentreImport').then(m => ({ default: m.CentreImport })))
const EcoLoop = lazy(() => import('../routes/admin/EcoLoop').then(m => ({ default: m.EcoLoop })))
const ModulesConfig = lazy(() => import('../routes/admin/ModulesConfig').then(m => ({ default: m.ModulesConfig })))
const PlaceholderPage = lazy(() => import('../shared/ui/PlaceholderPage').then(m => ({ default: m.PlaceholderPage })))

const ClientDashboard = lazy(() => import('../routes/client/ClientDashboard').then(m => ({ default: m.ClientDashboard })))
const ClientProfil = lazy(() => import('../routes/client/ClientProfil').then(m => ({ default: m.ClientProfil })))
const ClientBanques = lazy(() => import('../routes/client/ClientBanques').then(m => ({ default: m.ClientBanques })))
const ClientMesClients = lazy(() => import('../routes/client/ClientMesClients').then(m => ({ default: m.ClientMesClients })))
const ClientMenus = lazy(() => import('../routes/client/ClientMenus').then(m => ({ default: m.ClientMenus })))
const ClientSmartImport = lazy(() => import('../routes/client/ClientSmartImport').then(m => ({ default: m.ClientSmartImport })))
const ClientEcoLoop = lazy(() => import('../routes/client/EcoLoop').then(m => ({ default: m.EcoLoop })))
const ClientDocumentVault = lazy(() => import('../routes/client/DocumentVault').then(m => ({ default: m.DocumentVault })))

function App() {
  return (
    <ThemeProvider>
    <LangProvider>
    <BrowserRouter>
      <ErrorBoundary>
        <Suspense fallback={<FullPageLoader label="Chargement…" />}>
          <Routes>
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="traiteurs" element={<OnboardingTraiteurs />} />
              <Route path="centre-validation" element={<CentreDeValidation />} />
              <Route path="centre-import" element={<CentreImport />} />
              <Route path="document-vault" element={
                <PlaceholderPage
                  badgeIcon={null}
                  breadcrumb="Document Vault"
                  title="Document Vault"
                  description="Section à définir prochainement."
                  cardIcon={null}
                />
              } />
              <Route path="ecoloop" element={<EcoLoop />} />
              <Route path="modules" element={<ModulesConfig />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>

            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<Navigate to="client-dashboard" replace />} />
              <Route path="client-dashboard" element={<ClientDashboard />} />
              <Route path="profil" element={<ClientProfil />} />
              <Route path="banques" element={<ClientBanques />} />
              <Route path="mes-clients" element={<ClientMesClients />} />
              <Route path="menus" element={<ClientMenus />} />
              <Route path="smart-import" element={<ClientSmartImport />} />
              <Route path="document-vault" element={<ClientDocumentVault />} />
              <Route path="validation" element={
                <PlaceholderPage
                  badgeIcon={null}
                  breadcrumb="Validation"
                  title="Validation & Corrections"
                  description="Section à définir prochainement."
                  cardIcon={null}
                />
              } />
              <Route path="modules" element={
                <PlaceholderPage
                  badgeIcon={null}
                  breadcrumb="Modules"
                  title="Modules"
                  description="Section à définir prochainement."
                  cardIcon={null}
                />
              } />
              <Route path="go-live" element={
                <PlaceholderPage
                  badgeIcon={null}
                  breadcrumb="Go-live"
                  title="Go-live"
                  description="Section à définir prochainement."
                  cardIcon={null}
                />
              } />
              <Route path="ecoloop" element={<ClientEcoLoop />} />
              <Route path="*" element={<Navigate to="client-dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </BrowserRouter>
    </LangProvider>
    </ThemeProvider>
  )
}

export default App
