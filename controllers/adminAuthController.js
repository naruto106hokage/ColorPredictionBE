const jwt = require('jsonwebtoken');

exports.login = async (req, res) => {
    const { username, password } = req.body;
    if (username === 'admin' && password === 'admin') {
        const token = jwt.sign({ admin: true }, process.env.JWT_SECRET, { expiresIn: '7d' });
        return res.json({ meta: { status: true, msg: 'Admin login successful' }, token });
    }
    res.status(401).json({ meta: { status: false, msg: 'Invalid admin credentials' } });
};
