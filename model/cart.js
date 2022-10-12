const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    total_items: Number,

    total_unique_items: Number,

    subtotal: {
        raw: Number,
        formatted: String,
        formatted_with_symbol: String,
        formatted_with_code: String,
    },

    line_items: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product",
    }]
});

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;