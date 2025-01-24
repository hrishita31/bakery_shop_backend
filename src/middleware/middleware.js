import jwt from 'jsonwebtoken';
import {NO_TOKEN,INVALID_TOKEN } from '../message/messages.js';

// Create token middleware
const createTokenMiddleware = (payload) => {
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    return jwt.sign(payload, jwtSecretKey, { expiresIn: "48h" });
};

// Verify token middleware
const verifyTokenMiddleware = (req, res, next) => {
    
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.header('Authorization')?.split(' ')[1]; // Parse Bearer token

    if (!token) {
        return res.status(403).json({ success: false, message: NO_TOKEN });
    }

    try {
        const verified = jwt.verify(token, jwtSecretKey);
        req.user = verified; // Attach verified data to the request object
        next(); // Pass control to the next middleware/handler
    } catch (error) {
        return res.status(401).json({ success: false, message: INVALID_TOKEN });
    }
};

export { createTokenMiddleware, verifyTokenMiddleware };
