const Review = require("../model/review");
const Product = require("../model/product");
const Variant = require("../model/variant");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");

//! Get Reviews
exports.getReviews = asyncCatch(async (req, res, next) => {
    const product_id = req.params.id;
    const reviews = await Review.find({
        $or: [{
            "product": product_id
        }, {
            "variant": product_id
        }]
    });


    res.status(200).json({
        success: true,
        reviews
    });
});

//! Create Review
exports.createReview = asyncCatch(async (req, res, next) => {
    //! checking if id for product is exist
    const {
        product_id,
        variant_id
    } = req.body;
    if (!product_id && !variant_id) return next(new GlobalError("Please provide ID for product!"));

    //! checking if product exist with given id
    const product = await Product.findById(product_id);
    const variant = await Variant.findById(variant_id);

    if (!product && !variant) return next(new GlobalError("Product doesn't exist with this ID", 404));

    const review = await Review.create({
        content: req.body.content,
        rating: req.body.rating,
        user: req.user._id,
        product: req.body.product_id,
        variant: req.body.variant_id
    });

    res.status(200).json({
        success: true,
        review
    });
});

//! Delete Review
exports.deleteReview = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const deletedReview = await Review.findByIdRemove({
        _id: id,
        user: req.user._id
    });

    if (!deletedReview) next(new GlobalError("Review doesn't exist! or doesn't belong to this user", 404));

    res.status(200).json({
        success: true,
        message: "Document deleted!"
    });
});