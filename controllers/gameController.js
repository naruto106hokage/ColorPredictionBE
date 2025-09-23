const Slot = require('../models/Slot');
const Bet = require('../models/Bet');
const User = require('../models/User');

exports.getSlotList = async (req, res) => {
    try {
        const slots = await Slot.find().populate('bets');
        res.json({ meta: { status: true, msg: 'Slot list retrieved' }, data: slots });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.placeBet = async (req, res) => {
    const { slotId, number, amount } = req.body;
    const userId = req.user.id;

    try {
        const user = await User.findById(userId);
        if (user.topUpBalance < amount) {
            return res.status(400).json({ meta: { status: false, msg: 'Insufficient balance' } });
        }

        const slot = await Slot.findById(slotId);
        if (!slot || slot.status !== 'active') {
            return res.status(400).json({ meta: { status: false, msg: 'Slot not active or does not exist' } });
        }

        // Create and save the bet
        const bet = new Bet({ userId, slotId, number, amount });
        await bet.save();

        // Update user balance
        user.topUpBalance -= amount;
        await user.save();

        // Add bet to slot
        slot.bets.push(bet._id);
        await slot.save();

        res.json({ meta: { status: true, msg: 'Bet placed successfully' } });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.getBetList = async (req, res) => {
    const userId = req.user.id;
    const { status, slotId } = req.query;

    let filter = { userId };
    if (status) {
        filter.status = status;
    }
    if (slotId) {
        filter.slotId = slotId;
    }

    try {
        const bets = await Bet.find(filter);
        res.json({ meta: { status: true, msg: 'Bet list retrieved' }, data: bets });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.getCurrentSlot = async (req, res) => {
    try {
        const currentSlot = await Slot.findOne({ status: 'active' }).sort({ createdAt: -1 });
        if (!currentSlot) {
            return res.status(404).json({ meta: { status: false, msg: 'No active slot found' } });
        }
        res.json({ meta: { status: true, msg: 'Current slot retrieved' }, data: currentSlot });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};