const mongoose = require("mongoose");
const {
    MongooseFindByReference
} = require('mongoose-find-by-reference');

const productSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required!"]
    },

    sku: String,

    description: String,

    price: {
        raw: {
            type: Number,
            required: [true, "product price is required!"]
        },
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

    ratingsAverage: {
        type: Number,
    },

    ratingsQuantity: {
        type: Number,
    },

    variant_groups: [{
        name: {
            type: String,
            required: [true, "variant_group name is required!"]
        },

        id: String,

        options: [{
            name: {
                type: String,
                required: [true, "variant_group_option name is required!"]
            },

            id: String,

            price: {
                raw: Number,
                formatted: String,
                formatted_with_symbol: String,
                formatted_with_code: String,
            }
        }]
    }]
});

productSchema.plugin(MongooseFindByReference);

productSchema.pre("save", function (next) {
    //! converting product price to the formatted values
    this.price = {
        raw: this.price.raw,
        formatted: this.price.raw,
        formatted_with_symbol: "₼ " + this.price.raw,
        formatted_with_code: this.price.raw + " AZN",
    };

    next();
});

productSchema.pre(/find/, function (next) {
    this.populate("image").populate("assets").populate({
        path: "related_products",
        select: "-related_products -categories -assets -variant_groups"
    }).populate("categories");
    next();
});

const Product = mongoose.model("product", productSchema);
module.exports = Product;