import { Router } from 'express';
import { register, login, getProfile, updateProfilePhoto } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile/:id', getProfile);
router.put('/profile/:id/photo', updateProfilePhoto);

export default router;
