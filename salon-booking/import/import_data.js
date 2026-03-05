const fs = require('fs');
const { Pool } = require('pg');
const csv = require('csv-parse/lib/sync');
const xml2js = require('xml2js');
require('dotenv').config({ path: '../backend/.env' });

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

async function main() {
  const client = await pool.connect();
  try {
    // import classes.csv -> staff (treating class as a room/staff placeholder)
    const classesCsv = fs.readFileSync('classes.csv', 'utf8');
    const records = csv(classesCsv, { columns: true, skip_empty_lines: true });
    for (const r of records) {
      await client.query(
        'INSERT INTO staff (id, first_name, last_name, email) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [r.id, r.name, null, null]
      );
    }

    // import teachers.json -> users
    const teachers = JSON.parse(fs.readFileSync('teachers.json', 'utf8'));
    for (const t of teachers) {
      const [first, ...rest] = t.name.split(' ');
      const last = rest.join(' ');
      await client.query(
        'INSERT INTO users (id, email, first_name, last_name) VALUES ($1, $2, $3, $4) ON CONFLICT DO NOTHING',
        [t.id, t.email, first, last]
      );
    }

    // import bookings.xml -> appointments
    const xml = fs.readFileSync('bookings.xml', 'utf8');
    const parser = new xml2js.Parser();
    const result = await parser.parseStringPromise(xml);
    for (const b of result.bookings.booking) {
      const classId = b.class_id[0];
      const teacherId = b.teacher_id[0];
      const date = b.date[0];
      const time = b.start_time[0];
      // we'll default duration to 60 for simplicity
      await client.query(
        `INSERT INTO appointments 
         (service_id, staff_id, user_id, appointment_date, appointment_time, duration_minutes)
         VALUES ($1,$2,$3,$4,$5,$6) ON CONFLICT DO NOTHING`,
        [null, classId, teacherId, date, time, 60]
      );
    }
    console.log('Import finished.');
  } catch (e) {
    console.error('Import failed', e);
  } finally {
    client.release();
    pool.end();
  }
}

main();
