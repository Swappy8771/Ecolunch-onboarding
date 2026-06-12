import { useState } from 'react'
import { ChevronDown, Save, CheckCircle2, Rocket, AlertTriangle } from 'lucide-react'
import type { ConfigSection, ValidationLevel } from '../types/modules.types'
import { CATERER_OPTIONS, getSetup, calcStats } from '../services/mock/modulesMock'
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

function buildSectionStatus(setup: ReturnType<typeof getSetup>): Partial<Record<ConfigSection, ValidationLevel>> {
  const stats = calcStats(setup)
  const pricedAll = stats.priced === stats.active
  const hasTerms  = !!setup.terms.startDate
  const missingDates = setup.modules.filter(m => m.status !== 'inactive' && !m.effectiveDate)
  const ruleIssues   = setup.rules.filter(r => r.status === 'warning' || r.status === 'error')

  return {
    'dashboard':          stats.active > 0 && pricedAll && hasTerms ? 'pass' : 'warning',
    'modules':            stats.active > 0 ? 'pass' : 'error',
    'pricing':            pricedAll ? 'pass' : stats.priced > 0 ? 'warning' : 'error',
    'founding-partner':   'pass',
    'commercial-terms':   hasTerms ? 'pass' : 'error',
    'operational-rules':  ruleIssues.length > 0 ? 'warning' : 'pass',
    'effective-dates':    missingDates.length > 0 ? 'warning' : 'pass',
    'validation':         pricedAll && hasTerms && stats.active > 0 ? 'pass' : 'warning',
    'contract-readiness': setup.contractReady ? 'pass' : 'pending',
    'audit':              'pass',
  }
}

export function ModulesPricing() {
  const [catererId, setCatererId] = useState('cat-1')
  const [section, setSection] = useState<ConfigSection>('dashboard')
  const [unsaved, setUnsaved] = useState(false)

  const setup = getSetup(catererId)
  const sectionStatus = buildSectionStatus(setup)
  const stats = calcStats(setup)

  const active = CATERER_OPTIONS.find(c => c.id === catererId)!

  function handleNavigate(s: string) {
    setSection(s as ConfigSection)
  }

  const screenProps = { setup, onNavigate: handleNavigate }

  return (
    <div className="flex flex-col min-h-screen" style={{ background: 'var(--bg-surface)' }}>
      {/* Page header */}
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

          {/* Caterer selector */}
          <div className="relative shrink-0">
            <select
              value={catererId}
              onChange={e => { setCatererId(e.target.value); setSection('dashboard') }}
              className="appearance-none pl-4 pr-8 py-2.5 rounded-xl text-[13px] font-semibold outline-none cursor-pointer"
              style={{
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                color: 'var(--text-1)', minWidth: '200px',
              }}>
              {CATERER_OPTIONS.map(c => (
                <option key={c.id} value={c.id}>{c.name} — {c.city}</option>
              ))}
            </select>
            <ChevronDown size={13} strokeWidth={2} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--text-4)' }} />
          </div>
        </div>

        {/* Unsaved banner */}
        {unsaved && (
          <div className="flex items-center gap-3 px-4 py-2.5 rounded-xl mb-4"
            style={{ background: 'rgba(251,191,36,0.08)', border: '1px solid rgba(251,191,36,0.22)' }}>
            <AlertTriangle size={13} strokeWidth={2} style={{ color: '#fbbf24' }} />
            <span className="text-[12.5px] font-medium" style={{ color: '#fbbf24' }}>Unsaved changes</span>
            <button onClick={() => setUnsaved(false)}
              className="ml-auto px-3 py-1 rounded-lg text-[11.5px] font-semibold cursor-pointer"
              style={{ background: 'rgba(251,191,36,0.15)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.30)' }}>
              Save now
            </button>
          </div>
        )}

        {/* Caterer context strip */}
        <div className="flex items-center gap-4 flex-wrap px-4 py-2.5 rounded-xl mb-4"
          style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }}>
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-[11px] font-black shrink-0"
            style={{ background: 'var(--accent-dim)', color: 'var(--accent)', border: '1px solid var(--accent-border)' }}>
            {active.name.charAt(0)}
          </div>
          <div className="flex items-center gap-1.5 text-[12.5px]">
            <span className="font-bold" style={{ color: 'var(--text-1)' }}>{setup.name}</span>
            <span style={{ color: 'var(--text-4)' }}>·</span>
            <span style={{ color: 'var(--text-4)' }}>{setup.legalName}</span>
            <span style={{ color: 'var(--text-4)' }}>·</span>
            <span style={{ color: 'var(--text-4)' }}>{setup.city}</span>
          </div>
          <div className="flex items-center gap-3 ml-auto text-[12px]">
            <span style={{ color: 'var(--text-4)' }}>
              <strong style={{ color: 'var(--text-2)' }}>{stats.active}</strong> modules
            </span>
            {setup.foundingPartner.enabled && (
              <span className="px-2 py-0.5 rounded-full text-[11px] font-bold"
                style={{ background: 'rgba(167,139,250,0.12)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.28)' }}>
                Founding Partner
              </span>
            )}
            <span className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>
              Last saved: {setup.lastSaved ?? '—'}
            </span>
          </div>
        </div>

        {/* Navigation tabs */}
        <ConfigNav active={section} onChange={setSection} sectionStatus={sectionStatus} />
      </div>

      {/* Screen content */}
      <div className="flex-1 px-6 py-6">
        {section === 'dashboard'          && <DashboardScreen          {...screenProps} />}
        {section === 'modules'            && <ModulesScreen            {...screenProps} />}
        {section === 'pricing'            && <PricingScreen            {...screenProps} />}
        {section === 'founding-partner'   && <FoundingPartnerScreen    {...screenProps} />}
        {section === 'commercial-terms'   && <CommercialTermsScreen    {...screenProps} />}
        {section === 'operational-rules'  && <OperationalRulesScreen   {...screenProps} />}
        {section === 'effective-dates'    && <EffectiveDatesScreen      {...screenProps} />}
        {section === 'validation'         && <ValidationScreen          {...screenProps} />}
        {section === 'contract-readiness' && <ContractReadinessScreen  {...screenProps} />}
        {section === 'audit'              && <AuditScreen               {...screenProps} />}
      </div>

      {/* Sticky footer */}
      <div className="sticky bottom-0 z-10 px-6 py-3.5 flex items-center gap-3"
        style={{ background: 'var(--bg-surface)', borderTop: '1px solid var(--border-default)', backdropFilter: 'blur(12px)' }}>
        <button
          onClick={() => setUnsaved(false)}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
          style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
          <Save size={13} strokeWidth={2} />Save Draft
        </button>

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
          <Rocket size={13} strokeWidth={2} />Mark Contract Ready
        </button>

        <div className="ml-auto flex items-center gap-3 text-[12px]">
          {Object.values(sectionStatus).filter(s => s === 'error').length > 0 && (
            <div className="flex items-center gap-1.5" style={{ color: '#f87171' }}>
              <AlertTriangle size={12} strokeWidth={2} />
              <span>{Object.values(sectionStatus).filter(s => s === 'error').length} error{Object.values(sectionStatus).filter(s => s === 'error').length > 1 ? 's' : ''}</span>
            </div>
          )}
          {Object.values(sectionStatus).filter(s => s === 'warning').length > 0 && (
            <div className="flex items-center gap-1.5" style={{ color: '#fbbf24' }}>
              <AlertTriangle size={12} strokeWidth={2} />
              <span>{Object.values(sectionStatus).filter(s => s === 'warning').length} warning{Object.values(sectionStatus).filter(s => s === 'warning').length > 1 ? 's' : ''}</span>
            </div>
          )}
          <span style={{ color: 'var(--text-4)' }}>
            {Object.values(sectionStatus).filter(s => s === 'pass').length}/{Object.keys(sectionStatus).length} sections complete
          </span>
        </div>
      </div>
    </div>
  )
}
