-- create two roles/users for the database
-- NOTE: run these statements as a superuser (e.g. postgres)

CREATE ROLE salon_admin LOGIN PASSWORD 'adminpass';
CREATE ROLE salon_viewer LOGIN PASSWORD 'viewerpass';

-- admin gets full permissions on every table
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO salon_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO salon_admin;

-- viewer is read‑only; only SELECT
GRANT CONNECT ON DATABASE salon_booking TO salon_viewer;
GRANT USAGE ON SCHEMA public TO salon_viewer;
GRANT SELECT ON TABLE users, services, staff, appointments, staff_availability TO salon_viewer;

-- as an example we revoke even SELECT on sensitive column
REVOKE SELECT (password_hash) ON users FROM salon_viewer;
