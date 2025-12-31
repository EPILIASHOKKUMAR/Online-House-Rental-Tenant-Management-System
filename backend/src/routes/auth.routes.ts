import { Router } from 'express';
import { register, login, getProfile, updateProfile, updateProfilePhoto, googleLogin, forgotPassword, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/profile/:id', getProfile);
router.put('/profile/:id', updateProfile);
router.put('/profile/:id/photo', updateProfilePhoto);

export default router;
