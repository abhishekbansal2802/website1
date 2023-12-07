const errorHandler = (res, status = 501, message = "internal server error") => {
    return res.status(status).json({
        success: false,
        message: message,
    })
}

module.exports = errorHandler;