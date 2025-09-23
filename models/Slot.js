
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
    slotNumber: { type: String, required: true },
    slotName: { type: String, required: true },
    startDate: { type: Number, required: true },
    startTime: { type: Number, required: true },
    endTime: { type: Number, required: true },
    status: { type: String, default: 'active' }, // e.g., 'active', 'completed'
    winningNumber: { type: Number },
    bets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Bet' }]
}, { timestamps: true });

module.exports = mongoose.model('Slot', slotSchema);
