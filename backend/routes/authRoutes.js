// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.use((req, res, next) => {
  console.log(`Auth route hit: ${req.method} ${req.url}`);
  next();
});

router.post('/signup', authController.registerUser);
router.post('/login', authController.loginUser);
router.post('/forgot-password', authController.forgotPassword);

module.exports = router;