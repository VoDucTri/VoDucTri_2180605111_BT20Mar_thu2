// utils/ResHandler.js
class ResHandler {
    static CreateSuccessRes(res, statusCode, data, message = 'Success') {
        return res.status(statusCode).json({
            success: true,
            message,
            data
        });
    }

    static CreateErrorRes(res, statusCode, err) {
        return res.status(statusCode).json({
            success: false,
            status: statusCode,
            message: err.message || 'An unexpected error occurred',
            stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
        });
    }
}

module.exports = ResHandler;