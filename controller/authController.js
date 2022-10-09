const User = require("../model/user");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");

//! Creating User
exports.signup = asyncCatch(async (req, res, next) => {
    const user = await User.create({
        email: req.body.email,
        phone: req.body.phone,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        external_id: req.body.external_id,
    });

    res.status(200).json({
        data: user,
        meta: {}
    });
});