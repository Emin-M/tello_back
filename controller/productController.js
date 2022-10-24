const Product = require("../model/product");
const GlobalFilter = require("../utils/GlobalFilter");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");

//! Getting All Products
exports.getAllProducts = asyncCatch(async (req, res, next) => {
    //! MongoDB Object
    const products = new GlobalFilter(Product.find(), req.query);
    products.filter().sort().paginate();

    const allProducts = await products.query;

    const totalResultProducts = new GlobalFilter(Product.find(), req.query);
    totalResultProducts.filter();

    const totalResult = await totalResultProducts.query;

    res.status(200).json({
        data: allProducts,
        totalResult: totalResult.length
    });
});

//! Getting Product With "_id"
exports.getOneProduct = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findById(id);

    if (!product) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json(product);
});

//! Posting Product
exports.createProduct = asyncCatch(async (req, res) => {
    const product = await Product.create(req.body)

    res.status(200).json(product);
});

//! Updating Product With "_id"
exports.updateProduct = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const product = await Product.findByIdAndUpdate(id, req.body, {
        new: true
    });

    if (!product) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json(product);
});

//! Deleting Product
exports.deleteProduct = asyncCatch(async (req, res) => {
    const id = req.params.id;
    const deletedProduct = await Product.findByIdAndRemove(id);

    if (!deletedProduct) return next(new GlobalError("InvalidID", 404));

    res.json({
        success: true,
        message: "document deleted"
    });
});