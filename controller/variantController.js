const Variant = require("../model/variant");
const Product = require("../model/product");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");

//! Create Variant
exports.createVariant = asyncCatch(async (req, res, next) => {
    //! checking if there is product with given id
    const productId = req.params.id;
    const product = await Product.findById(productId);

    if (!product) return next(new GlobalError("There isn't product with given ID", 404));

    const variant = await Variant.create({
        productId: productId,
        sku: req.body.sku,
        description: req.body.description,
        price: req.body.price,
        assets: req.body.assets
    });

    res.status(200).json(variant);
});

//! Getting All Variants
exports.getAllvariants = asyncCatch(async (req, res) => {
    const id = req.params.id;
    const variants = await Variant.find({
        productId: id
    });

    res.status(200).json(variants);
});

//! Getting Variant By VariantId
exports.getVariant = asyncCatch(async (req, res) => {
    const id = req.params.varintId;
    const variant = await Variant.findById(id);

    if (variant) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json(variant);
});