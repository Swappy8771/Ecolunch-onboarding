import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AdminLayout } from '@layouts/admin/AdminLayout'
import { CatererLayout } from '@layouts/caterer/CatererLayout'

import { FullPageLoader } from '@shared/ui/FullPageLoader'
import { ErrorBoundary } from '@shared/ui/ErrorBoundary'
import { ThemeProvider } from '@shared/context/ThemeContext'
import { LangProvider } from '@shared/context/LangContext'
import { AuthProvider } from '@/auth'
import { LoginPage } from '@/auth/pages/LoginPage'
import { CatererAuthProvider } from '@/auth/caterer'
import { CatererLoginPage } from '@/caterer/auth/pages/CatererLoginPage'
import { CatererSetPasswordPage } from '@/caterer/auth/pages/CatererSetPasswordPage'
import { CatererForgotPasswordPage } from '@/caterer/auth/pages/CatererForgotPasswordPage'
import { CatererSupportSessionEntryPage } from '@/caterer/auth/pages/CatererSupportSessionEntryPage'

// Caterer Portal pages
const CatererDashboard = lazy(() => import('@/caterer/dashboard/pages/CatererDashboardPage').then(m => ({ default: m.CatererDashboardPage })))
const CatererProfile   = lazy(() => import('@/caterer/profil/pages/CatererProfilePage').then(m => ({ default: m.CatererProfilePage })))
const CatererBanking      = lazy(() => import('@/caterer/banking/pages/CatererBankingPage').then(m => ({ default: m.CatererBankingPage })))
const CatererEstablishments = lazy(() => import('@/caterer/establishments/pages/CatererEstablishmentsPage').then(m => ({ default: m.CatererEstablishmentsPage })))
const CatererMenus      = lazy(() => import('@/caterer/menus/pages/CatererMenusPage').then(m => ({ default: m.CatererMenusPage })))
const CatererDocVault   = lazy(() => import('@/caterer/document-vault/pages/CatererDocumentVaultPage').then(m => ({ default: m.CatererDocumentVaultPage })))
const CatererContracts  = lazy(() => import('@/caterer/contracts/pages/CatererContractsPage').then(m => ({ default: m.CatererContractsPage })))
const CatererModules      = lazy(() => import('@/caterer/modules/pages/CatererModulesPage').then(m => ({ default: m.CatererModulesPage })))
const CatererCorrections  = lazy(() => import('@/caterer/corrections/pages/CatererCorrectionsPage').then(m => ({ default: m.CatererCorrectionsPage })))
const CatererGolive       = lazy(() => import('@/caterer/golive/pages/CatererGolivePage').then(m => ({ default: m.CatererGolivePage })))
const CatererEcoloop      = lazy(() => import('@/caterer/ecoloop/pages/CatererEcoloopPage').then(m => ({ default: m.CatererEcoloopPage })))

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
      <AuthProvider>
      <CatererAuthProvider>
      <ErrorBoundary>
        <Suspense fallback={<FullPageLoader label="Chargement…" />}>
          <Routes>
            {/* Login gate temporarily removed on both /admin and /caterer — this build is
                deployed standalone for a client demo with no backend to authenticate
                against. Restore by wrapping AdminLayout/CatererLayout in
                ProtectedRoute/CatererProtectedRoute (see git history) once a backend is live. */}
            <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

            <Route path="/login" element={<LoginPage />} />

            <Route path="/caterer/login" element={<CatererLoginPage />} />
            <Route path="/caterer/set-password" element={<CatererSetPasswordPage />} />
            <Route path="/caterer/forgot-password" element={<CatererForgotPasswordPage />} />
            <Route path="/caterer/support-session" element={<CatererSupportSessionEntryPage />} />

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

            <Route path="/caterer" element={<CatererLayout />}>
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"       element={<CatererDashboard />} />
              <Route path="profil"          element={<CatererProfile />} />
              <Route path="banking"         element={<CatererBanking />} />
              <Route path="establishments"  element={<CatererEstablishments />} />
              <Route path="menus"           element={<CatererMenus />} />
              <Route path="document-vault"  element={<CatererDocVault />} />
              <Route path="contracts"       element={<CatererContracts />} />
              <Route path="modules"         element={<CatererModules />} />
              <Route path="corrections"     element={<CatererCorrections />} />
              <Route path="go-live"         element={<CatererGolive />} />
              <Route path="ecoloop"         element={<CatererEcoloop />} />
              <Route path="*" element={<Navigate to="dashboard" replace />} />
            </Route>

            <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      </CatererAuthProvider>
      </AuthProvider>
    </BrowserRouter>
    </LangProvider>
    </ThemeProvider>
  )
}

export default App
