# 05 — Document Vault by Caterer

---

## Purpose

The Document Vault stores and organizes every document involved in a caterer's onboarding. It is the filing cabinet for all binary files — PDFs, images, spreadsheets, export files.

**Key distinction:** The Vault is for **storage and document review**. Contracts and their signing workflow live in Section 06 (Contract Management), even though signed contract PDFs end up in the vault's `Contracts & Signatures` category.

---

## The Most Important Rule

> **All document files go to Dropbox Storage. The application database never stores binary PDFs.**
>
> The DB stores only: `dropbox_file_id`, `dropbox_file_path`, metadata, status, linked entity IDs, and audit references.

This is not a performance preference — it is an architectural requirement. Every file upload must follow this pattern.

---

## Who Uses This Section

| Role | What They Do Here |
|------|-------------------|
| **Admin** | Reviews all uploaded documents. Approves, rejects, requests corrections. Can upload documents on behalf of internal needs. Uses Smart Import on documents. |
| **Caterer** | Uploads documents to the vault via their Caterer Portal. Receives correction requests if a document is rejected. |

---

## Global Vault View (Admin)

From the main Document Vault sidebar section, admin sees all caterers in a summary list:

| Column | Description |
|--------|-------------|
| Caterer Name | Company name |
| Total Documents | How many files exist in this caterer's vault |
| Under Review | Docs with `status: uploaded` or `under_review` |
| Approved | Docs with `status: approved` |
| Rejected | Docs with `status: rejected` |
| Needing Correction | Docs with `status: correction_requested` |
| Latest Activity | Most recent document event |

Admin clicks **"Open Vault"** on any row to enter that caterer's vault.

---

## Caterer-Specific Vault — 12 Fixed Categories

Every caterer has the same 12 categories. The structure never changes. Only the files inside change per caterer.

| # | Category | What Belongs Here |
|---|----------|------------------|
| 1 | Profile / General Information | Business registration, trade name certificates |
| 2 | Legal Information | Articles of incorporation, legal status docs |
| 3 | Banks & Banking Information | Void cheque, bank confirmation letter |
| 4 | Compliance & Permits | Health permits, food handler certifications, inspection reports |
| 5 | Insurance | Liability insurance certificates, coverage documents |
| 6 | My Clients / Establishments | School/daycare contracts, client lists, CSS agreements |
| 7 | Menus & Packages | Menu PDFs, package descriptions, pricing lists |
| 8 | Modules | Module-specific documentation (if any) |
| 9 | Contracts & Signatures | Signed contracts (auto-placed here after Dropbox Sign completes) |
| 10 | Go-live | Go-live readiness documents, final checklist evidence |
| 11 | Internal Documents | Admin-only files — caterer does NOT see this category |
| 12 | *(Recommended Dropbox path)* | `/Onboarding/Caterers/{id}_{name}/01_Profile/` etc. |

---

## Document Source Types

| Source | When Used |
|--------|----------|
| `caterer_upload` | Caterer uploads a file via their portal |
| `admin_upload` | Admin uploads a file directly |
| `smart_import` | File processed by Smart Import engine |
| `contract_signed` | Signed PDF auto-placed after Dropbox Sign webhook |

---

## Document Actions (Admin)

| Action | What Happens |
|--------|-------------|
| **Direct Upload** | File → Dropbox Storage → `documents` record created |
| **Smart Import** | Triggers Smart Import engine on the selected file (see Section 10) |
| **Classify / Reclassify** | Move document to a different category |
| **View File** | Opens the file via Dropbox link (does not download to app server) |
| **View Extracted Fields** | If Smart Import was run, see all extracted field proposals |
| **View Linked Section** | Navigate to the onboarding section this document relates to |
| **View Validation Status** | See current review status of this document |
| **Approve** | Status → `approved`. Go-live checklist re-evaluated. Audit logged. |
| **Reject** | Status → `rejected`. Reason required. Audit logged. |
| **Request Correction** | Status → `correction_requested`. EcoLoop ticket auto-created. Caterer notified. |
| **Send via EcoLoop** | Attach document to a new or existing EcoLoop ticket |
| **View Version History** | See all previous versions of this document |
| **View Audit Trail** | Full history of all actions on this document |
| **Open in Dropbox** | Direct link to the file in Dropbox Storage |

---

## Document Version Control

Documents in the vault support versioning:

- `documents.version` starts at `1`
- `documents.version_of` is a self-referencing FK — the new version points to the original
- When a caterer re-uploads a document after a correction, the old version is `archived`, the new version becomes active
- Version history is always accessible — nothing is deleted, only archived

---

## How Documents Connect to the Go-live Checklist

When key documents are approved, the system re-evaluates the `go_live_checklist_items`:

- Banking document approved → `banking_validated` checklist item evaluated
- Required compliance documents approved → `documents_approved` checklist item evaluated
- Signed contract placed here (from Dropbox Sign) → `contracts_signed` evaluated

The exact mapping between document categories and checklist items is defined in the go-live logic layer.

---

## Admin vs Caterer Role Summary

| Action | Admin | Caterer |
|--------|-------|---------|
| Upload documents | ✅ (internal docs) | ✅ (their own docs) |
| View all 12 categories | ✅ | ✅ (except Internal Documents) |
| Approve documents | ✅ Only admin | ❌ |
| Reject documents | ✅ Only admin | ❌ |
| Request correction on a document | ✅ Creates the request | Receives via EcoLoop |
| Run Smart Import on a document | ✅ | ✅ (from their portal) |
| View Internal Documents category | ✅ | ❌ Hidden from caterer |
| View audit trail | ✅ Full trail | ✅ Their own actions only |
