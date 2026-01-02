import { Router } from 'express';
import { chat, getStats } from '../controllers/chatbot.controller';

const router = Router();

router.post('/chat', chat);
router.get('/stats', getStats);

export default router;
