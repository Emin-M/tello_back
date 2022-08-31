const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const morgan = require("morgan");
require("dotenv").config({
    path: "./config.env"
});

const app = express();

app.use(cors());
app.use(express.json());

//! Enverionment
if (app.get("env") === "development") {
    app.use(morgan("dev"));
};


//! Starting Application
const DB = process.env.DB_STRING.replace("<password>", process.env.DB_PASSWORD);
mongoose.connect(DB, (err) => {
    if (err) return console.log(err);
    console.log("MongoDB connected");

    const PORT = process.env.PORT;
    app.listen(PORT, () => console.log("Server running on port:", PORT));
});