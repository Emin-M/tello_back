const User = require("../model/user");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const sendEmail = require("../utils/email");

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

//! Email Token
exports.emailToken = asyncCatch(async (req, res, next) => {
    //! checking if email and base_url exist in the request
    const {
        email,
        base_url
    } = req.body;

    if (!email || !base_url) return next(new GlobalError("Please provide email and base_url", 404));

    //! checking if the user with this email
    const user = await User.findOne({
        email: email
    });

    if (!user) return next(new GlobalError("The User with this email doesn't exist", 404));

    //! creating emailToken and adding to the user data
    const emailToken = await user.hashEmailToken();
    await user.save({
        validateBeforeSave: false
    });

    const urlString = `${base_url}/${emailToken}`;

    //! sending email
    await sendEmail({
        email: email,
        subject: "Log in to your account",
        message: `Please follow the link: ${urlString}`,
    });

    res.status(200).json({
        success: true,
        email: email
    });
});