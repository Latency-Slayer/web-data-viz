const AppError = require("./AppError");

module.exports = (error, req, res, next) => {
    if(error instanceof AppError) {
        return res.status(400).json({error: error.message, statusCode: error.statusCode, message: error.otherMessage });
    }

    console.log(error);

    return res.status(500).json({error: "Internal server error", statusCode: 500});
};