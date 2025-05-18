class AppError extends Error {
    constructor(message, statusCode, otherMessage) {
        super(message);
        this.otherMessage = otherMessage;
        this.statusCode = statusCode || 400;
    }
}

module.exports = AppError;