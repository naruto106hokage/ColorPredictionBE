
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    mobile: { type: String, required: true, unique: true },
    countryCode: { type: String, required: true },
    parentReferralCode: { type: String },
    otp: { type: String },
    otpExpires: { type: Date },
    token: { type: String },
    topUpBalance: { type: Number, default: 0 },
    winningWallet: { type: Number, default: 0 },
    status: { type: String, default: 'active' }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
