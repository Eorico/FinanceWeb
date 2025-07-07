import express from 'express';
import { getCurrentUser, updateUser, updateBudgets, updateTransactions } from '../controllers/userController.js';
import protect from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/user/me')
    .get(protect, getCurrentUser)
    .put(protect, updateUser);

router.route('/user/me/budgets')
    .put(protect, updateBudgets);

router.route('/user/me/transactions')
    .put(protect, updateTransactions)

export default router;