const mongoose = require("mongoose");
const Product = require("./product");
const Variant = require("./variant");

const reviewSchema = mongoose.Schema({
    content: {
        type: String
    },

    rating: {
        type: Number,
        required: [true, "Please provide rating for review"],
        min: 1,
        max: 5
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "user"
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "product"
    },

    variant: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "variant"
    }
}, {
    timestamps: true,
});

//! populating
reviewSchema.pre(/find/, function (next) {
    this.populate("user");
    next();
});

//! gettingAverageRating
//? gettingAverageRating for Products
reviewSchema.statics.getAverageRatingProduct = async function (productId) {
    const data = await this.aggregate([{
            $match: {
                product: productId
            },
        },
        {
            $group: {
                _id: "$product",
                ratingQuantity: {
                    $sum: 1
                },
                ratingAverage: {
                    $avg: "$rating"
                },
            },
        },
    ]);

    if (data[0]) {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: data[0].ratingAverage,
            ratingsQuantity: data[0].ratingQuantity,
        });
    } else {
        await Product.findByIdAndUpdate(productId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
};

//? gettingAverageRating for Products
reviewSchema.statics.getAverageRatingVariant = async function (variantId) {
    const data = await this.aggregate([{
            $match: {
                variant: variantId
            },
        },
        {
            $group: {
                _id: "$variant",
                ratingQuantity: {
                    $sum: 1
                },
                ratingAverage: {
                    $avg: "$rating"
                },
            },
        },
    ]);

    if (data[0]) {
        await Variant.findByIdAndUpdate(variantId, {
            ratingsAverage: data[0].ratingAverage,
            ratingsQuantity: data[0].ratingQuantity,
        });
    } else {
        await Variant.findByIdAndUpdate(variantId, {
            ratingsAverage: 0,
            ratingsQuantity: 0,
        });
    }
};

reviewSchema.post("save", function (doc) {
    doc.constructor.getAverageRatingProduct(doc.product);
    doc.constructor.getAverageRatingVariant(doc.variant);
});

reviewSchema.post(/^findOneAnd/, function (doc) {
    doc && doc.constructor.getAverageRatingProduct(doc.product);
    doc && doc.constructor.getAverageRatingVariant(doc.variant);
});


const Review = mongoose.model("review", reviewSchema);
module.exports = Review;