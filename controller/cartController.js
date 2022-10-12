const Cart = require("../model/cart");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");


//! Create Cart
exports.createCart = asyncCatch(async (req, res, next) => {
    const cart = await Cart.create({
        line_items: [],
        subtotal: {
            raw: 0,
            formatted: "0.00",
            formatted_with_symbol: "0.00",
            formatted_with_code: "0.00 AZN",
        },
        total_items: 0,
        total_unique_items: 0,
    });

    res.status(200).json(cart);
});

//! Get Cart
exports.getCart = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const cart = await Cart.findById(id);

    if (!cart) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json(cart);
});

//! Delete Cart
exports.deleteCart = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const deletedCart = await Cart.findByIdAndDelete(id);

    if (!deletedCart) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json({
        success: true,
        message: "document deleted"
    });
});

//! Empty Cart
exports.emptyCart = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const cart = await Cart.findByIdAndUpdate(id, {
        line_items: []
    }, {
        new: true
    });

    if (!cart) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json(cart);
});