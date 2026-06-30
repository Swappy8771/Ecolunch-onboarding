# Model: user (admin view)

**Storage:** MongoDB · **Admin screen:** Header (all screens) · EcoLoop thread
**One line:** Login accounts for everyone — admins, support, and caterer staff.

## Fields (canonical — docs/admin-portal/11)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `email` | varchar | Unique |
| `role` | enum | `admin` · `caterer_admin` · `caterer_staff` · `school` · `daycare` · `parent` · `support` |
| `caterer_id` | uuid | FK → caterers. **NULL for admin & support users** |
| `first_name` | varchar | |
| `last_name` | varchar | |
| `phone` | varchar | admin-relevant |
| `status` | enum | `active` · `inactive` · `suspended` |
| `last_login_at` | timestamptz | |
| `created_at` | timestamptz | |

## Admin reads / writes
- **Reads:** sender name/role in EcoLoop; logged-in admin in header.
- **Writes:** creates caterer accounts; can set `status` (suspend).

## Admin-relevant fields
`status` (suspend an account) · `phone`. A `caterer_id = NULL` row is an internal EcoLunch user.
