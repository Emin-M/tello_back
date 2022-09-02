const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Price is required!"]
    },
    price: {
        type: Number,
        required: [true, "Price is required!"]
    }
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;