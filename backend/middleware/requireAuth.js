const crypto = require('crypto');
const User = require('../models/userModel');

const tokenSecret = process.env.JWT_SECRET;

const signToken = (userId) => {
    if (!tokenSecret) throw new Error('JWT_SECRET is not configured.');
    const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
    const payload = Buffer.from(JSON.stringify({ sub: userId, exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7 })).toString('base64url');
    const signature = crypto.createHmac('sha256', tokenSecret).update(`${header}.${payload}`).digest('base64url');
    return `${header}.${payload}.${signature}`;
};

const verifyToken = (token) => {
    const parts = token.split('.');
    if (parts.length !== 3 || !tokenSecret) return null;
    const expected = crypto.createHmac('sha256', tokenSecret).update(`${parts[0]}.${parts[1]}`).digest();
    let supplied;
    try { supplied = Buffer.from(parts[2], 'base64url'); } catch { return null; }
    if (supplied.length !== expected.length || !crypto.timingSafeEqual(supplied, expected)) return null;
    try {
        const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
        if (!payload.sub || payload.exp <= Math.floor(Date.now() / 1000)) return null;
        return payload;
    } catch { return null; }
};

const requireAuth = async (req, res, next) => {
    const authorization = req.get('Authorization') || '';
    const token = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const payload = token && verifyToken(token);
    if (!payload) return res.status(401).json({ error: 'Please log in to continue.' });
    try {
        req.user = await User.findById(payload.sub);
        if (!req.user) return res.status(401).json({ error: 'This account no longer exists.' });
        next();
    } catch (error) { next(error); }
};

module.exports = { requireAuth, signToken };
