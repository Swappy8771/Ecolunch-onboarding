# Model: establishments (admin view)

**Storage:** MongoDB · **Admin screen:** Caterer → My Clients · Validation Center
**One line:** The schools, daycares, camps and CSS districts a caterer serves. Admin confirms them.

## Fields (canonical — docs/admin-portal/11)
| Field | Type | Notes |
|-------|------|-------|
| `id` | uuid | PK |
| `caterer_id` | uuid | FK → caterers |
| `type` | enum | `school` · `daycare` · `camp` · `css` |
| `name` | varchar | |
| `address` | varchar | |
| `city` | varchar | |
| `contact_name` | varchar | |
| `contact_email` | varchar | |
| `student_count` | int | schools |
| `css_id` | uuid | **canonical self-ref** (caterer model used `css_district_id`) — links a school to its CSS |
| `status` | enum | `pending` · `confirmed` · **`inactive`** |

## Admin reads / writes
- **Reads:** the list per caterer; an establishment validation item when the caterer adds one.
- **Writes:** **confirms** an establishment (`status`); approves/corrects the submission.

## Note
Canonical enum is `pending/confirmed/inactive` and the self-ref is **`css_id`** (caterer model had `active` and `css_district_id`). Reconciliation #2, #3.
