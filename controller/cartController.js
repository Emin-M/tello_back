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