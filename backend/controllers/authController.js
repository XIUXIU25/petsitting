const crypto = require('crypto');
const { promisify } = require('util');
const User = require('../models/userModel');
const { signToken } = require('../middleware/requireAuth');

const scrypt = promisify(crypto.scrypt);
const hashPassword = async (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const derivedKey = await scrypt(password, salt, 64);
    return `${salt}:${derivedKey.toString('hex')}`;
};
const checkPassword = async (password, storedHash) => {
    const [salt, hash] = storedHash.split(':');
    const expected = Buffer.from(hash, 'hex');
    const actual = await scrypt(password, salt, expected.length);
    return crypto.timingSafeEqual(actual, expected);
};
const authResponse = (user) => ({
    token: signToken(user._id.toString()),
    user: { id: user._id, name: user.name, email: user.email },
});

const register = async (req, res) => {
    const name = typeof req.body.name === 'string' ? req.body.name.trim() : '';
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    if (!name || name.length > 80) return res.status(400).json({ error: 'Enter your name (up to 80 characters).' });
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) return res.status(400).json({ error: 'Enter a valid email address.' });
    if (password.length < 8 || password.length > 128) return res.status(400).json({ error: 'Password must be 8 to 128 characters.' });
    try {
        const user = await User.create({ name, email, passwordHash: await hashPassword(password) });
        return res.status(201).json(authResponse(user));
    } catch (error) {
        if (error.code === 11000) return res.status(409).json({ error: 'An account with this email already exists.' });
        return res.status(500).json({ error: 'Could not create your account.' });
    }
};

const login = async (req, res) => {
    const email = typeof req.body.email === 'string' ? req.body.email.trim().toLowerCase() : '';
    const password = typeof req.body.password === 'string' ? req.body.password : '';
    try {
        const user = await User.findOne({ email }).select('+passwordHash');
        if (!user || !(await checkPassword(password, user.passwordHash))) {
            return res.status(401).json({ error: 'Email or password is incorrect.' });
        }
        return res.status(200).json(authResponse(user));
    } catch (error) {
        return res.status(500).json({ error: 'Could not log you in. Please try again.' });
    }
};

module.exports = { register, login };
