const jwt = require('jsonwebtoken');
const User = require('../models/User');

module.exports = async (req, res, next) => {
    const token = req.header('authkey');

    if (!token) {
        return res.status(401).json({ meta: { status: false, msg: 'No token, authorization denied' } });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.admin) {
            req.user = { isAdmin: true, isBanned: false };
            return next();
        }
        const user = await User.findById(decoded.id).select('-password');
        if (!user || !user.isAdmin) {
            return res.status(403).json({ meta: { status: false, msg: 'Admin access required' } });
        }
        req.user = user;
        next();
    } catch (err) {
        res.status(401).json({ meta: { status: false, msg: 'Token is not valid' } });
    }
};
