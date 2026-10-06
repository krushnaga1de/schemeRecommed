import express from 'express';
import { upsertProfile, getProfile, toggleSavedScheme, getSavedSchemes } from '../controllers/profile.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireFounder } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireFounder);

router.post('/', upsertProfile);
router.get('/', getProfile);

// Saved Schemes
router.post('/saved-schemes/:schemeId', toggleSavedScheme);
router.get('/saved-schemes', getSavedSchemes);

export default router;

