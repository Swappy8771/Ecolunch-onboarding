import { useState, type ReactNode } from 'react'
import { PageTabs } from '../../../shared/ui/PageTabs'
import { RowMenu } from '../../../shared/components/DropdownMenu'
import {
  BookOpen, Baby, Tent, UtensilsCrossed, RotateCcw, Package,
  Plus, Edit3, Trash2, Lock, RefreshCw, WifiOff, ChefHat, Layers,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import {
  useCatererActiveMenuModules, useCatererMenusList, useCatererDishes,
} from '@/features/catererMenus/hooks/useCatererMenusQueries'
import {
  useCreateCatererMenu, useUpdateCatererMenu, useDeleteCatererMenu,
  useCreateCatererDish, useDeleteCatererDish, useAddDishToCatererMenu, useRemoveDishFromCatererMenu,
} from '@/features/catererMenus/hooks/useCatererMenusActions'
import type { MenuType, MenuViewModel, MenuStatus } from '@/features/catererMenus/types/catererMenus.types'
import { MenuFormModal, type MenuFormValues } from '../components/MenuFormModal'
import { DishFormModal } from '../components/DishFormModal'
import { ManageDishesModal } from '../components/ManageDishesModal'
import type { CreateMenuBody, UpdateMenuBody, CreateDishBody } from '@/api/modules/caterer-menus.api'

// ─── Meta ──────────────────────────────────────────────────────

const STATUS_META: Record<MenuStatus, { label: string; color: string; bg: string; border: string }> = {
  draft:         { label: 'Draft',         color: 'var(--text-4)', bg: 'var(--bg-inner)',        border: 'var(--border-default)' },
  submitted:     { label: 'Submitted',     color: '#60a5fa',       bg: 'rgba(96,165,250,0.12)',  border: 'rgba(96,165,250,0.25)' },
  under_review:  { label: 'Under Review',  color: '#fbbf24',       bg: 'rgba(251,191,36,0.12)',  border: 'rgba(251,191,36,0.25)' },
  validated:     { label: 'Validated',     color: '#4ade80',       bg: 'rgba(74,222,128,0.12)',  border: 'rgba(74,222,128,0.25)' },
}

function Badge({ label, color, bg, border }: { label: string; color: string; bg: string; border: string }) {
  return (
    <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full shrink-0"
      style={{ background: bg, color, border: `1px solid ${border}` }}>
      {label}
    </span>
  )
}

function PageLoading() {
  return (
    <div className="flex flex-col gap-5 px-5 py-6 animate-pulse">
      <div className="h-20 rounded-2xl" style={{ background: 'var(--bg-card)' }} />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="h-32 rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)' }} />
      ))}
    </div>
  )
}

function PageError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-24 text-center">
      <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(248,113,113,0.10)', border: '1px solid rgba(248,113,113,0.28)' }}>
        <WifiOff size={22} strokeWidth={1.5} style={{ color: '#f87171' }} />
      </div>
      <div>
        <p className="text-[14px] font-bold mb-1" style={{ color: '#f87171' }}>Failed to load your menus</p>
        <p className="text-[12.5px]" style={{ color: 'var(--text-4)' }}>Check your connection and retry.</p>
      </div>
      <button onClick={onRetry}
        className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[12.5px] font-semibold cursor-pointer"
        style={{ background: 'var(--bg-card)', color: 'var(--text-2)', border: '1px solid var(--border-default)' }}>
        <RefreshCw size={13} strokeWidth={2} />Retry
      </button>
    </div>
  )
}

// ─── SubSectionCard ──────────────────────────────────────────

function SubSectionCard({ Icon, title, count, addLabel, onAdd, children }: {
  Icon: LucideIcon; title: string; count: number; addLabel: string; onAdd: () => void; children: ReactNode
}) {
  return (
    <div className="rounded-2xl" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', overflow: 'hidden' }}>
      <div className="flex items-center justify-between px-5 py-3.5"
        style={{ background: 'var(--bg-inner)', borderBottom: '1px solid var(--border-default)' }}>
        <div className="flex items-center gap-2.5">
          <Icon size={14} strokeWidth={1.8} style={{ color: 'var(--text-4)', flexShrink: 0 }} />
          <h3 className="text-[13.5px] font-bold" style={{ color: 'var(--text-1)' }}>{title}</h3>
          <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full"
            style={{ background: 'var(--bg-card)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
            {count}
          </span>
        </div>
        <button onClick={onAdd}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold cursor-pointer transition-opacity hover:opacity-90 shrink-0"
          style={{ background: 'var(--accent)', color: '#07070a' }}>
          <Plus size={12} strokeWidth={2.5} />{addLabel}
        </button>
      </div>
      {children}
    </div>
  )
}

function MenuRow({ menu, showDishesAction, onEdit, onDelete, onManageDishes }: {
  menu: MenuViewModel
  showDishesAction: boolean
  onEdit: () => void
  onDelete: () => void
  onManageDishes: () => void
}) {
  const sm = STATUS_META[menu.status]
  const detail = menu.packageName
    ? `${menu.packageName}${menu.packagePriceCents != null ? ` · $${(menu.packagePriceCents / 100).toFixed(2)}` : ''}`
    : menu.schedule.length > 0
      ? `${menu.schedule.length} scheduled item${menu.schedule.length !== 1 ? 's' : ''}`
      : `${menu.dishes.length} dish${menu.dishes.length !== 1 ? 'es' : ''}`

  return (
    <div className="flex items-center justify-between gap-3 px-5 py-3.5" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
      <div className="min-w-0">
        <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{menu.name}</p>
        <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-4)' }}>{detail}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Badge {...sm} />
        <RowMenu actions={[
          ...(showDishesAction ? [{ label: 'Manage Dishes', icon: <ChefHat size={12} strokeWidth={2} />, onClick: onManageDishes }] : []),
          { label: 'Edit', icon: <Edit3 size={12} strokeWidth={2} />, onClick: onEdit },
          { label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: onDelete },
        ]} minWidth="160px" />
      </div>
    </div>
  )
}

function MenuGroupSection({ Icon, title, addLabel, menus, showDishesAction, onAdd, onEdit, onDelete, onManageDishes }: {
  Icon: LucideIcon; title: string; addLabel: string
  menus: MenuViewModel[]
  showDishesAction: boolean
  onAdd: () => void
  onEdit: (m: MenuViewModel) => void
  onDelete: (m: MenuViewModel) => void
  onManageDishes: (m: MenuViewModel) => void
}) {
  return (
    <SubSectionCard Icon={Icon} title={title} count={menus.length} addLabel={addLabel} onAdd={onAdd}>
      {menus.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 py-10 px-5 text-center">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
            <Plus size={18} strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
          </div>
          <p className="text-[12.5px] font-semibold" style={{ color: 'var(--text-3)' }}>Nothing added yet</p>
          <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>Use the Add button above to get started</p>
        </div>
      ) : menus.map(m => (
        <MenuRow key={m.id} menu={m} showDishesAction={showDishesAction}
          onEdit={() => onEdit(m)} onDelete={() => onDelete(m)} onManageDishes={() => onManageDishes(m)} />
      ))}
    </SubSectionCard>
  )
}

function ModuleSection({ Icon, title, accentColor, children }: { Icon: LucideIcon; title: string; accentColor: string; children: ReactNode }) {
  return (
    <section className="flex flex-col gap-4">
      <div className="flex items-center gap-3 px-5 py-3.5 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: `3px solid ${accentColor}` }}>
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${accentColor}20`, border: `1px solid ${accentColor}40` }}>
          <Icon size={15} strokeWidth={1.8} style={{ color: accentColor }} />
        </div>
        <h2 className="text-[15px] font-black flex-1" style={{ color: 'var(--text-1)' }}>{title}</h2>
        <span className="flex items-center gap-1.5 text-[11px] font-bold px-2.5 py-1 rounded-full shrink-0"
          style={{ background: 'rgba(74,222,128,0.12)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.25)' }}>
          <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#4ade80', flexShrink: 0 }} />Active Module
        </span>
      </div>
      <div className="flex flex-col gap-4 pl-4 border-l-2" style={{ borderColor: `${accentColor}30` }}>{children}</div>
    </section>
  )
}

function InactiveModule({ Icon, title, description }: { Icon: LucideIcon; title: string; description: string }) {
  return (
    <section>
      <div className="flex items-start gap-4 px-5 py-5 rounded-xl"
        style={{ background: 'var(--bg-card)', border: '1px solid var(--border-default)', borderLeft: '3px solid var(--border-strong)' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--bg-inner)', border: '1px solid var(--border-default)' }}>
          <Icon size={16} strokeWidth={1.5} style={{ color: 'var(--text-4)' }} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2.5 mb-1 flex-wrap">
            <h2 className="text-[15px] font-black" style={{ color: 'var(--text-3)' }}>{title}</h2>
            <span className="flex items-center gap-1.5 text-[10.5px] font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'var(--bg-inner)', color: 'var(--text-4)', border: '1px solid var(--border-default)' }}>
              <Lock size={9} strokeWidth={2.5} />Not Activated
            </span>
          </div>
          <p className="text-[12px]" style={{ color: 'var(--text-4)' }}>{description}</p>
        </div>
      </div>
    </section>
  )
}

function DishLibrarySection({ dishes, onAdd, onDelete }: { dishes: ReturnType<typeof useCatererDishes>['data']; onAdd: () => void; onDelete: (dishId: string) => void }) {
  const list = dishes ?? []
  return (
    <SubSectionCard Icon={Layers} title="Dish Library" count={list.length} addLabel="Add Dish" onAdd={onAdd}>
      {list.length === 0 ? (
        <div className="flex flex-col items-center gap-2.5 py-10 px-5 text-center">
          <p className="text-[12.5px] font-semibold" style={{ color: 'var(--text-3)' }}>No dishes in your library yet</p>
          <p className="text-[11.5px]" style={{ color: 'var(--text-4)' }}>Add reusable dishes here, then attach them to Common Meals or a weekly schedule.</p>
        </div>
      ) : list.map(d => (
        <div key={d.id} className="flex items-center justify-between gap-3 px-5 py-3" style={{ borderBottom: '1px solid var(--border-subtle)' }}>
          <div className="min-w-0">
            <p className="text-[12.5px] font-semibold truncate" style={{ color: 'var(--text-1)' }}>{d.name}</p>
            {d.description && <p className="text-[11px] truncate mt-0.5" style={{ color: 'var(--text-4)' }}>{d.description}</p>}
          </div>
          <RowMenu actions={[{ label: 'Delete', icon: <Trash2 size={12} strokeWidth={2} />, color: '#f87171', onClick: () => onDelete(d.id) }]} minWidth="130px" />
        </div>
      ))}
    </SubSectionCard>
  )
}

// ─── Modal state ──────────────────────────────────────────────

type ModalState =
  | { kind: 'menu'; type: MenuType; isPackage: boolean; editing: MenuViewModel | null }
  | { kind: 'dish' }
  | { kind: 'manage-dishes'; menu: MenuViewModel }
  | null

function sanitizeSchedule(schedule: MenuFormValues['schedule']) {
  if (!schedule.length) return undefined
  return schedule.map(row => ({
    weekNumber: row.weekNumber,
    dayOfWeek: row.dayOfWeek,
    choiceSlot: row.choiceSlot ?? undefined,
    dishId: row.dishId ?? undefined,
    priceCents: row.priceCents ?? undefined,
  }))
}

function menuFormToCreateBody(type: MenuType, values: MenuFormValues): CreateMenuBody {
  const base = { name: values.name.trim() }
  switch (type) {
    case 'school':
      return { type: 'school', ...base, schedule: sanitizeSchedule(values.schedule) }
    case 'common_meals':
      return { type: 'common_meals', ...base }
    case 'rotating_cycle':
      return {
        type: 'rotating_cycle', ...base,
        rotationWeeks: Number(values.rotationWeeks), choicesPerDay: Number(values.choicesPerDay),
        schedule: sanitizeSchedule(values.schedule),
      }
    case 'daycare':
      return {
        type: 'daycare', ...base,
        ageGroup: values.ageGroup.trim() || undefined,
        packageName: values.packageName.trim() || undefined,
        packagePriceCents: values.packagePriceCents ? Number(values.packagePriceCents) : undefined,
        schedule: sanitizeSchedule(values.schedule),
      }
    case 'camp':
      return {
        type: 'camp', ...base,
        sessionDates: values.sessionDates.length ? values.sessionDates : undefined,
        packageName: values.packageName.trim() || undefined,
        packagePriceCents: values.packagePriceCents ? Number(values.packagePriceCents) : undefined,
        schedule: sanitizeSchedule(values.schedule),
      }
  }
}

function menuFormToUpdateBody(type: MenuType, values: MenuFormValues): UpdateMenuBody {
  const base: UpdateMenuBody = { name: values.name.trim() }
  if (type === 'daycare') base.ageGroup = values.ageGroup.trim() || undefined
  if (type === 'rotating_cycle') { base.rotationWeeks = Number(values.rotationWeeks); base.choicesPerDay = Number(values.choicesPerDay) }
  if (type === 'camp') base.sessionDates = values.sessionDates.length ? values.sessionDates : undefined
  if (type === 'daycare' || type === 'camp') {
    base.packageName = values.packageName.trim() || undefined
    base.packagePriceCents = values.packagePriceCents ? Number(values.packagePriceCents) : undefined
  }
  base.schedule = sanitizeSchedule(values.schedule)
  return base
}

// ─── Page ─────────────────────────────────────────────────────

/** Static breadcrumb + title only — shown even before data has loaded, so the page heading is never missing during loading/error states. */
function PageHeading() {
  return (
    <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
      <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
        Caterer Portal / Menus &amp; Packages
      </p>
      <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>Menus &amp; Packages</h1>
    </div>
  )
}

export function CatererMenusPage() {
  const activeModulesQuery = useCatererActiveMenuModules(undefined)
  const menusQuery = useCatererMenusList({ limit: 200 })
  const dishesQuery = useCatererDishes(undefined)

  const createMenuMutation = useCreateCatererMenu()
  const updateMenuMutation = useUpdateCatererMenu()
  const deleteMenuMutation = useDeleteCatererMenu()
  const createDishMutation = useCreateCatererDish()
  const deleteDishMutation = useDeleteCatererDish()
  const addDishMutation = useAddDishToCatererMenu()
  const removeDishMutation = useRemoveDishFromCatererMenu()

  const [modal, setModal] = useState<ModalState>(null)
  const [modalError, setModalError] = useState<string | null>(null)

  const isLoading = activeModulesQuery.isLoading || menusQuery.isLoading || dishesQuery.isLoading
  const isError = activeModulesQuery.isError || menusQuery.isError || dishesQuery.isError

  if (isLoading) return <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}><PageHeading /><PageLoading /></div>
  if (isError || !activeModulesQuery.data || !menusQuery.data || !dishesQuery.data) {
    return <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
      <PageHeading />
      <PageError onRetry={() => { activeModulesQuery.refetch(); menusQuery.refetch(); dishesQuery.refetch() }} />
    </div>
  }

  const activeModules = activeModulesQuery.data
  const menus = menusQuery.data.data
  const dishes = dishesQuery.data

  const schoolMenus = menus.filter(m => m.type === 'school')
  const commonMeals = menus.filter(m => m.type === 'common_meals')
  const rotatingCycle = menus.filter(m => m.type === 'rotating_cycle')
  const daycareMenus = menus.filter(m => m.type === 'daycare' && !m.packageName)
  const daycarePackages = menus.filter(m => m.type === 'daycare' && m.packageName)
  const campMenus = menus.filter(m => m.type === 'camp' && !m.packageName)
  const campPackages = menus.filter(m => m.type === 'camp' && m.packageName)

  function closeModal() { setModal(null); setModalError(null) }

  function handleSaveMenu(type: MenuType, editing: MenuViewModel | null, values: MenuFormValues) {
    setModalError(null)
    if (editing) {
      updateMenuMutation.mutate({ id: editing.id, body: menuFormToUpdateBody(type, values) }, { onSuccess: closeModal, onError: e => setModalError(e.message) })
    } else {
      createMenuMutation.mutate(menuFormToCreateBody(type, values), { onSuccess: closeModal, onError: e => setModalError(e.message) })
    }
  }

  function handleDeleteMenu(m: MenuViewModel) {
    if (!window.confirm(`Delete "${m.name}"? This cannot be undone.`)) return
    deleteMenuMutation.mutate(m.id)
  }

  function handleSaveDish(input: { name: string; description: string; priceCents: string; category: string; availableDays: string[]; allergens: string }) {
    setModalError(null)
    const body: CreateDishBody = { name: input.name.trim() }
    if (input.description.trim()) body.description = input.description.trim()
    if (input.priceCents) body.priceCents = Number(input.priceCents)
    if (input.category.trim()) body.category = input.category.trim()
    if (input.availableDays.length) body.availableDays = input.availableDays as CreateDishBody['availableDays']
    if (input.allergens.trim()) {
      body.allergens = input.allergens.split(',').map(s => s.trim()).filter(Boolean).map(allergenCode => ({ allergenCode }))
    }
    createDishMutation.mutate(body, { onSuccess: closeModal, onError: e => setModalError(e.message) })
  }

  function handleDeleteDish(dishId: string) {
    if (!window.confirm('Delete this dish from your library?')) return
    deleteDishMutation.mutate(dishId)
  }

  return (
    <div style={{ background: 'var(--bg-surface)', minHeight: '100vh' }}>
      <div className="px-5 py-5" style={{ borderBottom: '1px solid var(--border-default)' }}>
        <p className="text-[11px] uppercase tracking-[0.14em] font-bold mb-1" style={{ color: 'var(--text-4)' }}>
          Caterer Portal / Menus &amp; Packages
        </p>
        <h1 className="text-[22px] font-black leading-tight" style={{ color: 'var(--text-1)' }}>Menus &amp; Packages</h1>
        <p className="text-[12px] mt-1" style={{ color: 'var(--text-4)' }}>
          Module-driven configuration — showing sections for active modules only
        </p>
      </div>

      <PageTabs
        tabs={[
          { id: 'school', label: 'School Meals', icon: <BookOpen size={13} strokeWidth={1.8} /> },
          { id: 'daycare', label: 'Daycare / CPE', icon: <Baby size={13} strokeWidth={1.8} /> },
          { id: 'camp', label: 'Camp Meals', icon: <Tent size={13} strokeWidth={1.8} /> },
        ]}>
        {activeTab => (
          <div className="px-5 py-6 flex flex-col gap-8">

            {activeTab === 'school' && (
              activeModules.schoolMeals
                ? <ModuleSection Icon={BookOpen} title="School Meals Module" accentColor="#4ade80">
                    <MenuGroupSection Icon={UtensilsCrossed} title="School Menus" addLabel="Add School Menu" menus={schoolMenus} showDishesAction={false}
                      onAdd={() => setModal({ kind: 'menu', type: 'school', isPackage: false, editing: null })}
                      onEdit={m => setModal({ kind: 'menu', type: 'school', isPackage: false, editing: m })}
                      onDelete={handleDeleteMenu} onManageDishes={m => setModal({ kind: 'manage-dishes', menu: m })} />
                    <MenuGroupSection Icon={UtensilsCrossed} title="Common Meals" addLabel="Add Common Meals" menus={commonMeals} showDishesAction
                      onAdd={() => setModal({ kind: 'menu', type: 'common_meals', isPackage: false, editing: null })}
                      onEdit={m => setModal({ kind: 'menu', type: 'common_meals', isPackage: false, editing: m })}
                      onDelete={handleDeleteMenu} onManageDishes={m => setModal({ kind: 'manage-dishes', menu: m })} />
                    <MenuGroupSection Icon={RotateCcw} title="Rotating Cycle" addLabel="Add Rotating Cycle" menus={rotatingCycle} showDishesAction={false}
                      onAdd={() => setModal({ kind: 'menu', type: 'rotating_cycle', isPackage: false, editing: null })}
                      onEdit={m => setModal({ kind: 'menu', type: 'rotating_cycle', isPackage: false, editing: m })}
                      onDelete={handleDeleteMenu} onManageDishes={m => setModal({ kind: 'manage-dishes', menu: m })} />
                    <DishLibrarySection dishes={dishes} onAdd={() => setModal({ kind: 'dish' })} onDelete={handleDeleteDish} />
                  </ModuleSection>
                : <InactiveModule Icon={BookOpen} title="School Meals Module" description="Activate the School Meals module in Modules & Required Setup to manage school menus here." />
            )}

            {activeTab === 'daycare' && (
              activeModules.daycareMeals
                ? <ModuleSection Icon={Baby} title="Daycare / CPE Meals Module" accentColor="#60a5fa">
                    <MenuGroupSection Icon={UtensilsCrossed} title="Daycare Menus" addLabel="Add Daycare Menu" menus={daycareMenus} showDishesAction={false}
                      onAdd={() => setModal({ kind: 'menu', type: 'daycare', isPackage: false, editing: null })}
                      onEdit={m => setModal({ kind: 'menu', type: 'daycare', isPackage: false, editing: m })}
                      onDelete={handleDeleteMenu} onManageDishes={m => setModal({ kind: 'manage-dishes', menu: m })} />
                    <MenuGroupSection Icon={Package} title="Daycare Packages" addLabel="Add Daycare Package" menus={daycarePackages} showDishesAction={false}
                      onAdd={() => setModal({ kind: 'menu', type: 'daycare', isPackage: true, editing: null })}
                      onEdit={m => setModal({ kind: 'menu', type: 'daycare', isPackage: true, editing: m })}
                      onDelete={handleDeleteMenu} onManageDishes={m => setModal({ kind: 'manage-dishes', menu: m })} />
                    <DishLibrarySection dishes={dishes} onAdd={() => setModal({ kind: 'dish' })} onDelete={handleDeleteDish} />
                  </ModuleSection>
                : <InactiveModule Icon={Baby} title="Daycare / CPE Meals Module" description="Activate the Daycare module in Modules & Required Setup to manage daycare menus here." />
            )}

            {activeTab === 'camp' && (
              activeModules.campMeals
                ? <ModuleSection Icon={Tent} title="Camp Meals Module" accentColor="#a78bfa">
                    <MenuGroupSection Icon={UtensilsCrossed} title="Camp Menus" addLabel="Add Camp Menu" menus={campMenus} showDishesAction={false}
                      onAdd={() => setModal({ kind: 'menu', type: 'camp', isPackage: false, editing: null })}
                      onEdit={m => setModal({ kind: 'menu', type: 'camp', isPackage: false, editing: m })}
                      onDelete={handleDeleteMenu} onManageDishes={m => setModal({ kind: 'manage-dishes', menu: m })} />
                    <MenuGroupSection Icon={Package} title="Camp Packages" addLabel="Add Camp Package" menus={campPackages} showDishesAction={false}
                      onAdd={() => setModal({ kind: 'menu', type: 'camp', isPackage: true, editing: null })}
                      onEdit={m => setModal({ kind: 'menu', type: 'camp', isPackage: true, editing: m })}
                      onDelete={handleDeleteMenu} onManageDishes={m => setModal({ kind: 'manage-dishes', menu: m })} />
                    <DishLibrarySection dishes={dishes} onAdd={() => setModal({ kind: 'dish' })} onDelete={handleDeleteDish} />
                  </ModuleSection>
                : <InactiveModule Icon={Tent} title="Camp Meals Module" description="Camp Menus and Camp Packages will appear here once the Camp Meals module is activated in Modules & Required Setup." />
            )}

            <div className="h-4" />
          </div>
        )}
      </PageTabs>

      {modal?.kind === 'menu' && (
        <MenuFormModal
          type={modal.type} isPackage={modal.isPackage} editing={modal.editing} dishes={dishes}
          isSubmitting={createMenuMutation.isPending || updateMenuMutation.isPending}
          error={modalError}
          onCancel={closeModal}
          onSave={values => handleSaveMenu(modal.type, modal.editing, values)}
        />
      )}

      {modal?.kind === 'dish' && (
        <DishFormModal
          isSubmitting={createDishMutation.isPending}
          error={modalError}
          onCancel={closeModal}
          onSave={handleSaveDish}
        />
      )}

      {modal?.kind === 'manage-dishes' && (
        <ManageDishesModal
          menu={menus.find(m => m.id === modal.menu.id) ?? modal.menu}
          allDishes={dishes}
          isSubmitting={addDishMutation.isPending || removeDishMutation.isPending}
          error={modalError}
          onCancel={closeModal}
          onAdd={dishId => { setModalError(null); addDishMutation.mutate({ menuId: modal.menu.id, dishId }, { onError: e => setModalError(e.message) }) }}
          onRemove={dishId => { setModalError(null); removeDishMutation.mutate({ menuId: modal.menu.id, dishId }, { onError: e => setModalError(e.message) }) }}
        />
      )}
    </div>
  )
}
