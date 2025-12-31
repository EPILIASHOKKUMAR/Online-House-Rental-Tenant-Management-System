import { Router } from 'express';
import {
  createBooking,
  getTenantBookings,
  getOwnerBookings,
  updateBookingStatus,
  getBookingById,
  deleteBooking
} from '../controllers/booking.controller';

const router = Router();

router.post('/', createBooking);
router.get('/tenant/:tenantId', getTenantBookings);
router.get('/owner/:ownerId', getOwnerBookings);
router.get('/:id', getBookingById);
router.put('/:id/status', updateBookingStatus);
router.delete('/:id', deleteBooking);

export default router;
