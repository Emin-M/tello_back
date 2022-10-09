const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = mongoose.Schema({
    email: {
        type: String,
        required: [true, "Please provide an email!"],
        unique: true,
        validate: validator.isEmail,
    },

    phone: String,

    firstname: String,

    lastname: String,

    external_id: String,
});

const User = mongoose.model("user", userSchema);
module.exports = User;