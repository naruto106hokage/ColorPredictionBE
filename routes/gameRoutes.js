
const express = require('express');
const router = express.Router();
const gameController = require('../controllers/gameController');
const authMiddleware = require('../middleware/authMiddleware');

// Apply auth middleware to all game routes
router.use(authMiddleware);

// Get list of available game slots
router.get('/slot/list', gameController.getSlotList);

// Get the current active game slot
router.get('/slot/current', gameController.getCurrentSlot);

// Place a bet on a slot
router.post('/bet', gameController.placeBet);

// Get list of bets with optional filters
router.get('/bet/list', gameController.getBetList);

module.exports = router;
