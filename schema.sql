CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  first_name VARCHAR(100),
  last_name VARCHAR(100),
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS services (
  id SERIAL PRIMARY KEY,
  name_et VARCHAR(255) NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  description_et TEXT,
  description_en TEXT,
  duration_minutes INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS staff (
  id SERIAL PRIMARY KEY,
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  specialties TEXT,
  work_start_time TIME DEFAULT '09:00',
  work_end_time TIME DEFAULT '18:00',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS appointments (
  id SERIAL PRIMARY KEY,
  service_id INTEGER NOT NULL REFERENCES services(id),
  staff_id INTEGER NOT NULL REFERENCES staff(id),
  user_id INTEGER REFERENCES users(id),
  customer_name VARCHAR(255),
  customer_email VARCHAR(255),
  customer_phone VARCHAR(20),
  appointment_date DATE NOT NULL,
  appointment_time TIME NOT NULL,
  duration_minutes INTEGER NOT NULL,
  status VARCHAR(50) DEFAULT 'confirmed',
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE (staff_id, appointment_date, appointment_time)
);

CREATE INDEX IF NOT EXISTS idx_appointments_date ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS idx_appointments_staff_id ON appointments(staff_id);
CREATE INDEX IF NOT EXISTS idx_appointments_service_id ON appointments(service_id);
CREATE INDEX IF NOT EXISTS idx_appointments_user_id ON appointments(user_id);

-- Seed data: admin user (password: admin123)
INSERT INTO users (email, password_hash, first_name, last_name, is_admin)
VALUES ('admin@salon.ee', '$2a$10$4wp3cU/17Uq4o7ULD.NlluCMVsdaZxnJaTDZxhABD4FZ.6VKAHKpe', 'Admin', 'Kasutaja', true)
ON CONFLICT (email) DO NOTHING;

-- Seed data: services
INSERT INTO services (name_et, name_en, duration_minutes, price) VALUES
  ('Naiste lõikus', 'Women''s Haircut', 45, 35.00),
  ('Meeste lõikus', 'Men''s Haircut', 30, 25.00),
  ('Juuste värvimine', 'Hair Coloring', 90, 65.00)
ON CONFLICT DO NOTHING;

-- Seed data: staff
INSERT INTO staff (first_name, last_name, work_start_time, work_end_time) VALUES
  ('Maria', 'Tamm', '09:00', '17:00'),
  ('Kati', 'Kask', '10:00', '18:00')
ON CONFLICT DO NOTHING;
