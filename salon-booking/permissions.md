# Permissions setup and testing

A simple PostgreSQL role scheme was created using `permissions.sql`.

- `salon_admin` is a login role with full rights (`ALL PRIVILEGES`) on every
  table and sequence in the `public` schema. This corresponds to the
  **admin** role in the assignment.
- `salon_viewer` is a read‑only login; granted `SELECT` on the five main
  tables and prevented from seeing the `password_hash` column on `users` as an
  example of `REVOKE` usage.

### Testing steps

1. Connect as `postgres` or another superuser and run `psql -f permissions.sql`.
2. Open two psql sessions, one logged in as `salon_admin`, the other as
   `salon_viewer`:
   ```bash
   psql -U salon_admin -d salon_booking
   psql -U salon_viewer -d salon_booking
   ```
3. In the admin session insert a dummy row, update, delete – everything works.
4. In the viewer session try:
   ```sql
   SELECT * FROM appointments;        -- succeeds
   INSERT INTO appointments ...;      -- fails with permission denied
   SELECT password_hash FROM users;   -- fails (revoked column)
   ```

A REVOKE example is included in the script (removes viewer’s ability to read
`password_hash`). If you chose SQLite, you would need to implement authorisation
in application code; here PostgreSQL handles it at the database level.
