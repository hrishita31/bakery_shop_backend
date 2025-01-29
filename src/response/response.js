import { json } from "express";

const successResponse = (res, resultReceived, statusCodeReceived) => {
    return res.status(statusCodeReceived).json({
        success:true,
        result:resultReceived,
        statusCode:statusCodeReceived
    })
}

const errorResponse = (res, resultReceived, statusCodeReceived, messageReceived) => {
    return res.status(statusCodeReceived).json({
        success:false, 
        result:resultReceived,
        statusCode:statusCodeReceived,
        message : messageReceived
    })

}

export {successResponse, errorResponse};