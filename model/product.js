const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },

    sku: String,

    description: String,

    price: {
        raw: Number,
        formatted: String,
        formatted_with_symbol: String,
        formatted_with_code: String,
    },

    image: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "asset"
    },

    assets: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "asset"
    }],

    related_products: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    }],

    categories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }],

    variant_groups: []
});

productSchema.pre("save", function (next) {
    console.log(this.price);
    this.price = {
        raw: this.price.raw,
        formatted: this.price.raw,
        formatted_with_symbol: this.price.raw,
        formatted_with_code: this.price.raw + " AZN",
    }
    next();
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;