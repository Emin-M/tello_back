const {
    asyncCatch
} = require("../utils/asyncCatch");
const stripe = require("stripe")(process.env.STRIPE_SECRET);


//! Get User
exports.checkout = asyncCatch(async (req, res, next) => {
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
        }
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
        customer_creation: "always",
        customer_reference: req.user._id,
        customer_email: req.user.email,
        success_url: `https://ecommerce-tello.netlify.app/userprofile/orders`,
        cancel_url: `https://ecommerce-tello.netlify.app/error`,
    });

    res.status(201).json({
        success: true,
        session
    });
});