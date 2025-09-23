
const mongoose = require('mongoose');

const betSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    slotId: { type: mongoose.Schema.Types.ObjectId, ref: 'Slot', required: true },
    number: { type: Number, required: true },
    amount: { type: Number, required: true },
    status: { type: String, default: 'pending' }, // e.g., 'pending', 'win', 'loss'
    winningNumber: { type: Number },
    winningAmount: { type: Number }
}, { timestamps: true });

module.exports = mongoose.model('Bet', betSchema);
