const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config({
    path: "./config.env"
});

//! Routers 
const productRouter = require("./routes/productRouter")

const app = express();

app.use(cors());
app.use(express.json());

//! Environment
if (process.env.NODE_ENV.trim() == "development") {
    app.use(morgan("dev"));
};

//! Routing
app.use("/products", productRouter);

//! When "path" doesn't exist
app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: `${req.originalUrl} does not exist!`,
    });
});

//! Starting Application
const DB = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(DB, (err) => {
    if (err) return console.log(err);
    console.log("MongoDB connected");

    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log("Server running on port:", PORT));
});