import express from 'express';
import { upsertProfile, getProfile } from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireFounder } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireFounder);

router.post('/', upsertProfile);
router.get('/', getProfile);

export default router;
