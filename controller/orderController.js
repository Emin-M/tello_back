const Order = require("../model/order");
const {
    asyncCatch
} = require("../utils/asyncCatch");

//! Getting Orders
exports.getOrders = asyncCatch(async (req, res, next) => {
    const orders = await Order.find({
        userId: req.user._id
    });

    res.status(200).json({
        orders
    });
});