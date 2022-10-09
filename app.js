const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({
    path: "./config.env"
});
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const GlobalError = require("./error/GlobalError");
const errorHandler = require("./error/errorHandler");

//! Routers 
const productRouter = require("./routes/productRouter");
const categoryRouter = require("./routes/categoryRouter");
const userRouter = require("./routes/userRouter");

//! my app
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 300, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: "Limit exceeded",
});

app.use(limiter);
app.use(helmet());
app.use(cors());
app.use(express.json());

//! Environment
if (process.env.NODE_ENV.trim() == "development") {
    app.use(morgan("dev"));
};

//! routers
app.use("/api/v1/products", productRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/customers", userRouter);

//! throwing error when route does not exist
app.use((req, res, next) => {
    next(new GlobalError(`${req.originalUrl} does not exist!`, 500));
});

//! Global Error Handler
app.use(errorHandler);

//! Starting Application
const DB = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(DB, (err) => {
    if (err) return console.log(err);
    console.log("MongoDB connected");

    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log("Server running on port:", PORT));
});