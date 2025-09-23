
const User = require('../models/User');
const Recharge = require('../models/Recharge');

exports.getProfile = async (req, res) => {
    try {
        // req.user is populated by the auth middleware
        const user = req.user;
        res.json({
            meta: { status: true, msg: 'Profile retrieved' },
            data: {
                topUpBalance: user.topUpBalance,
                userId: user._id,
                name: user.name,
                email: user.email,
                mobile: user.mobile,
                status: user.status
            }
        });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.rechargeBalance = async (req, res) => {
    const { amount, transactionId } = req.body;
    const userId = req.user.id;

    try {
        // Create a new recharge record
        const recharge = new Recharge({ userId, amount, transactionId, status: 'success' }); // Assuming success for now
        await recharge.save();

        // Update user's balance
        await User.findByIdAndUpdate(userId, { $inc: { topUpBalance: amount } });

        res.json({ meta: { status: true, msg: 'Recharge successful' } });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.getRechargeHistory = async (req, res) => {
    const userId = req.user.id;

    try {
        const history = await Recharge.find({ userId });
        res.json({ meta: { status: true, msg: 'Recharge history retrieved' }, data: history });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};
