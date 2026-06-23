# 07 — Modules, Pricing & Configurations

---

## Purpose

This section is where EcoLunch Admin selects which commercial modules a caterer will use, sets the pricing for each, and configures the operational rules that govern how each module behaves for that caterer.

The values configured here are the source of truth for:
- Contract merge fields (what gets printed in the caterer's contracts)
- Module annexes and fee schedule annexes
- Operational rules applied after go-live (cutoff times, credit logic, payout rules, etc.)

**This section must be completed before sending contracts.** If contracts are sent with empty or incorrect merge fields, the legal documents will be wrong.

---

## Who Uses This Section

| Role | What They Do Here |
|------|-------------------|
| **Admin** | Configures everything. Selects modules, sets pricing, defines all operational rules. |
| **Caterer** | ❌ Does not configure anything here. After go-live, they can view (but not change) their configured modules in their Caterer Portal. |

---

## Important Naming

This section is called **"Modules, Pricing & Configurations"** — not "Modules & Configurations."

Pricing is set **here**, not in Contract Management. Contract Management only reads the pricing values that were configured here.

---

## Commercial Modules (Activable)

These are the 7 modules that can be turned on or off per caterer:

### 1. School Meals
**What it does:** Manages meal ordering, tracking, and reporting for school clients.

| Config Field | Description |
|-------------|-------------|
| Status | Active / Inactive |
| Effective Date | When the module becomes live for this caterer |
| Monthly SaaS Price | Monthly recurring charge to the caterer |
| Setup Fee | One-time onboarding fee (may be $0) |
| Founding Partner | If true, module is free for the caterer permanently |
| Cutoff Rules | Order cutoff times per day/week for school meal submissions |
| Labels | Custom label settings for meal categories |
| Notification Settings | Which events trigger notifications and to whom |
| Reports Configuration | Which report templates are enabled |
| Calendars | School calendar integration settings |

---

### 2. Daycare / CPE Meals
**What it does:** Manages meal ordering, credits, and reporting for daycares and CPE (Centre de la Petite Enfance) clients.

| Config Field | Description |
|-------------|-------------|
| Status | Active / Inactive |
| Effective Date | When the module becomes live |
| Monthly SaaS Price | Monthly recurring charge |
| Setup Fee | One-time onboarding fee |
| Founding Partner | Free-for-life flag |
| Menus Config | How menus are structured for daycares |
| Packages Config | Meal package definitions |
| Credit Rules | How credits are calculated when a child is absent |
| Reports Configuration | Report templates for daycares |
| Labels | Custom label settings |

---

### 3. Camp Meals
**What it does:** Manages meal service for summer camps and similar seasonal operations.

| Config Field | Description |
|-------------|-------------|
| Status | Active / Inactive |
| Effective Date | When the module becomes live |
| Monthly SaaS Price | Monthly recurring charge (may be seasonal) |
| Setup Fee | If applicable |
| Menus / Packages | Menu and package structure for camps |
| Calendar | Camp session calendar configuration |
| Reports | Camp-specific reporting templates |

---

### 4. ReportIQ
**What it does:** Advanced reporting and analytics layer on top of core modules.

| Config Field | Description |
|-------------|-------------|
| Status | Active / Inactive |
| Included vs. Billable | Is ReportIQ included in base pricing or billed separately? |
| Monthly Module Price | Price if billable |
| Discount | Any negotiated discount |
| Effective Date | When it becomes active |
| Report Templates | Which report types are available |
| Delivery Cadence | How often reports are generated/sent |
| Export Permissions | What formats can the caterer export (CSV, PDF, Excel, etc.) |

---

### 5. Accounting
**What it does:** Connects EcoLunch financial data to the caterer's accounting software.

| Config Field | Description |
|-------------|-------------|
| Status | Active / Inactive |
| Accounting Stack | Which software: Acomba / QuickBooks / Sage |
| Monthly Price | Monthly recurring charge |
| Implementation Fee | Setup cost for accounting integration |
| Field Mapping | GL account codes, income/expense mapping |
| Export Rules | When and how data is exported to the accounting system |

---

### 6. Parent Subscriptions
**What it does:** Enables subscription-based payment plans for parents (monthly, termly, etc.).

| Config Field | Description |
|-------------|-------------|
| Status | Active / Inactive |
| Monthly Price | If billed separately, or "included" in base package |
| Subscription Settings | Recurrence intervals, billing cycles |
| Parent-Facing Options | What parents see and can control in their portal |

---

### 7. CSS Reporting
**What it does:** Specialized reporting for CSS (Centre de Services Scolaires — school board) entities.

| Config Field | Description |
|-------------|-------------|
| Status | Active / Inactive |
| Monthly Price | If billed separately, or "included" |
| CSS Report Formats | Which report formats the CSS requires |
| Access Rules | Who can generate CSS reports |
| Data Scope | Which establishments are included in CSS reports |

---

## Infrastructure (Not Commercial Modules)

The following are **infrastructure components**, not commercial modules. They are not shown in the activable modules list, do not have per-caterer pricing toggles in this section, and have their own separate settings:

| Component | Why It's Infrastructure, Not a Module |
|-----------|--------------------------------------|
| EcoLoop | Communication system — always present, not billable per module |
| Ledger | Financial record-keeping — always present |
| EcoWallet | Digital wallet infrastructure |
| Credit Card Payments | Payment rail — enabled/disabled at infrastructure level |
| Apple Pay / Google Pay | Payment rails |
| Interac Direct | Payment rail |
| Sezzle | Buy-now-pay-later payment rail |

---

## How Module Config Flows to Contracts

```
Admin configures module in this section
          │
          ▼
Values saved to caterer_modules table
(monthly_price_cents, setup_fee_cents, effective_date, 
 founding_partner_free, discount_pct, payout_rules, etc.)
          │
          ▼
Admin opens Contract Management → selects contract type
          │
          ▼
System reads caterer_modules values to populate merge fields
          │
          ▼
Admin confirms merge fields (monthly_rate, module_name, effective_date, fee_percentage, etc.)
          │
          ▼
Dropbox Sign template is filled and sent to caterer
```

This is why modules must be configured before contracts are sent.

---

## Go-live Checklist Connection

Configuring modules and pricing satisfies two go-live checklist requirements:

| Checklist Item | Satisfied When |
|----------------|---------------|
| `modules_configured` | At least one module is set to `active` with a valid `effective_date` |
| `pricing_configured` | All active modules have `monthly_price_cents` set (even if $0 for founding partners) |

---

## Admin vs Caterer Role Summary

| Action | Admin | Caterer |
|--------|-------|---------|
| Select which modules are active | ✅ | ❌ |
| Set monthly pricing | ✅ | ❌ |
| Set setup fees | ✅ | ❌ |
| Mark as founding partner (free) | ✅ | ❌ |
| Configure cutoff rules, credit rules, payout rules | ✅ | ❌ |
| Configure report templates | ✅ | ❌ |
| View configured modules after go-live | ✅ | ✅ Read-only in their portal |
| Request a module change | ❌ | Via EcoLoop → admin makes the change |
