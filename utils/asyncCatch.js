const asyncCatch = (callback) => {
    return (req, res, next) => {
        callback(req, res, next).catch((err) => next());
    };
};

module.exports = {
    asyncCatch
};