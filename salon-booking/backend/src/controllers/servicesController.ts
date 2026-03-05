import { Request, Response } from 'express';
import { query } from '../database/db';

export const getAllServices = async (req: Request, res: Response) => {
  try {
    const result = await query('SELECT * FROM services WHERE is_active = true');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching services:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};

export const getServiceById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await query('SELECT * FROM services WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching service:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
};

export const createService = async (req: Request, res: Response) => {
  try {
    const { nameEt, nameEn, descriptionEt, descriptionEn, durationMinutes, price } =
      req.body;

    if (!nameEt || !nameEn || !durationMinutes || !price) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const result = await query(
      `INSERT INTO services (name_et, name_en, description_et, description_en, duration_minutes, price)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING *`,
      [nameEt, nameEn, descriptionEt, descriptionEn, durationMinutes, price]
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
};

export const updateService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nameEt, nameEn, descriptionEt, descriptionEn, durationMinutes, price, isActive } =
      req.body;

    const result = await query(
      `UPDATE services 
       SET name_et = COALESCE($1, name_et),
           name_en = COALESCE($2, name_en),
           description_et = COALESCE($3, description_et),
           description_en = COALESCE($4, description_en),
           duration_minutes = COALESCE($5, duration_minutes),
           price = COALESCE($6, price),
           is_active = COALESCE($7, is_active),
           updated_at = CURRENT_TIMESTAMP
       WHERE id = $8
       RETURNING *`,
      [nameEt, nameEn, descriptionEt, descriptionEn, durationMinutes, price, isActive, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ error: 'Failed to update service' });
  }
};

export const deleteService = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const result = await query(
      'UPDATE services SET is_active = false WHERE id = $1 RETURNING *',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
};
