const Cart = require("../model/cart");
const Order = require("../model/order");
const {
    asyncCatch
} = require("../utils/asyncCatch");
const stripe = require("stripe")(process.env.STRIPE_SECRET);


//! Checkout
exports.checkout = asyncCatch(async (req, res, next) => {
    //! creating user
    const customer = await stripe.customers.create({
        email: req.user.email,
        metadata: {
            cart: req.body.cartId,
            userId: req.user._id.toString()
        }
    });

    //! items for cart
    const line_items = req.body.cartItems.map((item) => {
        return {
            price_data: {
                currency: "azn",
                product_data: {
                    name: item.name,
                    images: [item.image.url],
                    description: item.description,
                    metadata: {
                        id: item._id,
                    },
                },
                unit_amount: item.price.raw * 100,
            },
            quantity: item.quantity,
        };
    });

    //! shipping_options
    const shipping_options = [{
            shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: {
                    amount: 0,
                    currency: "azn",
                },
                display_name: "Free shipping",
                // Delivers between 5-7 business days
                delivery_estimate: {
                    minimum: {
                        unit: "business_day",
                        value: 5,
                    },
                    maximum: {
                        unit: "business_day",
                        value: 7,
                    },
                },
            },
        },
        {
            shipping_rate_data: {
                type: "fixed_amount",
                fixed_amount: {
                    amount: 1500,
                    currency: "azn",
                },
                display_name: "Next day air",
                // Delivers in exactly 1 business day
                delivery_estimate: {
                    minimum: {
                        unit: "business_day",
                        value: 1,
                    },
                    maximum: {
                        unit: "business_day",
                        value: 1,
                    },
                },
            },
        },
    ];

    //! stripe
    const session = await stripe.checkout.sessions.create({
        shipping_options,
        phone_number_collection: {
            enabled: true,
        },
        line_items,
        payment_method_types: ["card"],
        mode: "payment",
        customer: customer.id,
        success_url: `https://ecommerce-tello.netlify.app/userprofile/orders`,
        cancel_url: `https://ecommerce-tello.netlify.app/error`,
    });

    res.status(201).json({
        success: true,
        session
    });
});

//! webhook
exports.webhook = async (req, res) => {
    let data;
    let eventType;

    // Check if webhook signing is configured.
    let webhookSecret = process.env.STRIPE_WEB_HOOK;

    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            signature,
            webhookSecret
        );
    } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
    }
    // Extract the object from the event.
    data = event.data.object;
    eventType = event.type;

    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
        stripe.customers
            .retrieve(data.customer)
            .then(async (customer) => {
                try {
                    // CREATE ORDER
                    createOrder(customer, data);
                } catch (err) {
                    console.log(err);
                }
            })
            .catch((err) => console.log(err.message));
    };

    res.status(200).end();
};

//! creating order
const createOrder = async (customer, data) => {
    //! collecting data in one array
    let cart_items = [];
    const cart = await Cart.findById(customer.metadata.cart);
    if (cart.line_items_product[0]) {
        cart.line_items_product.forEach(item => {
            cart_items.push(item);
        });
    };
    if (cart.line_items_variant[0]) {
        cart.line_items_variant.forEach(item => {
            cart_items.push(item);
        });
    };

    //! clearing cart after payment
    await Cart.findByIdAndUpdate(customer.metadata.cart, {
        line_items_product: [],
        line_items_variant: []
    });

    //! creating products
    const products = cart_items.map((item) => {
        return {
            name: item.products.name,
            description: item.products.description,
            price: item.products.price,
            quantity: item.quantity,
        };
    });

    //! creating new order
    try {
        await Order.create({
            userId: customer.metadata.userId,
            customerId: data.customer,
            paymentIntentId: data.payment_intent,
            products,
            subtotal: data.amount_subtotal,
            total: data.amount_total,
            shipping: data.customer_details,
            payment_status: data.payment_status,
        });
    } catch (error) {
        console.log(error);
    };
};