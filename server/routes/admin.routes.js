import express from 'express';
import { createScheme, getSchemes, updateScheme, deleteScheme, getUsers, getAnalytics } from '../controllers/admin.controller.js';
import { requireAuth } from '../middleware/authMiddleware.js';
import { requireAdmin } from '../middleware/roleMiddleware.js';

const router = express.Router();

router.use(requireAuth, requireAdmin);

router.post('/schemes', createScheme);
router.get('/schemes', getSchemes);
router.put('/schemes/:id', updateScheme);
router.delete('/schemes/:id', deleteScheme); // Soft delete

router.get('/users', getUsers);
router.get('/analytics', getAnalytics);

export default router;
