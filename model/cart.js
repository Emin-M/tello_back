const mongoose = require("mongoose");

const cartSchema = mongoose.Schema({
    line_items_product: [{
        quantity: Number,
        products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "product",
        }
    }],

    line_items_variant: [{
        quantity: Number,
        products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "variant",
        }
    }]
}, {
    timestamps: true,
    toJSON: {
        virtuals: true
    }
});

//! virtuals
//? calculating total product count
cartSchema.virtual("total_items").get(function () {
    const product_count = this.line_items_product.reduce((curr, prev) => curr + prev.quantity, 0)
    const variant_count = this.line_items_variant.reduce((curr, prev) => curr + prev.quantity, 0);

    return product_count + variant_count;
});

//? calculating total unique product count
cartSchema.virtual("total_unique_items").get(function () {
    return this.line_items_product.length + this.line_items_variant.length;
});

//? calculating subtotal for cart
cartSchema.virtual("subtotal").get(function () {
    const total_for_products = this.line_items_product.reduce(
        (curr, prev) => curr + prev.quantity * prev.products.price.raw,
        0
    );
    const total_for_variants = this.line_items_variant.reduce(
        (curr, prev) => curr + prev.quantity * prev.products.price.raw,
        0
    );
    const total = total_for_products + total_for_variants;
    const subtotal = {
        raw: total,
        formatted: total.toString(),
        formatted_with_symbol: "₼" + total,
        formatted_with_code: total + " AZN",
    }
    return subtotal;
});

//? line_items for cart
cartSchema.virtual("line_items").get(function () {
    const line_items_product = [];
    const line_items_variant = [];

    //! collecting products from cart
    for (let i = 0; i < this.line_items_product.length; i++) {
        const line_total = this.line_items_product[i].products.price.raw * this.line_items_product[i].quantity;

        //! creating products for line_items
        let product = {
            "_id": this.line_items_product[i].products._id,
            "product_id": this.line_items_product[i].products._id,
            "price": this.line_items_product[i].products.price,
            "line_total": {
                raw: line_total,
                formatted: line_total.toString(),
                formatted_with_symbol: "₼" + line_total,
                formatted_with_code: line_total + " AZN",
            },
            "name": this.line_items_product[i].products.name,
            "product_name": this.line_items_product[i].products.name,
            "image": this.line_items_product[i].products.image,
            "description": this.line_items_product[i].products.description,
            "quantity": this.line_items_product[i].quantity,
        };
        line_items_product.push(product);
    };

    //! collecting variants from cart
    for (let i = 0; i < this.line_items_variant.length; i++) {
        const line_total = this.line_items_variant[i].products.price.raw * this.line_items_variant[i].quantity;

        //! creating product for line_items
        let product = {
            "_id": this.line_items_variant[i].products._id,
            "product_id": this.line_items_variant[i].products.productId,
            "price": this.line_items_variant[i].products.price,
            "line_total": {
                raw: line_total,
                formatted: line_total.toString(),
                formatted_with_symbol: "₼" + line_total,
                formatted_with_code: line_total + " AZN",
            },
            "name": this.line_items_variant[i].products.description,
            "product_name": this.line_items_variant[i].products.description,
            "image": this.line_items_variant[i].products.assets[0],
            "description": this.line_items_variant[i].products.description,
            "quantity": this.line_items_variant[i].quantity,
        };

        line_items_variant.push(product);
    };
    return [...line_items_product, ...line_items_variant];
});

//! populating before find
cartSchema.pre(/find/, function (next) {
    this.populate({
        path: "line_items_product.products",
        select: "-categories -variant_groups -related_products"
    }).populate({
        path: "line_items_variant.products",
        select: "-categories -variant_groups -related_products"
    });
    next();
});

const Cart = mongoose.model("cart", cartSchema);
module.exports = Cart;