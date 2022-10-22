const Cart = require("../model/cart");
const Product = require("../model/product");
const Variant = require("../model/variant");
const GlobalError = require("../error/GlobalError");
const {
    asyncCatch
} = require("../utils/asyncCatch");


//! Create Cart
exports.createCart = asyncCatch(async (req, res, next) => {
    const cart = await Cart.create({});

    res.status(200).json(cart);
});

//! Add Item To The Cart
exports.addItemToCart = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const product_id = req.body.id;
    const variant_id = req.body.variant_id;
    const quantity = req.body.quantity || 1;

    //! check if cart exist
    const cart = await Cart.findById(id);
    if (!cart) return next(new GlobalError("Invalid ID", 404));

    //! check if product exist
    const product = await Product.findById(product_id);
    if (!product) return next(new GlobalError("Product doesn't exist", 404));

    //! adding to the cart based on body
    if (variant_id) {
        //! checking if variant exist and belong given id
        const variant = await Variant.findById(variant_id);
        if (!variant || variant.productId.toString() !== product_id) return next(new GlobalError("Variant doesn't exist or doesn't belong to this product", 404));

        //! checiking if product in cart
        const ifExist = cart.line_items_variant.find((variant) => {
            return variant.products._id.toString() === variant_id
        });

        if (ifExist) { // product already in cart
            cart.line_items_variant.find(
                (variant) => variant.products._id.toString() === variant_id
            ).quantity += quantity;
        } else { // adding product first time
            cart.line_items_variant.push({
                quantity: quantity,
                products: variant_id
            });
        };
    } else {
        //! checking if product in cart
        const ifExist = cart.line_items_product.find((product) => {
            return product.products._id.toString() === product_id
        });

        if (ifExist) { // product already in cart
            cart.line_items_product.find(
                (product) => product.products._id.toString() === product_id
            ).quantity += quantity;
        } else { // adding product first time
            cart.line_items_product.push({
                quantity: quantity,
                products: product_id
            });
        };
    };

    await cart.save();
    const newCart = await Cart.findById(id);

    res.status(200).json({
        cart: newCart
    });
});

//! Delete Item From The Cart
exports.deleteItemFromCart = asyncCatch(async (req, res, next) => {
    const id = req.params.cartId;
    const product_id = req.params.id;

    //! check if cart exist
    const cart = await Cart.findById(id);
    if (!cart) return next(new GlobalError("Invalid Cart ID", 404));

    //! check if product exist
    const products_p = cart.line_items_product.filter((el) => {
        if (el.products._id.toString() === product_id) return false;
        return true;
    });
    const products_v = cart.line_items_variant.filter((el) => {
        if (el.products._id.toString() === product_id) return false;
        return true;
    });

    if (!products_p && !products_v) return next(new GlobalError("Product doesn't exist in this cart!", 404));

    //! updating product
    await cart.save();
    const updatedCart = await Cart.findByIdAndUpdate(id, {
        line_items_variant: products_v,
        line_items_product: products_p
    }, {
        new: true
    });

    res.status(200).json({
        cart: updatedCart
    });
});

//! Get Cart
exports.getCart = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const cart = await Cart.findById(id);

    if (!cart) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json(cart);
});

//! Delete Cart
exports.deleteCart = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const deletedCart = await Cart.findByIdAndDelete(id);

    if (!deletedCart) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json({
        success: true,
        message: "document deleted"
    });
});

//! Empty Cart
exports.emptyCart = asyncCatch(async (req, res, next) => {
    const id = req.params.id;
    const cart = await Cart.findByIdAndUpdate(id, {
        line_items_product: [],
        line_items_variant: []
    }, {
        new: true
    });

    if (!cart) return next(new GlobalError("Invalid ID", 404));

    res.status(200).json(cart);
});