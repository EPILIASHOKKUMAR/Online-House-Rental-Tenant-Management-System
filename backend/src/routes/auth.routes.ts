import { Router } from 'express';
import { register, login, googleLogin, getProfile, updateProfilePhoto, forgotPassword, verifyOTP, resetPassword } from '../controllers/auth.controller';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/google-login', googleLogin);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyOTP);
router.post('/reset-password', resetPassword);
router.get('/profile/:id', getProfile);
router.put('/profile/:id/photo', updateProfilePhoto);

export default router;
