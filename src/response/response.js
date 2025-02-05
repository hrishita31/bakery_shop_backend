const successResponse = (res, resultReceived, statusCodeReceived) => {
    return res.status(statusCodeReceived).send({
        success:true,
        result:resultReceived,
        statusCode:statusCodeReceived,
    })
}

const errorResponse = (res, resultReceived, statusCodeReceived, messageReceived) => {
    return res.status(statusCodeReceived).send({
        success:false, 
        result:resultReceived,
        statusCode:statusCodeReceived,
        message : messageReceived
    })

}

export {successResponse, errorResponse};