const User = require("../model/user");
const GlobalError = require("../error/GlobalError");
const jwt = require("jsonwebtoken");
const {
    promisify
} = require("util");
const {
    asyncCatch
} = require("../utils/asyncCatch");

const protectedAuth = asyncCatch(async (req, res, next) => {
    let token;

    //! check if token provided
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    };

    if (!token) return next(new GlobalError("Please Authenticate!", 400));

    //! check if token is valid
    const promiseVerify = promisify(jwt.verify);

    const decodedData = await promiseVerify(token, process.env.JWT_SECRET);

    //! checking if User with this token exist
    const user = await User.findById(decodedData.id);

    if (!user) return next(new GlobalError("The user with this token does not exist!"));

    //! sending user for next middleware
    req.user = user;

    next();
});

module.exports = protectedAuth;