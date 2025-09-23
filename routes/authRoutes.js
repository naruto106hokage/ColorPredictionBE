
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Send OTP for login
router.post('/login/otp', authController.sendLoginOtp);

// Verify OTP for login
router.put('/verify/otp', authController.verifyLoginOtp);

// Register User (Endpoint name from doc is /send/otp)
router.post('/send/otp', authController.registerUser);

const authMiddleware = require('../middleware/authMiddleware');

// Logout User
router.put('/logout', authMiddleware, authController.logoutUser);

module.exports = router;
