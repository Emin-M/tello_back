const mongoose = require("mongoose");

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

productSchema.pre("save", function (next) {
    //! converting product price to the formatted values
    this.price = {
        raw: this.price.raw,
        formatted: this.price.raw,
        formatted_with_symbol: "₼ " + this.price.raw,
        formatted_with_code: this.price.raw + " AZN",
    };

    //! converting product options price to the formatted values
    // if (this.variant_groups.length) {
    //     for (let i = 0; i < this.variant_groups.length; i++) {
    //         for (let j = 0; j < this.variant_groups.options.length; j++) {
    //             this.variant_groups[i].options[j] = {
    //                 raw: this.variant_groups[i].options[j],
    //                 formatted: this.variant_groups[i].options[j],
    //                 formatted_with_symbol: "₼ " + this.variant_groups[i].options[j],
    //                 formatted_with_code: this.variant_groups[i].options[j] + " AZN",
    //             };
    //         };
    //     };
    // }

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