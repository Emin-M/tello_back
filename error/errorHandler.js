const GlobalError = require("./GlobalError");

//! sending errors for production
const sendProductionError = (err, res, statusCode) => {
    if (err.operational) {
        res.status(statusCode).json({
            success: false,
            message: err.message
        });
    } else {
        res.status(500).json({
            success: false,
            message: "Something went wrong"
        });
    };
};

//! handling errors by their name
const handleValidationError = (err) => {
    const errors = Object.values(err.errors).map(err => err.message);
    const finalErr = errors.join(",");

    return new GlobalError(finalErr, 400);
};

const handleCastError = (err) => {
    return new GlobalError("Provide a valid Object ID!");
};

const handleMongoServerError = (err) => {
    if (err.code === 11000) {
        return new GlobalError(`The ${Object.keys(err.keyValue)} with value: '${Object.values(err.keyValue)}' already exist!`);
    };
};

const handleJWTError = (err) => {
    return new GlobalError("Token is not valid!", 403);
};

const handleJWTEXPIRE = (err) => {
    return new GlobalError("Token expired! Please log in again", 403);
};


module.exports = (err, req, res, next) => {
    statusCode = err.statusCode || 500;

    if (process.env.NODE_ENV.trim() === "development") {
        res.status(statusCode).json({
            success: false,
            message: err.message,
            err: err,
            status: statusCode,
            stack: err.stack
        });
    } else if (process.env.NODE_ENV.trim() === "production") {
        if (err.name === "ValidationError") err = handleValidationError(err);
        if (err.name === "CastError") err = handleCastError(err);
        if (err.name === "MongoServerError") err = handleMongoServerError(err);
        if (err.name === "JsonWebTokenError") err = handleJWTError(err);
        if (err.name === "TokenExpiredError") err = handleJWTEXPIRE(err);

        sendProductionError(err, res, statusCode);
    };
};