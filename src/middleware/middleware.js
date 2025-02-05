import jwt from 'jsonwebtoken';
import {NO_TOKEN,INVALID_TOKEN } from '../message/messages.js';
import { errorResponse } from '../response/response.js';

// Create token middleware
const createTokenMiddleware = (payload) => {
    
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    return jwt.sign(payload, jwtSecretKey, { expiresIn: "48h" });
};

// Verify token middleware
const verifyTokenMiddleware = (req, res, next) => {
    // console.log(req.headers,89989)
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    const token = req.header('authorization')?.split(' ')[1]; // Parse Bearer token

    if (!token) {
        return errorResponse(res, "", 403, NO_TOKEN)
    }

    try {
        const verified = jwt.verify(token, jwtSecretKey);
        req.user = verified; // Attach verified data to the request object
        next(); // Pass control to the next middleware/handler
    } catch (error) {
        return errorResponse(res, "", 401, INVALID_TOKEN)
    }
};

export { createTokenMiddleware, verifyTokenMiddleware };
