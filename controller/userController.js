const User = require("../model/user");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");


//! Get User
exports.getUser = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const user = await User.findById(id);

    if (!user) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json({
        success: true,
        user
    })
});

//! Update User Data
exports.updateUser = asyncCatch(async (req, res, next) => {
    const id = req.params.id
    const user = await User.findByIdAndUpdate(id, {
        email: req.body.email,
        phone: req.body.phone,
        firstname: req.body.firstname,
        lastname: req.body.lastname,
    }, {
        new: true
    });

    if (!user) return next(new GlobalError("Invalid ID", 404));

    await user.save();

    res.json({
        data: user,
        meta: {}
    });
});

//! Deleting User
exports.deleteUser = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json({
        success: true,
        message: "document deleted"
    });
});