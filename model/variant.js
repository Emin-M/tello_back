const mongoose = require("mongoose");

const variantSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, "ProductId is required!"]
    },

    inventory: {
        type: Number,
        default: 10
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

    ratingsAverage: {
        type: Number,
    },

    ratingsQuantity: {
        type: Number,
    },
});

variantSchema.pre("save", function (next) {
    //! converting variant price to the formatted values
    this.price = {
        raw: this.price.raw,
        formatted: this.price.raw,
        formatted_with_symbol: "₼" + this.price.raw,
        formatted_with_code: this.price.raw + " AZN",
    };

    next();
});

variantSchema.pre(/find/, function (next) {
    this.populate("assets");
    next();
});

const Variant = mongoose.model("variant", variantSchema);
module.exports = Variant;