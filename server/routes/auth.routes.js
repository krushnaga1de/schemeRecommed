import express from 'express';
import { register, login, refresh, logout, getMe } from '../controllers/auth.controller.js';

import { requireAuth } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', requireAuth, logout);
router.get('/me', requireAuth, getMe);

export default router;
