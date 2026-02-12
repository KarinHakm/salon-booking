import { Router } from 'express';
import {
  getAllStaff,
  getStaffById,
  createStaff,
  updateStaff,
  deleteStaff,
} from '../controllers/staffController';
import { authenticateToken, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', getAllStaff);
router.get('/:id', getStaffById);
router.post('/', authenticateToken, requireAdmin, createStaff);
router.patch('/:id', authenticateToken, requireAdmin, updateStaff);
router.delete('/:id', authenticateToken, requireAdmin, deleteStaff);

export default router;
