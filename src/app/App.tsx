import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '@layouts/admin/AdminLayout'
import { ClientLayout } from '@layouts/client/ClientLayout'

import { FullPageLoader } from '@shared/ui/FullPageLoader'
import { ErrorBoundary } from '@shared/ui/ErrorBoundary'
import { ThemeProvider } from '@shared/context/ThemeContext'
import { LangProvider } from '@shared/context/LangContext'

// Client pages
const ClientDashboard = lazy(() => import('@/client/dashboard/pages/ClientDashboardPage').then(m => ({ default: m.ClientDashboardPage })))
const ClientProfile   = lazy(() => import('@/client/profil/pages/ClientProfilePage').then(m => ({ default: m.ClientProfilePage })))
const ClientBanques    = lazy(() => import('@/client/banques/pages/ClientBanquesPage').then(m => ({ default: m.ClientBanquesPage })))
const ClientMesClients = lazy(() => import('@/client/mes-clients/pages/ClientMesClientsPage').then(m => ({ default: m.ClientMesClientsPage })))
const ClientMenus      = lazy(() => import('@/client/menus/pages/ClientMenusPage').then(m => ({ default: m.ClientMenusPage })))
const ClientDocVault   = lazy(() => import('@/client/document-vault/pages/ClientDocumentVaultPage').then(m => ({ default: m.ClientDocumentVaultPage })))
const ClientContrats   = lazy(() => import('@/client/contrats/pages/ClientContratsPage').then(m => ({ default: m.ClientContratsPage })))
const ClientModules      = lazy(() => import('@/client/modules/pages/ClientModulesPage').then(m => ({ default: m.ClientModulesPage })))
const ClientCorrections  = lazy(() => import('@/client/corrections/pages/ClientCorrectionsPage').then(m => ({ default: m.ClientCorrectionsPage })))
const ClientGolive       = lazy(() => import('@/client/golive/pages/ClientGolivePage').then(m => ({ default: m.ClientGolivePage })))
const ClientEcoloop      = lazy(() => import('@/client/ecoloop/pages/ClientEcoloopPage').then(m => ({ default: m.ClientEcoloopPage })))

// Admin pages
const Dashboard           = lazy(() => import('@admin/dashboard/pages/AdminDashboardPage').then(m => ({ default: m.Dashboard })))
const CaterersInOnboarding = lazy(() => import('@admin/caterers/pages/AdminCaterersPage').then(m => ({ default: m.CaterersInOnboarding })))
const ValidationCenter    = lazy(() => import('@admin/validation-center/pages/AdminValidationCenterPage').then(m => ({ default: m.ValidationCenter })))
const DocumentVault       = lazy(() => import('@admin/document-vault/pages/AdminDocumentVaultPage').then(m => ({ default: m.DocumentVault })))
const ContractManagement  = lazy(() => import('@admin/contract-management/pages/AdminContractManagementPage').then(m => ({ default: m.ContractManagement })))
const ModulesPricing      = lazy(() => import('@admin/modules-pricing/pages/AdminModulesPricingPage').then(m => ({ default: m.ModulesPricing })))
const ModulesConfig       = lazy(() => import('@admin/modules-pricing/pages/AdminModulesConfigPage').then(m => ({ default: m.ModulesConfig })))
const GoLiveMonitor       = lazy(() => import('@admin/golive-monitor/pages/AdminGolivePage').then(m => ({ default: m.GoLiveMonitor })))
const AdminEcoLoop        = lazy(() => import('@admin/ecoloop/pages/AdminEcoloopPage').then(m => ({ default: m.EcoLoop })))

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
              <Route path="dashboard"            element={<Dashboard />} />
              <Route path="caterers"             element={<CaterersInOnboarding />} />
              <Route path="validation-center"    element={<ValidationCenter />} />
              <Route path="document-vault"       element={<DocumentVault />} />
              <Route path="contract-management"  element={<ContractManagement />} />
              <Route path="modules-pricing"      element={<ModulesPricing />} />
              <Route path="modules-config"       element={<ModulesConfig />} />
              <Route path="golive-monitor"       element={<GoLiveMonitor />} />
              <Route path="ecoloop"              element={<AdminEcoLoop />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>

            <Route path="/client" element={<ClientLayout />}>
              <Route index element={<Navigate to="client-dashboard" replace />} />
              <Route path="client-dashboard" element={<ClientDashboard />} />
              <Route path="profil"          element={<ClientProfile />} />
              <Route path="banques"         element={<ClientBanques />} />
              <Route path="mes-clients"     element={<ClientMesClients />} />
              <Route path="menus"           element={<ClientMenus />} />
              <Route path="document-vault"  element={<ClientDocVault />} />
              <Route path="contrats"        element={<ClientContrats />} />
              <Route path="modules"         element={<ClientModules />} />
              <Route path="corrections"     element={<ClientCorrections />} />
              <Route path="go-live"         element={<ClientGolive />} />
              <Route path="ecoloop"         element={<ClientEcoloop />} />
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
