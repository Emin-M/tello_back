const mongoose = require("mongoose");

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
});

reviewSchema.pre(/find/, function (next) {
    this.populate("user");
    next();
});

const Review = mongoose.model("review", reviewSchema);
module.exports = Review;