import express from 'express';
import { getCurrentUser, updateUser } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/:');

router.route('/user/me')
    .get(protect, getCurrentUser)
    .put(protect, updateUser);

export default router;