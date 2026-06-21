
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate OTP
const generateOtp = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

exports.sendLoginOtp = async (req, res) => {
    const { countryCode, mobile } = req.body;
    try {
        const user = await User.findOne({ countryCode, mobile });
        if (!user) {
            return res.status(404).json({ meta: { status: false, msg: 'User not found' } });
        }
        if (user.isBanned) {
            return res.status(403).json({ meta: { status: false, msg: 'This account is banned' } });
        }

        const otp = generateOtp();
        user.otp = otp;
        user.otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
        await user.save();

        // In a real app, you would send the OTP via SMS
        console.log(`OTP for ${mobile}: ${otp}`);

        res.json({ meta: { status: true, msg: 'OTP sent successfully' } });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.verifyLoginOtp = async (req, res) => {
    const { countryCode, mobile, otp } = req.body;
    try {
        const user = await User.findOne({
            countryCode,
            mobile,
            otp,
            otpExpires: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ meta: { status: false, msg: 'Invalid or expired OTP' } });
        }
        if (user.isBanned) {
            return res.status(403).json({ meta: { status: false, msg: 'This account is banned' } });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
        user.token = token;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.json({ meta: { status: true, msg: 'Login successful' }, token });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.registerUser = async (req, res) => {
    const { name, email, mobile, countryCode, parentReferralCode } = req.body;
    try {
        let user = await User.findOne({ $or: [{ email }, { mobile }] });
        if (user) {
            return res.status(400).json({ meta: { status: false, msg: 'User already exists with this email or mobile' } });
        }

        const otp = generateOtp();
        user = new User({
            name,
            email,
            mobile,
            countryCode,
            parentReferralCode,
            otp,
            otpExpires: Date.now() + 10 * 60 * 1000 // 10 minutes
        });
        await user.save();

        // Log the OTP to the console for development
        console.log(`OTP for new user registration ${mobile}: ${otp}`);

        res.status(201).json({ meta: { status: true, msg: 'User registered successfully. Please verify OTP.' } });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};

exports.logoutUser = async (req, res) => {
    // The auth middleware will add the user to the request
    try {
        const user = await User.findById(req.user.id);
        if (user) {
            user.token = undefined;
            await user.save();
        }
        res.json({ meta: { status: true, msg: 'Logout successful' } });
    } catch (error) {
        res.status(500).json({ meta: { status: false, msg: 'Server error' } });
    }
};
