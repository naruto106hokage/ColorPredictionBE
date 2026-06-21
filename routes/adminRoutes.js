const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const adminMiddleware = require('../middleware/adminMiddleware');

router.use(adminMiddleware);
router.get('/dashboard', adminController.getDashboardData);
router.post('/bet', adminController.placeBet);
router.post('/slot/close', adminController.closeSlot);
router.post('/slot/new', adminController.createNewSlot);
router.post('/slot/process', adminController.processSlot);
router.post('/user/:userId/ban', adminController.banUser);
router.post('/user/:userId/unban', adminController.unbanUser);

module.exports = router;
