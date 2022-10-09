const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, "Category name is required!"]
    },

    slug: {
        type: String,
        required: [true, "Slug is required!"]
    },

    description: String,

    assets: String,

    id: Number,

    p_id: Number,

    parent_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category"
    }
});

const Category = mongoose.model("category", categorySchema);
module.exports = Category;