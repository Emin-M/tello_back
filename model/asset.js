const mongoose = require("mongoose");

const assetSchema = mongoose.Schema({
    filename: {
        type: String,
        required: [true, "Filename is required!"]
    },

    description: String,

    url: {
        type: String,
        required: [true, "Url is required"]
    },

    url_id: String,
});

const Asset = mongoose.model("asset", assetSchema);
module.exports = Asset;