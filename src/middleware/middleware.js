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
    console.log(req.headers,89989)
    const jwtSecretKey = process.env.JWT_SECRET_KEY;
    
    const token = req.header('authorization')?.split(' ')[1]; // Parse Bearer token
    console.log(token, 'token')

    if (!token) {
        return errorResponse(res, "", 403, NO_TOKEN)
    }

    console.log('token given')
    try {
        var appData = {};
        // const verified = jwt.verify(token, jwtSecretKey);
        if (token) {
            jwt.verify(token, jwtSecretKey, function(err) {
                if (err) {
                    // appData["error"] = 1;
                    appData["data"] = "Token is invalid";
                    return errorResponse(res, "", 500, appData)
                } else {
                    next();
                }
            });
        } else {
            // appData["error"] = 1;
            appData["data"] = "Please send a token";
            return errorResponse(res, "", 403, appData);

        }
        
    } catch (error) {
        return errorResponse(res, "", 401, INVALID_TOKEN)
    }
};

export { createTokenMiddleware, verifyTokenMiddleware };
