const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config({
    path: "./config.env"
});

app.use(cors());
app.use(express.json());


const PORT = process.env.PORT;
app.listen(PORT, () => console.log("Server running on port:", PORT));