const Slot = require('../models/Slot');
const Bet = require('../models/Bet');
const User = require('../models/User');
const { processGame } = require('../game-engine');

exports.getDashboardData = async (req, res) => {
    try {
        const activeSlot = await Slot.findOne({ status: 'active' }).sort({ createdAt: -1 }).populate('bets');
        const recentSlots = await Slot.find().sort({ createdAt: -1 }).limit(10).populate('bets');
        const totalUsers = await User.countDocuments();
        const totalBets = await Bet.countDocuments();
        const totalBetAmount = await Bet.aggregate([
            { $group: { _id: null, total: { $sum: '$amount' } } }
        ]);
        const totalTopUpBalance = await User.aggregate([
            { $group: { _id: null, total: { $sum: '$topUpBalance' } } }
        ]);
        const totalWinningWallet = await User.aggregate([
            { $group: { _id: null, total: { $sum: '$winningWallet' } } }
        ]);
        const betStatusCounts = await Bet.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);
        const users = await User.find().select('name email mobile isBanned isAdmin topUpBalance winningWallet status');

        res.json({
            meta: { status: true, msg: 'Dashboard data retrieved' },
            data: {
                activeSlot,
                recentSlots,
                totalUsers,
                totalBets,
                totalBetAmount: totalBetAmount[0]?.total || 0,
                totalTopUpBalance: totalTopUpBalance[0]?.total || 0,
                totalWinningWallet: totalWinningWallet[0]?.total || 0,
                betStatusCounts: betStatusCounts.reduce((acc, item) => {
                    acc[item._id] = item.count;
                    return acc;
                }, {}),
                users
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.placeBet = async (req, res) => {
    const { slotId, userId, number, amount } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ meta: { status: false, msg: 'User not found' } });
        }
        if (user.isBanned) {
            return res.status(403).json({ meta: { status: false, msg: 'User is banned' } });
        }
        if (user.topUpBalance < amount) {
            return res.status(400).json({ meta: { status: false, msg: 'Insufficient balance' } });
        }
        const slot = await Slot.findById(slotId);
        if (!slot || slot.status !== 'active') {
            return res.status(400).json({ meta: { status: false, msg: 'Slot not active or does not exist' } });
        }

        const bet = new Bet({ userId, slotId, number, amount });
        await bet.save();

        user.topUpBalance -= amount;
        await user.save();

        slot.bets.push(bet._id);
        await slot.save();

        res.json({ meta: { status: true, msg: 'Admin bet placed successfully' }, data: bet });
    } catch (error) {
        console.error(error);
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.closeSlot = async (req, res) => {
    try {
        const activeSlot = await Slot.findOne({ status: 'active' }).sort({ createdAt: -1 });
        if (!activeSlot) {
            return res.status(404).json({ meta: { status: false, msg: 'No active slot found' } });
        }
        activeSlot.status = 'completed';
        await activeSlot.save();
        res.json({ meta: { status: true, msg: 'Active slot closed' }, data: activeSlot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.createNewSlot = async (req, res) => {
    try {
        const slotCount = await Slot.countDocuments();
        const now = Date.now();
        const slotNumber = (slotCount + 1).toString();
        const newSlot = new Slot({
            slotNumber,
            slotName: `Game #${slotNumber}`,
            startDate: now,
            startTime: now,
            endTime: now + 60000,
            status: 'active'
        });
        await newSlot.save();
        res.json({ meta: { status: true, msg: 'New slot created' }, data: newSlot });
    } catch (error) {
        console.error(error);
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.processSlot = async (req, res) => {
    try {
        await processGame();
        res.json({ meta: { status: true, msg: 'Game processed manually' } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.banUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ meta: { status: false, msg: 'User not found' } });
        }
        user.isBanned = true;
        await user.save();
        res.json({ meta: { status: true, msg: 'User banned' }, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.unbanUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ meta: { status: false, msg: 'User not found' } });
        }
        user.isBanned = false;
        await user.save();
        res.json({ meta: { status: true, msg: 'User unbanned' }, data: user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};
