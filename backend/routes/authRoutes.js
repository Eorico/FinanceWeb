// backend/routes/authRoutes.js
import express from 'express';
const router = express.Router();
import { registerUser, loginUser, forgotPassword } from '../controllers/authController.js';

router.use((req, res, next) => {
  console.log(`Auth route hit: ${req.method} ${req.url}`);
  next();
});

router.post('/signup', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);

export default router;