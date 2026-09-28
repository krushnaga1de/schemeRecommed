import express from 'express';
import { generateRecommendations, getHistory } from '../controllers/recommend.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireFounder } from '../middleware/roleMiddleware.js';

const router = express.Router();

// Both routes require the user to be logged in and be a 'founder'
router.use(requireAuth, requireFounder);

router.post('/', generateRecommendations);
router.get('/history', getHistory);

export default router;
