
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all user routes
router.use(authMiddleware);

// Get user profile
router.get('/profile', userController.getProfile);

// Add balance to user account
router.post('/recharge/add', userController.rechargeBalance);

// Get user's recharge history
router.get('/recharge/list', userController.getRechargeHistory);

module.exports = router;
