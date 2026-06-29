# Model: User

## In one line
A login account — either a caterer's staff member or an EcoLunch admin.

## Where it lives
- **Database:** MongoDB
- **Collection:** `users`

## What it stores

| Field | Type | Required? | Meaning (plain English) |
|-------|------|-----------|--------------------------|
| `_id` | UUID | yes | Unique id for the user. |
| `caterer_id` | UUID | no | Which caterer they belong to. Empty for EcoLunch admins. |
| `email` | text | yes | Login email (must be unique). |
| `password_hash` | text | yes | The scrambled password (never the real password). |
| `role` | enum | yes | What they're allowed to do (see below). |
| `first_name` | text | no | First name. |
| `last_name` | text | no | Last name. |
| `last_login_at` | datetime | no | When they last logged in. |
| `created_at` | datetime | yes | When the account was created. |

## Roles explained — `role`

| Value | What it means |
|-------|---------------|
| `admin` | EcoLunch internal staff. Sees everything, approves things. |
| `caterer_admin` | The caterer's main account holder. Can do everything for their own caterer. |
| `caterer_staff` | A caterer team member with limited access. |
| `support` | A support session account (its actions are extra-audited). |

## How it connects
- A user with a `caterer_id` belongs to one [caterer](./caterer.md).
- Admin users have no `caterer_id` (they aren't tied to a single caterer).

## Rules & checks
- `email` is unique across all users.
- We store only the **hashed** password — never plain text.
- The password is set by the caterer on their **first login** (the admin creates the account first).

## Lifecycle
```
admin creates account ──► caterer logs in first time & sets password ──► normal logins update last_login_at
```

## Schema (for developers)
```js
required: ["_id","email","role","created_at"]
role: enum ["admin","caterer_admin","caterer_staff","support"]
email: pattern ^[^@\s]+@[^@\s]+\.[^@\s]+$

// indexes
{ email: 1 } UNIQUE
{ caterer_id: 1 }
```
