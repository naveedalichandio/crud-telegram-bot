const mongoose = require("mongoose");

// Defining the model
const userSchema = new mongoose.Schema({
    telegramId: { type: String, unique: true },
    username: { type: String, unique: true },
    password: String,
    isAuthenticated: { type: Boolean, default: false },
});

module.exports = mongoose.model("User", userSchema);
