const mongoose = require("mongoose");
const validator = require("validator");
const crypto = require("crypto");

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

userSchema.methods.hashEmailToken = async function () {
    const emailToken = crypto.randomBytes(12).toString("hex");

    const hashedEmailToken = crypto
        .createHash("md5")
        .update(emailToken)
        .digest("hex");

    this.emailToken = hashedEmailToken;
    this.tokenTime = Date.now() + 15 * 60 * 1000;

    return emailToken;
};

const User = mongoose.model("user", userSchema);
module.exports = User;