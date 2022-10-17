const User = require("../model/user");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");


//! Get User
exports.getUser = asyncCatch(async (req, res, next) => {
    const user = await User.findById(req.user._id);

    if (!user) return next(new GlobalError("User not found!", 404));

    res.status(200).json(user);
});

//! Update User Data
exports.updateUser = asyncCatch(async (req, res, next) => {
    const user = await User.findByIdAndUpdate(req.user._id, {
        email: req.body.email,
        phone: req.body.phone,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    }, {
        new: true
    });

    if (!user) return next(new GlobalError("User not found!", 404));

    await user.save();

    res.json(user);
});

//! Deleting User
exports.deleteUser = asyncCatch(async (req, res, next) => {
    const deletedUser = await User.findByIdAndDelete(req.user._id);

    if (!deletedUser) return next(new GlobalError("User not found!", 404));

    res.status(200).json({
        success: true,
        message: "document deleted"
    });
});