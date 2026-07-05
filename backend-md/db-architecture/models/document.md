# Model: Document

## In one line
A record of an uploaded file. The file itself lives in Dropbox — here we keep a link and the details.

## Where it lives
- **Database:** MongoDB
- **Collection:** `documents`

## What it stores

| Field | Type | Required? | Meaning (plain English) |
|-------|------|-----------|--------------------------|
| `_id` | UUID | yes | Unique id. |
| `caterer_id` | UUID | yes | Owner caterer. |
| `category` | text | yes | What kind of document (banking, legal, menus, contracts…). |
| `source` | enum | yes | Where it came from (see below). |
| `status` | enum | yes | Review status (see below). |
| `visibility` | enum | yes | Who can see it (see below). |
| `version` | number | yes | Version number, starts at 1. |
| `version_of` | UUID | no | If this replaces an older file, the id of the original. |
| `dropbox_file_id` | text | yes | The file's id in Dropbox. |
| `dropbox_file_path` | text | yes | The file's path in Dropbox. |
| `file_name` | text | yes | Original file name. |
| `mime_type` | text | yes | File type (PDF, XLSX…). |
| `linked_section` | text | no | Which portal section it belongs to. |
| `smart_import_job_id` | UUID | no | The auto-import job that read it, if any. |
| `uploaded_by` | UUID | yes | Who uploaded it. |
| `uploaded_at` | datetime | yes | When. |
| `reviewed_by` | UUID | no | Which admin reviewed it. |
| `reviewed_at` | datetime | no | When it was reviewed. |

## Where it came from — `source`

| Value | What it means |
|-------|---------------|
| `caterer_upload` | The caterer uploaded it. |
| `admin_upload` | An EcoLunch admin uploaded it. |
| `smart_import` | Created during an auto-import. |
| `contract_signed` | The signed contract PDF, saved automatically. |

## Review status — `status`

| Value | What it means | Set by |
|-------|---------------|--------|
| `uploaded` | Just uploaded, not reviewed yet. | system |
| `under_review` | Admin is checking it. | system |
| `approved` | Accepted. | admin |
| `rejected` | Not accepted. | admin |
| `correction_requested` | Needs a fix/replacement. | admin |
| `archived` | An old version, replaced by a newer one. | system |

## Who can see it — `visibility`

| Value | What it means |
|-------|---------------|
| `client_visible` | The caterer can see it. |
| `internal` | EcoLunch admins only — the caterer never sees it. |

## How it connects
- Belongs to one [caterer](./caterer.md).
- [Banking](./banking.md) and [contracts](./contract.md) point to specific documents.
- New versions link back to the original via `version_of`.

## Rules & checks
- The file is **never** stored in the database — only the Dropbox link + details.
- When the caterer views documents, they only see `client_visible` ones.
- A new version creates a new record (version + 1) and marks the old one `archived`.
- Documents are **never deleted**, only archived.
- Module-specific categories only appear if that module is active.

## Lifecycle
```
uploaded ──► under_review ──► approved
                      └────► rejected / correction_requested ──► caterer uploads new version (old one archived)
```

## Schema (for developers)
```js
required: ["_id","caterer_id","category","source","status","visibility","version","dropbox_file_id"]
source:     enum ["caterer_upload","admin_upload","smart_import","contract_signed"]
status:     enum ["uploaded","under_review","approved","rejected","correction_requested","archived"]
visibility: enum ["client_visible","internal"]
version: int >= 1
// indexes
{ caterer_id: 1, category: 1 }
{ caterer_id: 1, status: 1 }
{ version_of: 1 }
```
