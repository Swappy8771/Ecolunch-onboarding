# 02 — Dashboard Onboarding

---

## Purpose

The Dashboard is the global control room. It is not about a single caterer — it shows the live state of the **entire onboarding operation** across all caterers. From here, an admin gets an instant snapshot of how many caterers are active, what needs their attention, and quick access to any of the 7 other portal sections.

---

## Who Uses This Section

| Role | What They Do Here |
|------|-------------------|
| **Admin** | Monitors the full pipeline. Spots bottlenecks (blocked go-lives, open validations). Navigates to specific sections. |
| **Caterer** | ❌ No access. The Dashboard is internal-only. |

---

## What Must Be Shown

### KPI Tiles (Always Visible)

| KPI | Description |
|-----|-------------|
| Caterers in Onboarding | Total number of caterers with `status: onboarding` |
| Open Validations | Count of `validation_items` with `status: pending_review` or `in_review` |
| Open EcoLoop Tickets | Count of `ecoloop_tickets` with `status: open` or `pending` |
| Blocked Go-live Files | Count of caterers where at least one `golive_checklist_items` is `status: blocked` |
| Recent Activity Feed | Last 5 events from `audit_logs`, across all caterers |

### Quick-Access Cards (7 Cards)

Each card navigates to one of the 7 portal sections:

1. Caterers in Onboarding
2. Validation Center
3. Document Vault by Caterer
4. Contract Management
5. Modules, Pricing & Configurations
6. Go-live Monitor
7. EcoLoop Onboarding

> ⚠️ **Smart Import does NOT appear here.** It is a contextual engine used inside sections, never a standalone dashboard card.

---

## Logic Behind the KPIs

- **Open Validations** counts items waiting for admin action — not items the caterer hasn't submitted yet. It measures admin's own backlog.
- **Blocked Go-live Files** is the most critical KPI. A caterer stuck at go-live means revenue is delayed. This number should ideally stay at zero.
- **Recent Activity Feed** surfaces `audit_log` entries for any entity type — a signed contract, an approved document, a go-live approval. It gives the admin situational awareness without opening individual caterer files.

---

## What This Section Does NOT Do

- It does not show detailed caterer data (that's in Section 03)
- It does not allow any edits or reviews (those happen in their respective sections)
- It does not replace the need to open individual sections for real work
