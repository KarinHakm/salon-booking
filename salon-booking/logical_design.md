# Logical Design Overview

This document explains why the tables in `schema.sql` were chosen and how they
relate to the salon booking domain. It also describes how the design handles
business rules and cardinalities.

## Table selection

- **users**: stores credentials and basic profile for both customers and
  administrators. `is_admin` flag distinguishes roles.
- **services**: represents the different procedures (e.g. haircut, coloring) the
  salon offers. Each service has a duration and price.
- **staff**: employees who perform services. Work hours and specialties are
  recorded so availability can be computed.
- **appointments**: central booking table linking a user, a service and a staff
  member to a specific date/time. It also records customer contact details and
  status, allowing guests to book without an account.
- **staff_availability**: auxiliary table for marking days or times when a staff
  member is unavailable or has modified hours. This prevents bookings when
  they are off or blocked.

The minimum required tables for the assignment (classroom, user_or_group,
booking) are covered by `staff` (analogous to classroom), `users` (user or
teacher), and `appointments` (booking). The rest are natural extensions of the
salon domain.

## Handling N..M relationships

There is no direct many‑to‑many link between two primary entities in this
schema; each appointment refers to one service and one staff member. A
many‑to‑many scenario such as "a service can be performed by many staff" is
not modelled explicitly, but could be added via a junction table if needed.

## Business rules and constraints

1. **Appointment end time after start time** – implicitly enforced by storing
   `duration_minutes` and checking availability logic in the application. A
   tighter database rule could be:
   ```sql
   CHECK (duration_minutes > 0)
   ```
   which is already satisfied by application logic when a service defines a
   positive duration.
2. **Non‑negative price and duration** – enforced by `CHECK (price >= 0)` and
   `CHECK (duration_minutes >= 0)` in the `services` table (not shown above but
   easy to add).
3. **Unique slot per staff** – enforced via `UNIQUE(staff_id, appointment_date,
   appointment_time)` in `appointments`.

These rules are implemented as database CHECK constraints or unique constraints
so that invalid data cannot be written even if the application layer fails.
Additional validation is performed in the Express controllers before inserts or
updates.
