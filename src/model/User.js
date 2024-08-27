const mongoose = require("mongoose");

// Defining the model
const userSchema = new mongoose.Schema({
    telegramId: { type: String, unique: true },
    username: { type: String, unique: true },
    password: String,
});

module.exports = mongoose.model("User", userSchema);
