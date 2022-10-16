const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },

    sku: String,

    description: String,

    price: {
        type: Number,
        required: [true, "Price is required!"]
    },

    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "asset"
    },

    assets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "asset"
    }],

    releted_products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }],

    variant_groups: []
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;