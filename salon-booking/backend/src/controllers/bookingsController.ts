import { Request, Response } from 'express';
import { query } from '../database/db';

export const getAllBookings = async (req: Request, res: Response) => {
  try {
    let queryStr = `
      SELECT a.*, s.name_et, s.name_en, s.price, 
             st.first_name, st.last_name
      FROM appointments a
      JOIN services s ON a.service_id = s.id
      JOIN staff st ON a.staff_id = st.id
    `;
    const params: any[] = [];

    // If user is not admin, only show their bookings
    if (!req.user?.isAdmin) {
      queryStr += ` WHERE a.user_id = $1`;
      params.push(req.user?.userId);
    }

    queryStr += ` ORDER BY a.appointment_date DESC`;

    const result = await query(queryStr, params);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
};

export const getBookingById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query(
      `SELECT a.*, s.name_et, s.name_en, s.price, 
              st.first_name, st.last_name
       FROM appointments a
       JOIN services s ON a.service_id = s.id
       JOIN staff st ON a.staff_id = st.id
       WHERE a.id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({ error: 'Failed to fetch booking' });
  }
};

export const getAvailability = async (req: Request, res: Response) => {
  try {
    const { serviceId, staffId, date } = req.query;

    if (!serviceId || !staffId || !date) {
      return res.status(400).json({ error: 'Service ID, staff ID, and date are required' });
    }

    // Get service details
    const serviceResult = await query('SELECT * FROM services WHERE id = $1', [serviceId]);
    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const service = serviceResult.rows[0];
    const duration = service.duration_minutes;

    // Get staff work hours
    const staffResult = await query('SELECT * FROM staff WHERE id = $1', [staffId]);
    if (staffResult.rows.length === 0) {
      return res.status(404).json({ error: 'Staff member not found' });
    }

    const staff = staffResult.rows[0];

    // Get existing appointments for this staff on this date
    const appointmentsResult = await query(
      `SELECT appointment_time FROM appointments 
       WHERE staff_id = $1 AND appointment_date = $2 AND status != 'cancelled'`,
      [staffId, date]
    );

    const bookedTimes = appointmentsResult.rows.map((row: any) =>
      String(row.appointment_time).substring(0, 5)
    );

    // Generate available time slots
    const startHour = new Date(`2000-01-01 ${staff.work_start_time}`).getHours();
    const endHour = new Date(`2000-01-01 ${staff.work_end_time}`).getHours();
    const slots = [];

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
        if (!bookedTimes.includes(time)) {
          slots.push(time);
        }
      }
    }

    res.json({ availableSlots: slots });
  } catch (error) {
    console.error('Error fetching availability:', error);
    res.status(500).json({ error: 'Failed to fetch availability' });
  }
};

export const createBooking = async (req: Request, res: Response) => {
  try {
    const {
      serviceId,
      staffId,
      appointmentDate,
      appointmentTime,
      customerName,
      customerEmail,
      customerPhone,
      notes,
    } = req.body;

    if (!serviceId || !staffId || !appointmentDate || !appointmentTime) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Get service duration
    const serviceResult = await query('SELECT duration_minutes FROM services WHERE id = $1', [
      serviceId,
    ]);

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    const durationMinutes = serviceResult.rows[0].duration_minutes;

    // Check if slot is available
    const conflictResult = await query(
      `SELECT id FROM appointments 
       WHERE staff_id = $1 AND appointment_date = $2 AND appointment_time = $3`,
      [staffId, appointmentDate, appointmentTime]
    );

    if (conflictResult.rows.length > 0) {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }

    const result = await query(
      `INSERT INTO appointments (service_id, staff_id, user_id, customer_name, customer_email, customer_phone, appointment_date, appointment_time, duration_minutes, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
       RETURNING *`,
      [
        serviceId,
        staffId,
        req.user?.userId || null,
        customerName,
        customerEmail,
        customerPhone,
        appointmentDate,
        appointmentTime,
        durationMinutes,
        notes,
      ]
    );

    res.status(201).json(result.rows[0]);
  } catch (error: any) {
    if (error?.code === '23505') {
      return res.status(409).json({ error: 'This time slot is already booked' });
    }
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Failed to create booking' });
  }
};

export const updateBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    const result = await query(
      `UPDATE appointments 
       SET status = COALESCE($1, status),
           notes = COALESCE($2, notes),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $3
       RETURNING *`,
      [status, notes, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Failed to update booking' });
  }
};

export const deleteBooking = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      `UPDATE appointments 
       SET status = 'cancelled'
       WHERE id = $1
       RETURNING *`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Failed to cancel booking' });
  }
};
