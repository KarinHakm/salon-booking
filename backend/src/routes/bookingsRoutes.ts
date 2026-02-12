import { Router } from 'express';
import {
  getAllBookings,
  getBookingById,
  createBooking,
  updateBooking,
  deleteBooking,
  getAvailability,
} from '../controllers/bookingsController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/availability', getAvailability);
router.get('/', authenticateToken, getAllBookings);
router.get('/:id', authenticateToken, getBookingById);
router.post('/', createBooking);
router.patch('/:id', authenticateToken, updateBooking);
router.delete('/:id', authenticateToken, deleteBooking);

export default router;
