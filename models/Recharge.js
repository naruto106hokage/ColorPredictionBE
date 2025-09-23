
const mongoose = require('mongoose');

const rechargeSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    transactionId: { type: String, required: true },
    status: { type: String, default: 'pending' } // e.g., 'pending', 'success', 'failed'
}, { timestamps: true });

module.exports = mongoose.model('Recharge', rechargeSchema);
