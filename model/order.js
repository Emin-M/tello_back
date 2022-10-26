const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    customerId: String,

    paymentIntentId: String,

    products: [{
        name: String,

        description: String,

        image: String,

        price: {
            raw: Number,
            formatted: String,
            formatted_with_symbol: String,
            formatted_with_code: String,
        },
        quantity: Number,
    }, ],

    subtotal: {
        type: Number,
        required: true
    },

    total: {
        type: Number,
        required: true
    },

    shipping: {
        type: Object,
        required: true
    },

    delivery_status: {
        type: String,
        default: "pending"
    },

    payment_status: {
        type: String,
        required: true
    },
}, {
    timestamps: true
});

const Order = mongoose.model("order", orderSchema);
module.exports = Order;