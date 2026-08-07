import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { ChevronDown, CheckCircle2, Rocket, AlertTriangle } from 'lucide-react'
import { useCaterers } from '@/features/adminCaterers/hooks/useCaterers'
import { useCatererModuleSetup } from '@/features/adminModulesPricing/hooks/useCatererModuleSetup'
import { useValidationStatus } from '@/features/adminModulesPricing/hooks/useValidationStatus'
import { useContractReadiness } from '@/features/adminModulesPricing/hooks/useContractReadiness'
import { FullPageLoader } from '@shared/ui/FullPageLoader'
import type { ConfigSection, ValidationLevel } from '../types/modules.types'
import { ConfigNav } from '../components/ConfigNav'
import { DashboardScreen } from '../components/screens/DashboardScreen'
import { ModulesScreen } from '../components/screens/ModulesScreen'
import { PricingScreen } from '../components/screens/PricingScreen'
import { FoundingPartnerScreen } from '../components/screens/FoundingPartnerScreen'
import { CommercialTermsScreen } from '../components/screens/CommercialTermsScreen'
import { OperationalRulesScreen } from '../components/screens/OperationalRulesScreen'
import { EffectiveDatesScreen } from '../components/screens/EffectiveDatesScreen'
import { ValidationScreen } from '../components/screens/ValidationScreen'
import { ContractReadinessScreen } from '../components/screens/ContractReadinessScreen'
import { AuditScreen } from '../components/screens/AuditScreen'

const SCREEN_TITLES: Record<ConfigSection, string> = {
  'dashboard':          'Dashboard',
  'modules':            'Modules',
  'pricing':            'Pricing',
  'founding-partner':   'Founding Partner',
  'commercial-terms':   'Commercial Terms',
  'operational-rules':  'Operational Rules',
  'effective-dates':    'Effective Dates',
  'validation':         'Validation',
  'contract-readiness': 'Contract Readiness',
  'audit':              'Audit & History',
}

export function ModulesPricing() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [catererId, setCatererId] = useState(searchParams.get('catererId') ?? '')
  const [section, setSection] = useState<ConfigSection>('dashboard')

  const caterersQuery = useCaterers({ limit: 100 })
  const caterers = caterersQuery.data?.items ?? []

  // Consume the deep-link param once so later navigation doesn't fight with it — same pattern as Document Vault/Contract Management.
  useEffect(() => {
    if (searchParams.has('catererId')) {
      setSearchParams(params => { params.delete('catererId'); return params }, { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Default to the first real caterer once the list loads, if none was selected via deep link.
  useEffect(() => {
    if (!catererId && caterers.length > 0) setCatererId(caterers[0].id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caterers])

  const setupQuery = useCatererModuleSetup(catererId, { enabled: Boolean(catererId) })
  const validationQuery = useValidationStatus(catererId, { enabled: Boolean(catererId) })
  const readinessQuery = useContractReadiness(catererId, { enabled: Boolean(catererId) })

  const setup = setupQuery.data
  const validationStatus = validationQuery.data
  const readiness = readinessQuery.data
  const activeCaterer = caterers.find(c => c.id === catererId)

  function buildSectionStatus(): Partial<Record<ConfigSection, ValidationLevel>> {
    if (!setup) return {}
    const activeModules = setup.modules.filter(m => m.status !== 'inactive')
    const missingDates = activeModules.filter(m => !m.effectiveDate)
    return {
      'dashboard':          setup.summary.activeCount > 0 && setup.summary.pricingConfigured ? 'pass' : 'warning',
      'modules':            setup.summary.activeCount > 0 ? 'pass' : 'error',
      'pricing':            setup.summary.pricingConfigured ? 'pass' : activeModules.length > 0 ? 'warning' : 'error',
      'founding-partner':   'pending',
      'commercial-terms':   'pending',
      'operational-rules':  'pending',
      'effective-dates':    missingDates.length > 0 ? 'warning' : 'pass',
      'validation':         validationStatus?.overallReady ? 'pass' : 'warning',
      'contract-readiness': readiness?.readyForContracts ? 'pass' : 'pending',
      'audit':              'pass',
    }
  }
  const sectionStatus = buildSectionStatus()

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-surface)' }}>
      <div className="px-6 pt-6 pb-0">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-5">
          <div>
            <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-0.5" style={{ color: 'var(--text-4)' }}>
              Admin / Modules, Pricing & Configurations
            </p>
            <h1 className="text-[24px] font-black" style={{ color: 'var(--text-1)' }}>
              {SCREEN_TITLES[section]}
            </h1>
          </div>

          <div className="relative shrink-0">
            <select
              value={catererId}
              onChange={e => { setCatererId(e.target.value); setSection('dashboard') }}
              className="appearance-none pl-4 pr-8 py-2.5 rounded-xl text-[13px] font-semibold outline-none cursor-pointer"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', color: 'var(--text-1)', minWidth: '220px' }}>
              {caterers.length === 0 && <option value="">Loading caterers…</option>}
              {caterers.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.city}</option>
              ))}
            </select>
            <ChevronDown size={13} strokeWidth={2} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
          </div>
        </div>

        {activeCaterer && (
          <div className="flex items-center gap-4 flex-wrap px-4 py-2.5 rounded-xl mb-4"
            style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
              style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
              {activeCaterer.name.charAt(0)}
            </div>
            <div className="flex items-center gap-1.5 text-[12.5px]">
              <span className="font-bold" style={{ color: 'var(--text-1)' }}>{activeCaterer.name}</span>
              <span style={{ color: 'var(--text-4)' }}>·</span>
              <span style={{ color: 'var(--text-4)' }}>{activeCaterer.city || '—'}</span>
            </div>
            {setup && (
              <div className="flex items-center gap-3 ml-auto text-[12px]">
                <span style={{ color: 'var(--text-4)' }}>
                  <strong style={{ color: 'var(--text-2)' }}>{setup.summary.activeCount}</strong> modules
                </span>
                <span style={{ color: 'var(--text-4)' }}>
                  <strong style={{ color: 'var(--text-2)' }}>${(setup.summary.monthlyTotalCents / 100).toLocaleString()}</strong>/mo
                </span>
              </div>
            )}
          </div>
        )}

        <ConfigNav active={section} onChange={setSection} sectionStatus={sectionStatus} />
      </div>

      <div className="flex-1 px-6 py-6">
        {!catererId || setupQuery.isLoading ? (
          <FullPageLoader label="Loading module setup…" />
        ) : setupQuery.isError || !setup ? (
          <div className="flex flex-col items-center justify-center py-20 gap-2">
            <AlertTriangle size={28} strokeWidth={1.2} style={{ color: '#f87171' }} />
            <span className="text-[13px]" style={{ color: 'var(--text-3)' }}>{setupQuery.error?.message ?? 'Failed to load module setup.'}</span>
          </div>
        ) : (
          <>
            {section === 'dashboard'          && <DashboardScreen setup={setup} validationStatus={validationStatus} onNavigate={s => setSection(s as ConfigSection)} />}
            {section === 'modules'            && <ModulesScreen catererId={catererId} modules={setup.modules} onNavigate={s => setSection(s as ConfigSection)} />}
            {section === 'pricing'            && <PricingScreen catererId={catererId} modules={setup.modules} />}
            {section === 'founding-partner'   && <FoundingPartnerScreen catererId={catererId} modules={setup.modules} />}
            {section === 'commercial-terms'   && <CommercialTermsScreen catererId={catererId} modules={setup.modules} />}
            {section === 'operational-rules'  && <OperationalRulesScreen catererId={catererId} modules={setup.modules} />}
            {section === 'effective-dates'    && <EffectiveDatesScreen catererId={catererId} modules={setup.modules} />}
            {section === 'validation'         && <ValidationScreen validationStatus={validationStatus} isLoading={validationQuery.isLoading} />}
            {section === 'contract-readiness' && <ContractReadinessScreen readiness={readiness} isLoading={readinessQuery.isLoading} />}
            {section === 'audit'              && <AuditScreen catererId={catererId} modules={setup.modules} />}
          </>
        )}
      </div>

      <div className="sticky bottom-0 z-10 px-6 py-3.5 flex items-center gap-3"
        style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)', backdropFilter: 'blur(12px)' }}>
        <button
          onClick={() => setSection('validation')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
          style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
          <CheckCircle2 size={13} strokeWidth={2} />Validate
        </button>
        <button
          onClick={() => setSection('contract-readiness')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
          style={{ background: 'var(--accent)', color: '#07070a' }}>
          <Rocket size={13} strokeWidth={2} />Contract Readiness
        </button>

        <div className="ml-auto flex items-center gap-3 text-[12px]">
          <span style={{ color: 'var(--text-4)' }}>
            {Object.values(sectionStatus).filter(s => s === 'pass').length}/{Object.keys(sectionStatus).length} sections ready
          </span>
        </div>
      </div>
    </div>
  )
}
