const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");

const specialAccess = asyncCatch(async (req, res, next) => {
    if (!JSON.parse(process.env.SPECIAL_ACCESS_IDS).includes(req.user._id.toString())) return next(new GlobalError("You have not permission!"));
    next();
});

module.exports = specialAccess;