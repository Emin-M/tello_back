const Product = require("../model/product");

//! Getting All Products
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();

        res.json({
            success: true,
            length: products.length,
            data: products
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error
        });
    }
};

//! Getting Product With "_id"
exports.getOneProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID"
            });
        }
        const product = await Product.findById(id);

        if (!product) return res.status(404).json({
            success: false,
            message: "Invalid ID"
        });

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error
        });
    };
};

//! Posting Product
exports.createProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body)

        res.json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error
        });
    }
};

//! Updating Product With "_id"
exports.updateProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID"
            });
        }
        const product = await Product.findByIdAndUpdate(id, req.body, {
            new: true
        });

        if (!product) return res.status(404).json({
            success: false,
            message: "Invalid ID"
        });

        res.json({
            success: true,
            data: product
        });

    } catch (error) {
        res.status(404).json({
            success: false,
            message: error
        });
    };
};

//! Deleting Product
exports.deleteProduct = async (req, res) => {
    try {
        const id = req.params.id;
        if (!id.match(/^[0-9a-fA-F]{24}$/)) {
            return res.status(404).json({
                success: false,
                message: "Invalid ID"
            });
        }
        const product = await Product.findByIdAndRemove(id);

        if (!product) return res.status(404).json({
            success: false,
            message: "Invalid ID"
        });

        res.json({
            success: true,
            data: `product with id ${id} deleted`
        });
    } catch (error) {
        res.status(404).json({
            success: false,
            message: error
        });
    }
};