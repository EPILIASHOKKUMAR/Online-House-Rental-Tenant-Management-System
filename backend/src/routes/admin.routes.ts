import { Router } from 'express';
import {
  getAllUsers,
  getDashboardStats,
  deleteUser,
  getAllBookings,
  getAllPropertiesAdmin
} from '../controllers/admin.controller';

const router = Router();

router.get('/users', getAllUsers);
router.get('/stats', getDashboardStats);
router.get('/bookings', getAllBookings);
router.get('/properties', getAllPropertiesAdmin);
router.delete('/users/:id', deleteUser);

export default router;
